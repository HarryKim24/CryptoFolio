'use client';
import { create } from 'zustand';
import type { Market, Ticker as RestTicker } from '@/types/upbitTypes';


export type WsTicker = { code: string };
export type Ticker = RestTicker;


export type UpbitTickerState = {
tickers: Record<string, Ticker>;
markets: Market[];
loading: boolean;
setTickers: (fn: (prev: Record<string, Ticker>) => Record<string, Ticker>) => void;
setTickersMap: (map: Record<string, Ticker>) => void;
setMarkets: (markets: Market[]) => void;
setLoading: (v: boolean) => void;
};


export const useUpbitTickerStore = create<UpbitTickerState>((set) => ({
tickers: {},
markets: [],
loading: true,
setTickers: (fn) => set((s) => ({ tickers: fn(s.tickers) })),
setTickersMap: (map) => set({ tickers: map }),
setMarkets: (markets) => set({ markets }),
setLoading: (v) => set({ loading: v }),
}));