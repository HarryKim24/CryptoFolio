'use client';

import { useEffect, useRef, useState } from 'react';
import { GetCandlesOptions, NormalizedCandle } from '@/types/upbitCandle';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import axios from 'axios';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

const candleCache = new Map<string, NormalizedCandle[]>();

const makeCacheKey = (options: GetCandlesOptions) => {
  const { market, candleType, unit } = options;
  return `${market}_${candleType}_${unit ?? 'default'}`;
};

const useCandles = (options: GetCandlesOptions) => {
  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const key = makeCacheKey(options);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (candleCache.has(key)) {
          setData(candleCache.get(key)!);
        } else {
          const candles = await fetchNormalizedCandles(options, controller.signal);
          candleCache.set(key, candles);
          setData(candles);
        }
      } catch (err) {
        if (axios.isCancel(err) || (err instanceof DOMException && err.name === 'AbortError')) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [options]);

  useEffect(() => {
    if (!options.market || data.length === 0 || !enableWebSocket) return;

    const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
    wsRef.current = socket;

    socket.onopen = () => {
      const payload = [
        { ticket: 'realtime-candle' },
        { type: 'trade', codes: [options.market] },
      ];
      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = async (event) => {
      const buffer = await (event.data as Blob).arrayBuffer();
      const raw = JSON.parse(new TextDecoder().decode(buffer));

      setData((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };

        if (Math.abs(last.date.getTime() - raw.timestamp) < 1000 * 60 * 5) {
          last.close = raw.trade_price;
          last.volume += raw.trade_volume;
          updated[updated.length - 1] = last;
        }

        return updated;
      });
    };

    return () => {
      socket.close();
    };
  }, [options.market, data.length]);

  return { data, loading, error, cache: candleCache };
};

export default useCandles;