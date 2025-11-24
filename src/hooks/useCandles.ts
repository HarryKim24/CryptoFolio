/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import axios from 'axios';
import { GetCandlesOptions, NormalizedCandle } from '@/types/upbitTypes';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

const candleCache = new Map<string, NormalizedCandle[]>();

const makeCacheKey = (options: GetCandlesOptions) => {
  const market = options.market;
  const candleType = options.candleType;
  const unit = options.unit ?? 'default';

  return `${market}_${candleType}_${unit}`;
};

const isAbortError = (error: unknown) => {
  const isAxiosCancel = axios.isCancel(error);
  const isDomAbort =
    error instanceof DOMException && error.name === 'AbortError';

  return isAxiosCancel || isDomAbort;
};

const useCandles = (options: GetCandlesOptions) => {
  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = makeCacheKey(options);

    const setCachedCandles = (candles: NormalizedCandle[]) => {
      candleCache.set(cacheKey, candles);
      setData(candles);
    };

    const loadCandles = async () => {
      setLoading(true);
      setError(null);

      try {
        const cachedCandles = candleCache.get(cacheKey);

        if (cachedCandles && cachedCandles.length > 0) {
          setData(cachedCandles);
          return;
        }

        const candles = await fetchNormalizedCandles(
          options,
          controller.signal
        );
        setCachedCandles(candles);
      } catch (err) {
        if (isAbortError(err)) {
          return;
        }

        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };

    loadCandles();

    return () => {
      controller.abort();
    };
  }, [options]);

  useEffect(() => {
    const hasMarket = !!options.market;
    const hasData = data.length > 0;
    const canUseWebSocket = enableWebSocket;

    if (!hasMarket || !hasData || !canUseWebSocket) {
      return;
    }

    const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
    wsRef.current = socket;

    const subscribeMarket = () => {
      const ticket = { ticket: 'realtime-candle' };
      const trade = { type: 'trade', codes: [options.market as string] };

      const payload = [ticket, trade];
      const message = JSON.stringify(payload);

      socket.send(message);
    };

    const decodeMessage = async (event: MessageEvent) => {
      const blob = event.data as Blob;
      const buffer = await blob.arrayBuffer();
      const text = new TextDecoder().decode(buffer);
      const parsed = JSON.parse(text);
      return parsed;
    };

    const updateLastCandle = (raw: any) => {
      setData((prev) => {
        const hasPrevData = prev.length > 0;

        if (!hasPrevData) {
          return prev;
        }

        const updated = [...prev];
        const lastIndex = updated.length - 1;
        const lastCandle = { ...updated[lastIndex] };

        const lastTime = lastCandle.date.getTime();
        const rawTime = raw.timestamp;
        const timeDiff = Math.abs(lastTime - rawTime);
        const fiveMinutes = 1000 * 60 * 5;

        if (timeDiff < fiveMinutes) {
          lastCandle.close = raw.trade_price;
          lastCandle.volume = lastCandle.volume + raw.trade_volume;
          updated[lastIndex] = lastCandle;
        }

        return updated;
      });
    };

    const handleOpen = () => {
      subscribeMarket();
    };

    const handleMessage = async (event: MessageEvent) => {
      const raw = await decodeMessage(event);
      updateLastCandle(raw);
    };

    socket.onopen = handleOpen;
    socket.onmessage = handleMessage;

    return () => {
      socket.close();
    };
  }, [options.market, data.length]);

  return {
    data,
    loading,
    error,
    cache: candleCache,
  };
};

export default useCandles;