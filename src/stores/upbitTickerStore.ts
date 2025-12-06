'use client';

import { create } from 'zustand';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';

export type Ticker = RestTicker;

interface UpbitTickerState {
  tickers: Ticker[];
  markets: Market[];
  loading: boolean;

  setTickers: (tickers: Ticker[]) => void;
  setMarkets: (markets: Market[]) => void;
  setLoading: (value: boolean) => void;
}

export const useUpbitTickerStore = create<UpbitTickerState>((set) => ({
  tickers: [],
  markets: [],
  loading: true,

  setTickers: (tickers) => {
    set({ tickers });
  },

  setMarkets: (markets) => {
    set({ markets });
  },

  setLoading: (value) => {
    set({ loading: value });
  },
}));