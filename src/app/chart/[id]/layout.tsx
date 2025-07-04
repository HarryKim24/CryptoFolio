"use client";

import React from "react";
import useUpbitTicker from "@/hooks/useUpbitTicker";
import { UpbitTickerContext } from "@/context/UpbitTickerContext";

const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading, tickers, markets } = useUpbitTicker();

  return (
    <UpbitTickerContext.Provider value={{ loading, tickers, markets }}>
      <div className="h-screen pt-16 w-full bg-chart-gradient text-neutral-100 flex flex-col overflow-hidden">
        {children}
      </div>
    </UpbitTickerContext.Provider>
  );
};

export default ChartLayout;