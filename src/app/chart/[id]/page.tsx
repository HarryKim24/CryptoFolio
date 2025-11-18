"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import useIsMobile from "@/hooks/useIsMobile";
import { useUpbitTickerStore } from "@/stores/upbitTickerStore";
import { parseMarketTab, MarketTab } from "@/lib/market";
import CoinDetail from "@/components/chart/CoinDetail";
import CoinList from "@/components/chart/CoinList";

const CoinChart = dynamic(() => import("@/components/chart/CoinChart"), {
  ssr: false,
});

const ChartPage = () => {
  const params = useParams();
  const market = typeof params?.id === "string" ? params.id : "";

  const tickers = useUpbitTickerStore((s) => s.tickers);
  const markets = useUpbitTickerStore((s) => s.markets);
  const loading = useUpbitTickerStore((s) => s.loading);

  const [view, setView] = useState<"chart" | "list">("chart");
  const isMobile = useIsMobile();

  const isInitialLoading =
    loading || !market || Object.keys(tickers).length === 0 || markets.length === 0;

  const isInvalidMarket =
    !isInitialLoading &&
    (!market.includes("-") || !markets.some((m) => m.market === market));

  const tab: MarketTab = parseMarketTab(market);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 h-full overflow-hidden relative flex flex-col">
        <div className="w-full min-w-[320px] h-full p-4">
          <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
            {(!isMobile || view === "chart") && (
              <CoinDetail
                market={market}
                isMobile={isMobile}
                view={view}
                onToggleView={() => setView(view === "chart" ? "list" : "chart")}
              />
            )}

            <div className="flex-1 relative min-h-0 flex flex-col overflow-hidden">
              {isInitialLoading ? (
                <div className="flex justify-center items-center h-full text-neutral-300">
                  로딩 중입니다...
                </div>
              ) : isInvalidMarket ? (
                <div className="flex justify-center items-center h-full text-neutral-100">
                  잘못된 경로입니다.
                </div>
              ) : !isMobile || view === "chart" ? (
                <motion.div key="chart" className="flex-1 overflow-hidden">
                  <CoinChart market={market} />
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

      <div className="w-[320px] hidden md:block h-full pl-0 p-4">
        <CoinList
          initialTab={tab}
          currentMarket={market}
          onClickSameMarket={() => setView("chart")}
        />
      </div>
    </div>
  );
};

export default ChartPage;