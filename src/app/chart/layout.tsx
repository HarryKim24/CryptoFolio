"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { parseMarketTab } from "@/lib/market";

const CoinList = dynamic(() => import("@/components/chart/CoinList"), {
  ssr: false,
  loading: () => (
    <div className="text-sm h-full flex justify-center items-center text-neutral-300 bg-white/5 rounded-xl shadow">
      로딩 중입니다...
    </div>
  ),
});

const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const currentMarket = typeof params?.id === "string" ? params.id : "";
  const initialTab = parseMarketTab(currentMarket);

  const handleClickSameMarket = () => {};

  return (
    <div className="h-screen p-4 pt-16 w-full bg-chart-gradient text-neutral-100 overflow-hidden">
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-hidden relative">{children}</div>

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