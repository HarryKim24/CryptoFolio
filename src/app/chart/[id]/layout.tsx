"use client";

import React from "react";
import useUpbitTicker from "@/hooks/useUpbitTicker";
import { UpbitTickerContext } from "@/context/UpbitTickerContext";

const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading, tickers, markets } = useUpbitTicker();

  return (
    <UpbitTickerContext.Provider value={{ loading, tickers, markets }}>
      <div className="min-h-screen h-screen bg-chart-gradient text-white flex flex-col">
        {children}
      </div>
    </UpbitTickerContext.Provider>
  );
};

export default ChartLayout;