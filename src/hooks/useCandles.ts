"use client";

import { useEffect, useRef, useState } from "react";
import { GetCandlesOptions, NormalizedCandle } from "@/types/upbitCandle";
import { fetchNormalizedCandles } from "@/utils/fetchCandles";

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
    return () => {
      ignore = true;
    };
  }, [options]);

  useEffect(() => {
    if (!options.market || data.length === 0) return;

    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
    wsRef.current = socket;

    socket.onopen = () => {
      const payload = [
        { ticket: "live-candle" },
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

        if (Math.abs(last.date.getTime() - raw.timestamp) < 5 * 60 * 1000) {
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
    if (!options.market || data.length === 0) return;

    intervalRef.current = setInterval(async () => {
      const last = data[data.length - 1];
      const lastTime = last.date.getTime();
      const now = Date.now();

      if (now - lastTime >= 60 * 1000) {
        try {
          const latest = await fetchNormalizedCandles({ ...options, count: 2 });
          const nextCandle = latest[latest.length - 1];

          const alreadyExists = data.some(
            (candle) => candle.date.getTime() === nextCandle.date.getTime()
          );

          if (!alreadyExists) {
            setData((prev) => [...prev, nextCandle]);
          }
        } catch (err) {
          console.error("⛔ 실시간 캔들 추가 실패:", err);
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