'use client';

import { useEffect } from 'react';
import axios from 'axios';
import type { Market, Ticker } from '@/types/upbitTypes';
import { useUpbitTickerStore } from '@/stores/upbitTickerStore';

export const UpbitTickerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const markets = useUpbitTickerStore((state) => state.markets);
  const { setMarkets, setLoading, setTickers } = useUpbitTickerStore();

  useEffect(() => {
    let isMounted = true;

    const fetchMarkets = async () => {
      try {
        const response = await axios.get<Market[]>('/api/proxy/market', {
          params: { isDetails: true },
        });

        if (!isMounted) return;

        const filteredMarkets = response.data.filter((market) => {
          const name = market.market;
          return name.startsWith('KRW-') || name.startsWith('BTC-') || name.startsWith('USDT-');
        });

        setMarkets(filteredMarkets);
      } catch (error) {
        console.error('마켓 로딩 실패:', error);
      }
    };

    fetchMarkets();

    return () => {
      isMounted = false;
    };
  }, [setMarkets]);

  useEffect(() => {
    if (typeof window === 'undefined' || markets.length === 0) return;

    const fetchTickers = async () => {
      try {
        const codes = markets.map((m) => m.market).join(',');
        
        const response = await axios.get<Ticker[]>('/api/proxy/ticker', {
          params: { markets: codes },
        });

        setTickers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ticker 조회 에러:', err);
      }
    };

    fetchTickers();

    const intervalId = setInterval(fetchTickers, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [markets, setTickers, setLoading]); 

  return <>{children}</>;
};