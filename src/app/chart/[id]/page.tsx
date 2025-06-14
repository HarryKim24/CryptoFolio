import CoinList from "@/components/chart/CoinList";
import React from "react";

const ChartPage = () => {
  return (
    <div style={{ height: "calc(100vh - 64px)" }} className="flex">
      <div className="w-3/4 p-4 border-r border-gray-700 overflow-auto pt-[64px]">
      </div>

      <div className="w-1/4 p-4 overflow-auto pt-[64px]">
        <CoinList />
      </div>
    </div>
  );
};

export default ChartPage;