import { useEffect, useState } from 'react';
import { Market } from '@/types/upbitTypes';

type CoinChange = {
  market: string;
  korean_name: string;
  trade_price: number;
  signed_change_rate: number;
};

type TrendData = {
  ubmiValue: number;
  ubaiValue: number;
  topRise: CoinChange[];
  topFall: CoinChange[];
};

type UpbitTicker = {
  market: string;
  trade_price: number;
  acc_trade_volume_24h: number;
  signed_change_rate: number;
};

export const useTrendData = (): TrendData => {
  const [data, setData] = useState<TrendData>({
    ubmiValue: 0,
    ubaiValue: 0,
    topRise: [],
    topFall: [],
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const marketRes = await fetch('/api/proxy/market');
        if (!marketRes.ok) {
          throw new Error('마켓 API 오류');
        }

        const markets: Market[] = await marketRes.json();
        const krwMarkets = markets.filter((item) =>
          item.market.startsWith('KRW-')
        );

        if (!krwMarkets.length) return;

        const marketList = krwMarkets.map((item) => item.market).join(',');
        const tickerRes = await fetch(
          `/api/proxy/ticker?markets=${encodeURIComponent(marketList)}`
        );
        if (!tickerRes.ok) {
          throw new Error('티커 API 오류');
        }

        const tickersRaw = await tickerRes.json();
        if (cancelled || !Array.isArray(tickersRaw)) return;

        const tickers = tickersRaw as UpbitTicker[];

        let ubmiSum = 0;
        let ubaiSum = 0;

        const enriched: CoinChange[] = tickers.map((ticker) => {
          const info = krwMarkets.find(
            (item) => item.market === ticker.market
          );
          const volumeValue =
            ticker.trade_price * ticker.acc_trade_volume_24h;

          ubmiSum += volumeValue;
          if (ticker.market !== 'KRW-BTC') {
            ubaiSum += volumeValue;
          }

          return {
            market: ticker.market,
            korean_name: info?.korean_name ?? ticker.market,
            trade_price: ticker.trade_price,
            signed_change_rate: ticker.signed_change_rate,
          };
        });

        enriched.sort(
          (a, b) => b.signed_change_rate - a.signed_change_rate
        );

        setData({
          ubmiValue: ubmiSum,
          ubaiValue: ubaiSum,
          topRise: enriched.slice(0, 5),
          topFall: [...enriched].reverse().slice(0, 5),
        });
      } catch (error) {
        if (!cancelled) {
          console.error('Trend data fetch failed:', error);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
};

export type { CoinChange, TrendData };