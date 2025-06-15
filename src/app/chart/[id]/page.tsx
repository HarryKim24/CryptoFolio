"use client";

import CoinList from "@/components/chart/CoinList";
import React from "react";

const ChartPage = () => {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="w-full min-w-[1080px] h-full overflow-auto p-2">
        <div className="text-sm h-full flex flex-col bg-chart-gradient/10 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
        </div>
      </div>

      <div className="w-[320px] min-w-[320px] h-full overflow-y-auto p-2">
        <CoinList />
      </div>
    </div>
  );
};

export default ChartPage;
