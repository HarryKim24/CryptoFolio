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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rawParam = params?.id;
  if (!rawParam || typeof rawParam !== "string") {
    return <div className="p-4 text-white">잘못된 경로입니다.</div>;
  }

  const raw = decodeURIComponent(rawParam);
  const market = raw;

  const validTicker = tickers[market];
  const validMarketInfo = markets.find((m) => m.market === market);

  if (!raw.includes("-")) {
    return <div className="p-4 text-white">잘못된 경로입니다.</div>;
  }

  if (!validTicker || !validMarketInfo) {
    return <div className="p-4 text-white">해당 마켓 정보 없음</div>;
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
          <div className="text-sm h-full flex flex-col bg-chart-gradient/10 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
            <CoinDetail
              market={market}
              isMobile={isMobile}
              view={view}
              onToggleView={() => setView(view === "chart" ? "list" : "chart")}
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