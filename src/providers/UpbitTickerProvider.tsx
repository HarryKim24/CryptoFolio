'use client';

import { useEffect, useRef } from 'react';
import type React from 'react';
import axios from 'axios';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';
import { useUpbitTickerStore } from '@/stores/upbitTickerStore';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

type WsTicker = { code: string };
type Ticker = RestTicker;

const toCommonTicker = (ticker: WsTicker | RestTicker): Ticker => {
  let market = '';

  if ('code' in ticker) {
    market = ticker.code;
  } else {
    market = ticker.market;
  }

  const restTicker = ticker as RestTicker;

  return {
    ...restTicker,
    market,
  };
};

export const UpbitTickerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const markets = useUpbitTickerStore((state) => state.markets);
  const { setMarkets, setLoading, setTickers, setTickersMap } =
    useUpbitTickerStore((state) => state);

  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let isAlive = true;
    const controller = new AbortController();

    const fetchMarkets = async () => {
      try {
        const response = await axios.get<Market[]>('/api/proxy/market', {
          params: { isDetails: true },
          signal: controller.signal,
        });

        if (!isAlive) {
          return;
        }

        const filteredMarkets = response.data.filter((market) => {
          const name = market.market;

          if (name.startsWith('KRW-')) return true;
          if (name.startsWith('BTC-')) return true;
          if (name.startsWith('USDT-')) return true;

          return false;
        });

        setMarkets(filteredMarkets);
      } catch (_) {
        if (axios.isCancel(_)) {
          return;
        }

        console.error('마켓 정보 로딩 실패', _);
      }
    };

    fetchMarkets();

    return () => {
      isAlive = false;
      controller.abort();
    };
  }, [setMarkets]);

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';

    if (!hasWindow) {
      return;
    }

    if (markets.length === 0) {
      return;
    }

    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }

    if (enableWebSocket) {
      const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
      wsRef.current = socket;

      const codes = markets.map((market) => market.market);

      const handleOpen = () => {
        const ticket = { ticket: 'ticker' };
        const type = { type: 'ticker', codes };
        const message = JSON.stringify([ticket, type]);
        socket.send(message);
      };

      const handleMessage = (event: MessageEvent) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (!reader.result) {
            return;
          }

          const text = reader.result.toString();
          const rawTicker = JSON.parse(text) as WsTicker;
          const ticker = toCommonTicker(rawTicker);

          setTickers((previous) => {
            return {
              ...previous,
              [ticker.market]: ticker,
            };
          });

          setLoading(false);
        };

        reader.readAsText(event.data);
      };

      const handleError = (event: Event) => {
        console.error('WS error', event);
      };

      socket.onopen = handleOpen;
      socket.onmessage = handleMessage;
      socket.onerror = handleError;

      return () => {
        try {
          socket.close();
        } catch {}

        if (wsRef.current === socket) {
          wsRef.current = null;
        }
      };
    }

    let isFirstFetch = true;

    const fetchTickers = async () => {
      try {
        if (isFirstFetch) {
          setLoading(true);
        }

        const codes = markets.map((market) => market.market);
        const joinedCodes = codes.join(',');

        const response = await axios.get<RestTicker[]>('/api/proxy/ticker', {
          params: { markets: joinedCodes },
        });

        const tickerMap: Record<string, Ticker> = {};

        response.data.forEach((item) => {
          const ticker = toCommonTicker(item);
          tickerMap[ticker.market] = ticker;
        });

        setTickersMap(tickerMap);
      } catch (_) {
        console.error('Polling 실패:', _);
      } finally {
        if (isFirstFetch) {
          setLoading(false);
          isFirstFetch = false;
        }
      }
    };

    fetchTickers();

    pollRef.current = setInterval(fetchTickers, 1500);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [markets, setLoading, setTickers, setTickersMap]);

  return <>{children}</>;
};