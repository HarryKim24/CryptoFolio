"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import useUpbitTicker from "@/hooks/useUpbitTicker";
import { UpbitTickerContext } from "@/context/UpbitTickerContext";
import { useParams } from "next/navigation";

const CoinList = dynamic(() => import("@/components/chart/CoinList"), {
  ssr: false,
});

type MarketTab = "KRW" | "BTC" | "USDT";

const toMarketTab = (value: string): MarketTab => {
  if (value === "KRW" || value === "BTC" || value === "USDT") return value;
  return "KRW";
};

const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading, tickers, markets } = useUpbitTicker();
  const params = useParams();
  const currentMarket = typeof params?.id === "string" ? params.id : "";
  const [view, setView] = useState<"chart" | "list">("chart");

  const handleClickSameMarket = () => {
    setView("chart");
  };

  const initialTab = toMarketTab(currentMarket.split("-")[0]);

  const contextValue = useMemo(
    () => ({ loading, tickers, markets }),
    [loading, tickers, markets]
  );

  return (
    <UpbitTickerContext.Provider value={contextValue}>
      <div className="h-screen p-4 pt-16 w-full bg-chart-gradient text-neutral-100 overflow-hidden">
        <div className="flex h-full overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            {view === "chart" && children}
          </div>

          <div className="w-[320px] hidden md:block h-full pl-0 p-4">
            <CoinList
              initialTab={initialTab}
              currentMarket={currentMarket}
              onClickSameMarket={handleClickSameMarket}
            />
          </div>
        </div>
      </div>
    </UpbitTickerContext.Provider>
  );
};

export default ChartLayout;