"use client";

import { useEffect, useState } from "react";
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
        const marketResponse = await axios.get<Market[]>(
          "/api/proxy/v1/market/all",
          {
            params: { isDetails: false },
          }
        );

        const marketList = marketResponse.data;

        const krwMarkets = marketList.filter((marketItem) => {
          return marketItem.market.startsWith("KRW-");
        });

        const marketQuery = krwMarkets.map((marketItem) => marketItem.market).join(",");

        const tickerResponse = await axios.get<Ticker[]>(
          "/api/proxy/v1/ticker",
          {
            params: { markets: marketQuery },
          }
        );

        const tickerList = tickerResponse.data;

        const coinInfos: CoinInfo[] = tickerList.map((tickerItem) => {
          const marketInfo = krwMarkets.find(
            (marketItem) => marketItem.market === tickerItem.market
          );

          const koreanName =
            marketInfo && marketInfo.korean_name
              ? marketInfo.korean_name
              : tickerItem.market;

          return {
            market: tickerItem.market,
            korean_name: koreanName,
            trade_price: tickerItem.trade_price,
            signed_change_rate: tickerItem.signed_change_rate,
          };
        });

        const sortedCoins = coinInfos
          .slice()
          .sort((first, second) => {
            return second.signed_change_rate - first.signed_change_rate;
          })
          .slice(0, 10);

        setTopCoins(sortedCoins);
      } catch (error) {
        console.error("DailyTopRise fetch error:", error);
      }
    };

    fetchTopDailyRisers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isNarrowWidth = width >= 1024 && width <= 1250;
      setIsNarrow(isNarrowWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (market: string) => {
    router.push(`/chart/${market}`);
  };

  const getDisplayName = (coin: CoinInfo) => {
    const baseName = `${coin.korean_name} (${coin.market})`;

    const shouldShorten = isNarrow && baseName.length > 13;

    if (shouldShorten) {
      const shortened = baseName.slice(0, 12);
      return `${shortened}…`;
    }

    return baseName;
  };

  const getFormattedPrice = (price: number | null | undefined) => {
    if (price == null) {
      return "-";
    }

    const localizedPrice = price.toLocaleString("ko-KR");
    return `${localizedPrice} 원`;
  };

  const getFormattedRate = (rate: number | null | undefined) => {
    if (rate == null) {
      return "0.0%";
    }

    const rateNumber = rate * 100;
    const rateText = rateNumber.toFixed(1);
    const sign = rate >= 0 ? "+" : "";

    return `${sign}${rateText}%`;
  };

  const getRateColorClass = (rate: number | null | undefined) => {
    if (rate == null) {
      return "text-blue-400";
    }

    if (rate >= 0) {
      return "text-red-400";
    }

    return "text-blue-400";
  };

  const skeletonItems = Array.from({ length: 10 });

  return (
    <section className="bg-white/5 rounded-xl p-4 shadow flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-xl font-bold">오늘의 급등 코인</h2>
      </div>

      <ol className="space-y-2 text-sm">
        {topCoins.length > 0 ? (
          topCoins.map((coin, index) => {
            const displayName = getDisplayName(coin);
            const formattedPrice = getFormattedPrice(coin.trade_price);
            const formattedRate = getFormattedRate(coin.signed_change_rate);
            const rateColorClass = getRateColorClass(coin.signed_change_rate);

            return (
              <li
                key={coin.market}
                onClick={() => handleClick(coin.market)}
                className="flex justify-between cursor-pointer overflow-hidden"
              >
                <span className="truncate whitespace-nowrap overflow-hidden max-w-none [@media(max-width:1299px)]:max-w-[200px]">
                  {index + 1}. {displayName}
                </span>
                <span className="flex gap-2 pl-2 whitespace-nowrap">
                  <span className="min-w-[80px] text-right text-neutral-100 truncate">
                    {formattedPrice}
                  </span>
                  <span
                    className={`min-w-[60px] text-right font-medium ${rateColorClass}`}
                  >
                    {formattedRate}
                  </span>
                </span>
              </li>
            );
          })
        ) : (
          skeletonItems.map((_, index) => (
            <li
              key={index}
              className="flex justify-between text-neutral-400 animate-pulse"
            >
              <span>{index + 1}. 코인명 (KRW-COIN)</span>
              <span className="flex gap-2 pl-2 whitespace-nowrap">
                <span className="min-w-[80px] text-right text-neutral-100 truncate">
                  0 원
                </span>
                <span className="min-w-[60px] text-right font-medium text-red-400">
                  +0.0%
                </span>
              </span>
            </li>
          ))
        )}
      </ol>
    </section>
  );
};

export default TopRise;