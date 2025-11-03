'use client';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';
import { useUpbitTickerStore } from '@/stores/upbitTickerStore';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

type WsTicker = { code: string };
type Ticker = RestTicker;

const toCommonTicker = (t: WsTicker | RestTicker): Ticker => {
  const market = 'code' in t ? t.code : t.market;
  return { ...(t as RestTicker), market };
};

export const UpbitTickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const markets = useUpbitTickerStore((s) => s.markets);
  const { setMarkets, setLoading, setTickers, setTickersMap } = useUpbitTickerStore((s) => s);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let alive = true;
    const ctl = new AbortController();

    (async () => {
      try {
        const res = await axios.get<Market[]>('/api/proxy/market', {
          params: { isDetails: true },
          signal: ctl.signal,
        });
        if (!alive) return;
        const filtered = res.data.filter(
          (m) =>
            m.market.startsWith('KRW-') ||
            m.market.startsWith('BTC-') ||
            m.market.startsWith('USDT-')
        );
        setMarkets(filtered);
      } catch (e) {
        if (axios.isCancel(e)) return;
        console.error('마켓 정보 로딩 실패', e);
      }
    })();

    return () => {
      alive = false;
      ctl.abort();
    };
  }, [setMarkets]);

  useEffect(() => {
    if (typeof window === 'undefined' || markets.length === 0) return;

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

      socket.onopen = () => {
        const ticket = { ticket: 'ticker' };
        const type = { type: 'ticker', codes: markets.map((m) => m.market) };
        socket.send(JSON.stringify([ticket, type]));
      };

      socket.onmessage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (!reader.result) return;
          const raw = JSON.parse(reader.result.toString()) as WsTicker;
          const obj = toCommonTicker(raw);
          setTickers((prev) => ({ ...prev, [obj.market]: obj }));
          setLoading(false);
        };
        reader.readAsText(event.data);
      };

      socket.onerror = (e) => console.error('WS error', e);

      return () => {
        try {
          socket.close();
        } catch {}
        if (wsRef.current === socket) wsRef.current = null;
      };
    }

    const first = { value: true };
    const fetchTickers = async () => {
      try {
        if (first.value) setLoading(true);
        const codes = markets.map((m) => m.market);
        const res = await axios.get<RestTicker[]>('/api/proxy/ticker', {
          params: { markets: codes.join(',') },
        });
        const map: Record<string, Ticker> = {};
        res.data.forEach((t) => {
          const obj = toCommonTicker(t);
          map[obj.market] = obj;
        });
        setTickersMap(map);
      } catch (err) {
        console.error('Polling 실패:', err);
      } finally {
        if (first.value) {
          setLoading(false);
          first.value = false;
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