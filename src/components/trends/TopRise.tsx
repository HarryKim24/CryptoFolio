"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Ticker, Market } from "@/types/upbitTypes";

interface CoinInfo {
  market: string;
  korean_name: string;
  trade_price: number;
  signed_change_rate: number;
}

const TopRise = () => {
  const [topCoins, setTopCoins] = useState<CoinInfo[]>([]);
  const [isNarrow, setIsNarrow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTopDailyRisers = async () => {
      try {
        const marketRes = await axios.get<Market[]>("https://api.upbit.com/v1/market/all?isDetails=false");
        const krwMarkets = marketRes.data.filter((m) => m.market.startsWith("KRW-"));

        const marketQuery = krwMarkets.map((m) => m.market).join(",");
        const tickerRes = await axios.get<Ticker[]>(
          `https://api.upbit.com/v1/ticker?markets=${marketQuery}`
        );

        const sorted = tickerRes.data
          .map((ticker) => {
            const marketInfo = krwMarkets.find((m) => m.market === ticker.market);
            return {
              market: ticker.market,
              korean_name: marketInfo?.korean_name ?? ticker.market,
              trade_price: ticker.trade_price,
              signed_change_rate: ticker.signed_change_rate,
            };
          })
          .sort((a, b) => b.signed_change_rate - a.signed_change_rate)
          .slice(0, 10);

        setTopCoins(sorted);
      } catch (err) {
        console.error("DailyTopRise fetch error:", err);
      }
    };

    fetchTopDailyRisers();
  }, []);

  // Window width listener
  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth >= 1024 && window.innerWidth <= 1250);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (market: string) => {
    router.push(`/chart/${market}`);
  };

  return (
    <section className="bg-white/5 rounded-xl p-4 shadow flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-xl font-bold">오늘의 급등 코인</h2>
      </div>
      <ol className="space-y-2 text-sm">
        {topCoins.length > 0 ? (
          topCoins.map((coin, i) => {
            const displayName = `${coin.korean_name} (${coin.market})`;
            const shouldShorten = isNarrow && displayName.length > 13;
            const shortenedName = shouldShorten
              ? displayName.slice(0, 12) + '…'
              : displayName;

            return (
              <li
                key={coin.market}
                onClick={() => handleClick(coin.market)}
                className="flex justify-between cursor-pointer overflow-hidden"
              >
                <span className="truncate whitespace-nowrap overflow-hidden max-w-none [@media(max-width:1299px)]:max-w-[200px]">
                  {i + 1}. {shortenedName}
                </span>
                <span className="text-right">
                  <span className="text-neutral-100 mr-2">
                    {coin.trade_price.toLocaleString("ko-KR")} 원
                  </span>
                  <span className="text-red-400 font-medium">
                    +{(coin.signed_change_rate * 100).toFixed(2)}%
                  </span>
                </span>
              </li>
            )
          })
        ) : (
          [...Array(10)].map((_, i) => (
            <li key={i} className="flex justify-between text-neutral-400 animate-pulse">
              <span>{i + 1}. 코인명 (KRW-ABC)</span>
              <span>₩0 +00.00%</span>
            </li>
          ))
        )}
      </ol>
    </section>
  );
};

export default TopRise;