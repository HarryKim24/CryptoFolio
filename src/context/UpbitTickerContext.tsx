'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import type { Market, Ticker } from "@/types/upbitTypes";

export const UpbitTickerContext = createContext<UpbitTickerContextValue | null>(null);

interface UpbitTickerContextValue {
  tickers: Record<string, Ticker>;
  markets: Market[];
  loading: boolean;
}

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === "true";

export const UpbitTickerProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickers, setTickers] = useState<Record<string, Ticker>>({});
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await axios.get<Market[]>("/api/proxy/market", {
          params: { isDetails: true },
        });
        const krwMarkets = res.data.filter((m) => m.market.startsWith("KRW-"));
        setMarkets(krwMarkets);
      } catch (err) {
        console.error("마켓 정보 로딩 실패", err);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      markets.length === 0 ||
      !enableWebSocket
    ) return;

    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
    wsRef.current = socket;

    socket.onopen = () => {
      const ticket = { ticket: "ticker" };
      const type = { type: "ticker", codes: markets.map((m) => m.market) };
      socket.send(JSON.stringify([ticket, type]));
    };

    socket.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (!reader.result) return;
        const json = JSON.parse(reader.result.toString());
        setTickers((prev) => ({ ...prev, [json.code]: json }));
        setLoading(false);
      };
      reader.readAsText(event.data);
    };

    return () => socket.close();
  }, [markets]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      markets.length === 0 ||
      enableWebSocket
    ) return;

    const fetchPollingTickers = async () => {
      try {
        setLoading(true);
        const codes = markets.map((m) => m.market);
        const res = await axios.get<Ticker[]>("/api/proxy/ticker", {
          params: { markets: codes.join(",") },
        });
        const map: Record<string, Ticker> = {};
        res.data.forEach((t) => {
          map[t.market] = t;
        });
        setTickers(map);
      } catch (err) {
        console.error("Polling으로 티커 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPollingTickers();

    const interval = setInterval(fetchPollingTickers, 1000);
    return () => clearInterval(interval);
  }, [markets]);

  return (
    <UpbitTickerContext.Provider value={{ tickers, markets, loading }}>
      {children}
    </UpbitTickerContext.Provider>
  );
};

export const useUpbitTickerContext = () => {
  const ctx = useContext(UpbitTickerContext);
  if (!ctx) {
    throw new Error("useUpbitTickerContext must be used within a UpbitTickerProvider");
  }
  return ctx;
};