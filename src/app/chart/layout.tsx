"use client";

import useUpbitTicker from "@/hooks/useUpbitTicker";
import { UpbitTickerContext } from "@/context/UpbitTickerContext";
import CoinList from "@/components/chart/CoinList";
import { useParams } from "next/navigation";
import { useState } from "react";

type MarketTab = "KRW" | "BTC" | "USDT";

function toMarketTab(value: string): MarketTab {
  if (value === "KRW" || value === "BTC" || value === "USDT") return value;
  return "KRW";
}

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  const { loading, tickers, markets } = useUpbitTicker();
  const params = useParams();
  const currentMarket = typeof params?.id === "string" ? params.id : "";

  const [view, setView] = useState<"chart" | "list">("chart");

  const handleClickSameMarket = () => {
    setView("chart");
  };

  const initialTab = toMarketTab(currentMarket.split("-")[0]);

  return (
    <UpbitTickerContext.Provider value={{ loading, tickers, markets }}>
      <div className="h-screen p-4 pt-16 w-full bg-chart-gradient text-neutral-100 overflow-hidden">
        <div className="flex h-full overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            {view === "chart" && children}
          </div>
          <div className="w-[320px] hidden md:block h-full p-2">
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
}