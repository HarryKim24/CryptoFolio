'use client';

import { useEffect, useRef } from 'react';
import type React from 'react';
import axios from 'axios';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';
import { useUpbitTickerStore } from '@/stores/upbitTickerStore';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

type Ticker = RestTicker;

type WsTicker = Omit<Ticker, 'market'> & { code: string };

const toCommonTicker = (ticker: WsTicker | RestTicker): Ticker => {
  if ('code' in ticker) {
    const { code, ...rest } = ticker;
    return {
      ...rest,
      market: code,
    } as Ticker;
  }
  
  return ticker;
};

export const UpbitTickerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const markets = useUpbitTickerStore((state) => state.markets);
  const { setMarkets, setLoading, setTickers, updateTicker } = useUpbitTickerStore();

  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    let isMounted = true;

    const fetchMarkets = async () => {
      try {
        const response = await axios.get<Market[]>('/api/proxy/market', {
          params: { isDetails: true },
        });

        if (!isMounted) return;

        const filteredMarkets = response.data.filter((market) => {
          const name = market.market;
          return name.startsWith('KRW-') || name.startsWith('BTC-') || name.startsWith('USDT-');
        });

        setMarkets(filteredMarkets);
      } catch (error) {
        console.error('마켓 로딩 실패:', error);
      }
    };

    fetchMarkets();

    return () => {
      isMounted = false;
    };
  }, [setMarkets]);

  useEffect(() => {
    if (typeof window === 'undefined' || markets.length === 0) return;

    const fetchTickers = async () => {
      try {
        const codes = markets.map((m) => m.market).join(',');
        
        const response = await axios.get<RestTicker[]>('/api/proxy/ticker', {
          params: { markets: codes },
        });

        const cleanData = response.data.map((item) => toCommonTicker(item));
        
        setTickers(cleanData);
        setLoading(false);
      } catch (err) {
        console.error('Ticker 폴링 에러:', err);
      }
    };

    fetchTickers();
    const intervalId = setInterval(fetchTickers, 1000);

    if (enableWebSocket) {
      if (wsRef.current) wsRef.current.close();

      const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
      wsRef.current = socket;
      socket.binaryType = 'blob'; 

      socket.onopen = () => {
        const codes = markets.map((m) => m.market);
        const message = JSON.stringify([
          { ticket: 'ticker-list' },
          { type: 'ticker', codes, isOnlyRealtime: true }
        ]);
        socket.send(message);
      };

      socket.onmessage = async (event) => {
        try {
          let text = '';
          if (event.data instanceof Blob) {
            text = await event.data.text();
          } else {
            text = event.data as string;
          }

          if (!text) return;

          const rawTicker = JSON.parse(text) as WsTicker;
          const ticker = toCommonTicker(rawTicker);

          updateTicker(ticker);
          
        } catch (e) {
          console.error('WS 파싱 에러', e);
        }
      };
      
      socket.onerror = (e) => console.error('WS Error', e);
    }

    return () => {
      clearInterval(intervalId);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [markets, setTickers, updateTicker, setLoading]); 

  return <>{children}</>;
}