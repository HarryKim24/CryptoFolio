import { useEffect, useRef, useState } from "react";
import { getMarketList, getTickerInfo } from "@/api/upbitApi";
import type { Market, Ticker } from "@/types/upbitTypes";

const useUpbitTicker = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [tickers, setTickers] = useState<Record<string, Ticker>>({});
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const all = await getMarketList();
        const krw = all.filter((m) => m.market.startsWith("KRW-") || m.market.startsWith("BTC-") || m.market.startsWith("USDT-"));
        setMarkets(krw);
      } catch (e) {
        console.error("마켓 목록 가져오기 실패:", e);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    const fetchTickers = async () => {
      if (markets.length === 0) return;
      setLoading(true);
      try {
        const codes = markets.map((m) => m.market);
        const tickerData = await getTickerInfo(codes);
        const map: Record<string, Ticker> = {};
        tickerData.forEach((t) => (map[t.market] = t));
        setTickers(map);
      } catch (e) {
        console.error("초기 티커 가져오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();
  }, [markets]);

  useEffect(() => {
    if (markets.length === 0) return;

    const codes = markets.map((m) => m.market);
    if (codes.length === 0) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify([
          { ticket: "crypto" },
          { type: "ticker", codes, isOnlyRealtime: true },
        ])
      );
    };

    socket.onmessage = async (e) => {
      const buffer = await (e.data as Blob).arrayBuffer();
      const raw = JSON.parse(new TextDecoder().decode(buffer));
      const data: Ticker = { ...raw, market: raw.code };

      setTickers((prev) => ({
        ...prev,
        [data.market]: data,
      }));
    };

    return () => {
      socket.close();
    };
  }, [markets]);

  return {
    loading,
    markets,
    tickers,
  };
};

export default useUpbitTicker;