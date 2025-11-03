"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const CoinList = dynamic(() => import("@/components/chart/CoinList"), { ssr: false });

type MarketTab = "KRW" | "BTC" | "USDT";
const toMarketTab = (value: string): MarketTab => (value === "KRW" || value === "BTC" || value === "USDT" ? value : "KRW");

const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const currentMarket = typeof params?.id === "string" ? params.id : "";
  const [view, setView] = useState<"chart" | "list">("chart");

  const handleClickSameMarket = () => setView("chart");
  const initialTab = toMarketTab(currentMarket.split("-")[0]);

  return (
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
  );
};

export default ChartLayout;