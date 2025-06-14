import CoinList from "@/components/chart/CoinList";
import React from "react";

const ChartPage = () => {
  return (
    <div className="flex flex-1 h-full">
      <div className="flex-grow p-4 pt-[64px] overflow-auto">
        <div className="h-full rounded-md" />
      </div>

      <div className="w-[320px] h-full pt-[64px] border-l border-neutral-400 overflow-hidden">
        <CoinList />
      </div>
    </div>
  );
};

export default ChartPage;