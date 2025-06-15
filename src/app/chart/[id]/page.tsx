"use client";

import { useParams } from "next/navigation";
import CoinDetail from "@/components/chart/CoinDetail";
import CoinList from "@/components/chart/CoinList";
import CoinChart from "@/components/chart/CoinChart";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";

type MarketTab = "KRW" | "BTC" | "USDT";

const ChartPage = () => {
  const params = useParams();
  const { tickers, markets } = useUpbitTickerContext();
  const raw = decodeURIComponent((params?.id ?? "") as string);
  const market = raw;

  const isReady = Object.keys(tickers).length > 0 && markets.length > 0;
  const validTicker = tickers[market];
  const validMarketInfo = markets.find((m) => m.market === market);

  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="w-6 h-6 border-2 border-t-transparent border-white/20 rounded-full animate-spin" />
      </div>
    );
  }

  if (!raw.includes("-")) {
    return <div className="p-4 text-white">잘못된 경로입니다.</div>;
  }

  if (!validTicker || !validMarketInfo) {
    return <div className="p-4 text-white">해당 마켓 정보 없음</div>;
  }

  const tab = market.split("-")[0] as MarketTab;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="w-full min-w-[320px] h-full overflow-auto p-2">
        <div className="text-sm h-full flex flex-col bg-chart-gradient/10 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
          <CoinDetail market={market} />
          <div className="flex-1 relative">
            <CoinChart market={market} />
          </div>
        </div>
      </div>

      <div className="w-[320px] min-w-[320px] h-full overflow-y-auto p-2">
        <CoinList initialTab={tab} />
      </div>
    </div>
  );
};

export default ChartPage;