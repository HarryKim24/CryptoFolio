import { createContext, useContext } from "react";
import type { Ticker, Market } from "@/types/upbitTypes";

interface UpbitTickerContextValue {
  tickers: Record<string, Ticker>;
  markets: Market[];
  loading: boolean;
}

export const UpbitTickerContext = createContext<UpbitTickerContextValue | null>(null);

export const useUpbitTickerContext = () => {
  const ctx = useContext(UpbitTickerContext);
  if (!ctx) {
    throw new Error("useUpbitTickerContext must be used within a UpbitTickerProvider");
  }
  return ctx;
};
