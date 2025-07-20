"use client";

export const dynamic = "force-static";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CoinDetail from "@/components/chart/CoinDetail";
import CoinChart from "@/components/chart/CoinChart";
import CoinList from "@/components/chart/CoinList";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import { motion } from "framer-motion";
import { Market } from "@/types/upbitTypes";

type MarketTab = "KRW" | "BTC" | "USDT";

const ChartPage = () => {
  const params = useParams();
  const { tickers, markets } = useUpbitTickerContext();

  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<"chart" | "list">("chart");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mq.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handleResize);
    return () => mq.removeEventListener("change", handleResize);
  }, []);

  const market = typeof params?.id === "string" ? params.id : "";
  const isInitialLoading =
    !market || Object.keys(tickers).length === 0 || markets.length === 0;

  const tab = market.split("-")[0] as MarketTab;

  const isInvalidMarket =
    !isInitialLoading &&
    (!market.includes("-") || !markets.find((m: Market) => m.market === market));

  const validTicker = tickers[market];
  const isChartLoading = isInitialLoading || !validTicker;

  return (
    <div className="flex-1 h-full overflow-hidden relative flex flex-col">
      <div className="w-full min-w-[320px] h-full p-2">
        <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
          
          {(!isMobile || view === "chart") && (
            <CoinDetail
              market={market}
              isMobile={isMobile}
              view={view}
              onToggleView={() => setView(view === "chart" ? "list" : "chart")}
              isLoading={isChartLoading}
            />
          )}

          <div className="flex-1 relative min-h-0">
            {isInvalidMarket ? (
              <div className="flex justify-center items-center h-full text-neutral-100">
                잘못된 경로입니다.
              </div>
            ) : !isMobile || view === "chart" ? (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full"
              >
                {isChartLoading ? (
                  <div className="flex flex-col gap-4 h-full w-full p-4 animate-pulse">
                    <div className="h-6 w-16 xs:w-32 bg-gray-500/20 rounded" />
                    <div className="flex-1 bg-gray-500/10 rounded-xl" />
                  </div>
                ) : (
                  <CoinChart market={market} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full overflow-y-auto"
              >
                <CoinList
                  initialTab={tab}
                  currentMarket={market}
                  onClickSameMarket={() => setView("chart")}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;