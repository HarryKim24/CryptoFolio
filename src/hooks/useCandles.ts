'use client';

import { useEffect, useRef, useState } from "react";
import { GetCandlesOptions, NormalizedCandle } from "@/types/upbitCandle";
import { fetchNormalizedCandles } from "@/utils/fetchCandles";

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === "true";

const useCandles = (options: GetCandlesOptions) => {
  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const candles = await fetchNormalizedCandles(options);
        if (!ignore) setData(candles);
      } catch (err) {
        if (!ignore) setError(err as Error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => { ignore = true };
  }, [options]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !options.market ||
      data.length === 0 ||
      !enableWebSocket
    ) return;

    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
    wsRef.current = socket;

    socket.onopen = () => {
      const payload = [
        { ticket: "realtime-candle" },
        { type: "trade", codes: [options.market] }
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

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !options.market ||
      data.length === 0 ||
      enableWebSocket
    ) return;

    const fetchPollingData = async () => {
      try {
        setLoading(true);
        const newCandles = await fetchNormalizedCandles(options);

        setData((prev) => {
          if (prev.length === 0) return newCandles;

          const existingTimestamps = new Set(prev.map(c => c.date.getTime()));
          const merged = [...prev];

          newCandles.forEach((c) => {
            if (!existingTimestamps.has(c.date.getTime())) {
              merged.push(c);
            }
          });

          return merged.sort((a, b) => a.date.getTime() - b.date.getTime());
        });
      } catch (err) {
        console.error("Polling으로 캔들 데이터 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPollingData();

    const interval = setInterval(fetchPollingData, 10000);
    return () => clearInterval(interval);
  }, [options, data.length]);

  useEffect(() => {
    if (!options.market || data.length === 0) return;

    intervalRef.current = setInterval(async () => {
      const last = data[data.length - 1];
      const now = Date.now();

      const msPerUnit = (options.unit || 1) * 60 * 1000;
      if (now - last.date.getTime() >= msPerUnit) {
        try {
          const latest = await fetchNormalizedCandles({ ...options, count: 2 });
          const nextCandle = latest[latest.length - 1];

          const alreadyExists = data.some(
            (c) => c.date.getTime() === nextCandle.date.getTime()
          );

          if (!alreadyExists) {
            setData((prev) => [...prev, nextCandle]);
          }
        } catch (err) {
          console.error("⚠️ 실시간 봉 추가 실패:", err);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data, options]);

  return { data, loading, error };
};

export default useCandles;