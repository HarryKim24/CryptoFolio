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

  return { data, loading, error };
};

export default useCandles;