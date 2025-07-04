import { useEffect, useState } from "react";
import { getMarketList, getTickerInfo } from "@/api/upbitApi";
import type { Market, Ticker } from "@/types/upbitTypes";

const useUpbitCoin = (marketCode: string) => {
  const [market, setMarket] = useState<Market | null>(null);
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const markets = await getMarketList();
        const found = markets.find((m) => m.market === marketCode);
        setMarket(found || null);

        if (found) {
          const [tickerData] = await getTickerInfo([marketCode]);
          setTicker(tickerData);
        }
      } catch (e) {
        console.error("업비트 코인 정보 가져오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [marketCode]);

  return { market, ticker, loading };
};

export default useUpbitCoin;