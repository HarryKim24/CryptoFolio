import { useEffect, useState } from 'react';
import axios from 'axios';
import { Market } from '@/types/upbitTypes';

export type CoinChange = {
  market: string;
  korean_name: string;
  trade_price: number;
  signed_change_rate: number;
};

export type TrendData = {
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
    const fetchData = async () => {
      try {
        const marketRes = await axios.get<Market[]>('/api/proxy/market', {
          params: { isDetails: true },
        });
        
        const krwMarkets = marketRes.data.filter((item) =>
          item.market.startsWith('KRW-')
        );

        if (krwMarkets.length === 0) return;

        const marketList = krwMarkets.map((item) => item.market).join(',');
        const tickerRes = await axios.get<UpbitTicker[]>('/api/proxy/ticker', {
          params: { markets: marketList },
        });

        const tickers = tickerRes.data;

        const coinList: CoinChange[] = [];
        let ubmiSum = 0;
        let ubaiSum = 0;

        tickers.forEach((ticker) => {
          const marketInfo = krwMarkets.find(m => m.market === ticker.market);
          const volumeVal = ticker.trade_price * ticker.acc_trade_volume_24h;
          
          ubmiSum += volumeVal;
          if (ticker.market !== 'KRW-BTC') {
            ubaiSum += volumeVal;
          }

          coinList.push({
            market: ticker.market,
            korean_name: marketInfo?.korean_name ?? ticker.market,
            trade_price: ticker.trade_price,
            signed_change_rate: ticker.signed_change_rate,
          });
        });

        const riseList = [...coinList].sort((a, b) => b.signed_change_rate - a.signed_change_rate);
        const topRise = riseList.slice(0, 5);
        const fallList = [...coinList].sort((a, b) => a.signed_change_rate - b.signed_change_rate);
        const topFall = fallList.slice(0, 5);

        setData({
          ubmiValue: ubmiSum,
          ubaiValue: ubaiSum,
          topRise,
          topFall,
        });

      } catch (error) {
        console.error('트렌드 데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};