'use client';

import { create } from 'zustand';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';
export type Ticker = RestTicker;

interface UpbitTickerState {
  tickers: Ticker[];
  markets: Market[];
  loading: boolean;

  setTickers: (tickers: Ticker[]) => void;
  updateTicker: (ticker: Ticker) => void;
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

  updateTicker: (newTicker) => {
    set((state) => {

      const index = state.tickers.findIndex((t) => t.market === newTicker.market);
      const newTickers = [...state.tickers];

      if (index !== -1) {
        newTickers[index] = newTicker;
      } else {
        newTickers.push(newTicker);
      }

      return { tickers: newTickers };
    });
  },

  setMarkets: (markets) => {
    set({ markets });
  },

  setLoading: (value) => {
    set({ loading: value });
  },
}))