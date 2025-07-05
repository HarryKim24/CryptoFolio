import { useEffect, useRef, useState } from "react";
import { getMarketList, getTickerInfo } from "@/api/upbitApi";
import type { Market, Ticker } from "@/types/upbitTypes";

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === "true";

const useUpbitTicker = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [tickers, setTickers] = useState<Record<string, Ticker>>({});
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const all = await getMarketList();
        const krw = all.filter(
          (m) =>
            m.market.startsWith("KRW-") ||
            m.market.startsWith("BTC-") ||
            m.market.startsWith("USDT-")
        );
        setMarkets(krw);
      } catch (e) {
        console.error("마켓 목록 가져오기 실패:", e);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

    const fetchTickers = async () => {
      setLoading(true);
      try {
        const codes = markets.map((m) => m.market);
        const tickerData = await getTickerInfo(codes);
        const map: Record<string, Ticker> = {};
        tickerData.forEach((t) => {
          map[t.market] = t;
        });
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
    if (
      typeof window === "undefined" ||
      markets.length === 0 ||
      !enableWebSocket
    ) return;

    const codes = markets.map((m) => m.market);
    if (codes.length === 0) return;

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
      try {
        const buffer = await (e.data as Blob).arrayBuffer();
        const raw = JSON.parse(new TextDecoder().decode(buffer));
        const market = raw.code;
        const data: Ticker = { ...raw, market };

        setTickers((prev) => {
          const prevData = prev[market];
          if (
            !prevData ||
            prevData.trade_price !== data.trade_price ||
            prevData.acc_trade_price !== data.acc_trade_price
          ) {
            return {
              ...prev,
              [market]: data,
            };
          }
          return prev;
        });
      } catch (err) {
        console.error("WebSocket 데이터 처리 실패:", err);
      }
    };

    return () => {
      socket.close();
    };
  }, [markets]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      markets.length === 0 ||
      enableWebSocket
    ) return;

    const fetchTickers = async () => {
      try {
        setLoading(true);
        const codes = markets.map((m) => m.market);
        const tickerData = await getTickerInfo(codes);
        const map: Record<string, Ticker> = {};
        tickerData.forEach((t) => {
          map[t.market] = t;
        });
        setTickers(map);
      } catch (err) {
        console.error("Polling으로 티커 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();

    const interval = setInterval(fetchTickers, 10000);
    return () => clearInterval(interval);
  }, [markets]);

  return {
    loading,
    markets,
    tickers,
  };
};

export default useUpbitTicker;