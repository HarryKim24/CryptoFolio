"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CoinDetail from "@/components/chart/CoinDetail";
import CoinList from "@/components/chart/CoinList";
import CoinChart from "@/components/chart/CoinChart";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import { motion } from "framer-motion";

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

  const market = params?.id;
  if (!market || typeof market !== "string" || !market.includes("-")) {
    return (
      <div className="flex justify-center items-center h-full text-neutral-100">
        잘못된 경로입니다.
      </div>
    );
  }

  const isLoading =
    Object.keys(tickers).length === 0 || markets.length === 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-6 h-6 border-1 border-neutral-100 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const validTicker = tickers[market];
  const validMarketInfo = markets.find((m) => m.market === market);

  if (!validTicker || !validMarketInfo) {
    return (
      <div className="flex justify-center items-center h-full text-neutral-100">
        해당 마켓 정보 없음
      </div>
    );
  }

  const tab = market.split("-")[0] as MarketTab;

  return (
    <div className="flex flex-1 h-full overflow-hidden flex-col md:flex-row relative">
      {(!isMobile || view === "chart") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full min-w-[320px] h-full p-2"
        >
          <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
            <CoinDetail
              market={market}
              isMobile={isMobile}
              view={view}
              onToggleView={() =>
                setView(view === "chart" ? "list" : "chart")
              }
            />
            <div className="flex-1 relative min-h-0">
              <CoinChart market={market} />
            </div>
          </div>
        </motion.div>
      )}

      {(!isMobile || view === "list") && (
        <div className="w-full md:w-[320px] min-w-[320px] h-full p-2">
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full"
          >
            <div className="h-full overflow-y-auto">
              <CoinList
                initialTab={tab}
                currentMarket={market}
                onClickSameMarket={() => isMobile && setView("chart")}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChartPage;