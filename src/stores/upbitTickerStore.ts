'use client';

import { create } from 'zustand';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';

export type WsTicker = { code: string };
export type Ticker = RestTicker;

export type UpbitTickerState = {
  tickers: Record<string, Ticker>;
  markets: Market[];
  loading: boolean;
  setTickers: (
    fn: (prev: Record<string, Ticker>) => Record<string, Ticker>
  ) => void;
  setTickersMap: (map: Record<string, Ticker>) => void;
  setMarkets: (markets: Market[]) => void;
  setLoading: (value: boolean) => void;
};

export const useUpbitTickerStore = create<UpbitTickerState>((set) => ({
  tickers: {},
  markets: [],
  loading: true,
  setTickers: (updateFn) => {
    set((state) => {
      const next = updateFn(state.tickers);
      return { tickers: next };
    });
  },
  setTickersMap: (map) => {
    set({ tickers: map });
  },
  setMarkets: (markets) => {
    set({ markets });
  },
  setLoading: (value) => {
    set({ loading: value });
  },
}));