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

export const UpbitTickerProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickers, setTickers] = useState<Record<string, Ticker>>({});
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await axios.get<Market[]>("https://api.upbit.com/v1/market/all?isDetails=true");
        const krwMarkets = res.data.filter((m) => m.market.startsWith("KRW-"));
        setMarkets(krwMarkets);
      } catch (err) {
        console.error("마켓 정보 로딩 실패", err);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

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