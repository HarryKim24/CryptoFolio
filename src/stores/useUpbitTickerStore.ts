'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import axios from 'axios';
import type { Market, Ticker } from '@/types/upbitTypes';

type State = {
  loading: boolean;
  markets: Market[];
  tickers: Record<string, Ticker>;
  enabledWS: boolean;
};

type Actions = {
  init: () => Promise<void>;
  startLive: () => void;
  stopLive: () => void;
  startPolling: () => void;
  stopPolling: () => void;
  refreshTickersOnce: () => Promise<void>;
  clear: () => void;
};

let ws: WebSocket | null = null;
let pollId: ReturnType<typeof setInterval> | null = null;

let batch: Ticker[] = [];
let batching = false;
const enqueue = (t: Ticker, flush: (items: Ticker[]) => void, ms = 50) => {
  batch.push(t);
  if (batching) return;
  batching = true;
  setTimeout(() => {
    batching = false;
    const items = batch;
    batch = [];
    flush(items);
  }, ms);
};

export const useUpbitTickerStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => ({
    loading: true,
    markets: [],
    tickers: {},
    enabledWS: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true',

    init: async () => {
      set({ loading: true });
      try {
        const res = await axios.get<Market[]>('/api/proxy/market', {
          params: { isDetails: true },
        });
        const allowed = res.data.filter(
          (m) =>
            m.market.startsWith('KRW-') ||
            m.market.startsWith('BTC-') ||
            m.market.startsWith('USDT-')
        );
        set({ markets: allowed });

        await get().refreshTickersOnce();

        if (get().enabledWS) get().startLive();
        else get().startPolling();
      } catch {
      } finally {
        set({ loading: false });
      }
    },

    refreshTickersOnce: async () => {
      const codes = get().markets.map((m) => m.market);
      if (codes.length === 0) return;

      const res = await axios.get<Ticker[]>('/api/proxy/ticker', {
        params: { markets: codes.join(',') },
      });
      const map: Record<string, Ticker> = {};
      res.data.forEach((t) => {
        map[t.market] = t;
      });
      set({ tickers: map });
    },

    startLive: () => {
      const { markets } = get();
      if (ws || markets.length === 0) return;

      ws = new WebSocket('wss://api.upbit.com/websocket/v1');

      ws.onopen = () => {
        const ticket = { ticket: 'ticker' };
        const type = {
          type: 'ticker',
          codes: markets.map((m) => m.market),
          isOnlyRealtime: true,
        };
        ws?.send(JSON.stringify([ticket, type]));
      };

      ws.onmessage = async (event) => {
        try {
          const buf = await (event.data as Blob).arrayBuffer();
          const json = JSON.parse(new TextDecoder().decode(buf));
          const market = json.code as string;
          const data: Ticker = { ...json, market };

          enqueue(
            data,
            (items) =>
              set((s) => {
                const next = { ...s.tickers };
                for (const t of items) {
                  const prev = next[t.market];
                  if (
                    !prev ||
                    prev.trade_price !== t.trade_price ||
                    prev.acc_trade_price !== t.acc_trade_price
                  ) {
                    next[t.market] = t;
                  }
                }
                return { tickers: next };
              }),
            50
          );
        } catch {
        }
      };

      ws.onerror = () => {
        get().stopLive();
        get().startPolling();
      };
    },

    stopLive: () => {
      if (ws) {
        try {
          ws.close();
        } catch {}
        ws = null;
      }
    },

    startPolling: () => {
      if (pollId) return;
      pollId = setInterval(() => {
        get().refreshTickersOnce().catch(() => {});
      }, 1000);
    },

    stopPolling: () => {
      if (pollId) {
        clearInterval(pollId);
        pollId = null;
      }
    },

    clear: () => {
      get().stopLive();
      get().startPolling();
      set({ markets: [], tickers: {}, loading: false });
    },
  }))
);