"use client";

import { useParams } from "next/navigation";
import CoinDetail from "@/components/chart/CoinDetail";
import CoinList from "@/components/chart/CoinList";
import CoinChart from "@/components/chart/CoinChart";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import { motion } from "framer-motion";

type MarketTab = "KRW" | "BTC" | "USDT";

const ChartPage = () => {
  const params = useParams();
  const { tickers, markets } = useUpbitTickerContext();

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
    <div className="flex flex-1 h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full min-w-[320px] h-full p-2"
      >
        <div className="text-sm h-full flex flex-col bg-chart-gradient/10 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
          <CoinDetail market={market} />
          <div className="flex-1 relative min-h-0">
            <CoinChart market={market} />
          </div>
        </div>
      </motion.div>

      <div className="w-[320px] min-w-[320px] h-full p-2">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeIn" }}
          className="h-full"
        >
          <div className="h-full overflow-y-auto">
            <CoinList initialTab={tab} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChartPage;