'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import { GetCandlesOptions, NormalizedCandle } from '@/types/upbitTypes';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

const useCandles = (options: GetCandlesOptions) => {
  const { market, candleType, unit, count, to } = options;

  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!market) return;

    let isMounted = true;

    const loadCandles = async () => {
      setLoading(true);
      setData([]);
      setError(null);

      try {
        const candles = await fetchNormalizedCandles({
          market,
          candleType,
          unit,
          count,
          to
        });
        
        if (isMounted) {
          setData(candles);
        }
      } catch (err) {
        if (isMounted) {
          console.error('캔들 로딩 실패:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCandles();

    return () => {
      isMounted = false;
    };
  }, [market, candleType, unit, count, to]); 

  useEffect(() => {
    if (!market || !enableWebSocket) {
      return;
    }

    if (wsRef.current) wsRef.current.close();

    const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
    wsRef.current = socket;
    socket.binaryType = 'blob'; 

    socket.onopen = () => {
      socket.send(JSON.stringify([
        { ticket: 'realtime-candle' },
        { type: 'trade', codes: [market] }
      ]));
    };

    socket.onmessage = async (event) => {
      try {
        let text = '';
        if (event.data instanceof Blob) {
          text = await event.data.text();
        } else {
          text = event.data;
        }
        
        if (!text) return;
        const raw = JSON.parse(text);
        
        setData((prev) => {
          if (prev.length === 0) return prev;
          
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const lastCandle = { ...updated[lastIndex] };

          const lastTime = lastCandle.date.getTime();
          const rawTime = raw.timestamp;
          const intervalMs = getIntervalMs(unit, candleType);

          if (Math.abs(lastTime - rawTime) < intervalMs) {
            lastCandle.close = raw.trade_price;
            lastCandle.high = Math.max(lastCandle.high, raw.trade_price);
            lastCandle.low = Math.min(lastCandle.low, raw.trade_price);
            lastCandle.volume = lastCandle.volume + raw.trade_volume;
            updated[lastIndex] = lastCandle;
          } 
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    };

    return () => socket.close();
  }, [market, unit, candleType]);

  return {
    data,
    loading,
    error,
  };
};

function getIntervalMs(unit: number | undefined, type: string): number {
  if (type === 'days') return 24 * 60 * 60 * 1000;
  if (type === 'weeks') return 7 * 24 * 60 * 60 * 1000;
  if (type === 'months') return 30 * 24 * 60 * 60 * 1000;
  return (unit ?? 1) * 60 * 1000;
}

export default useCandles;