"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnimatedNumber } from "@/utils/animatedNumber";
import { PortfolioStats } from "@/utils/calculateStats";

interface Props {
  stats: PortfolioStats | null;
}

const AssetSummary = ({ stats }: Props) => {
  const animatedProfit = useAnimatedNumber(stats?.allTimeProfit ?? 0, { duration: 2000 });

  if (!stats) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full text-neutral-100">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="w-full bg-white/5 rounded-xl shadow p-4 animate-pulse h-[68px]" />
          <div className="w-full bg-white/5 rounded-xl shadow p-4 animate-pulse h-[68px]" />
        </div>
        <div className="w-full bg-white/5 rounded-xl shadow p-4 animate-pulse h-[124px] lg:h-[152px]" />
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full text-neutral-100"
    >
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="w-full items-center bg-white/5 transition shadow p-4 rounded-xl flex flex-row justify-between">
          <div className="text-xl font-bold text-neutral-100">평가금액</div>
          <div className="text-2xl font-bold">
            {Math.floor(stats.evaluation).toLocaleString()} 원
          </div>
        </div>

        <div className="w-full items-center bg-white/5 shadow p-4 rounded-xl flex flex-row justify-between">
          <div className="text-xl font-bold text-neutral-100">총 투자금</div>
          <div className="text-2xl font-bold">
            {Math.floor(stats.totalBuy).toLocaleString()} 원
          </div>
        </div>
      </div>

      <div className="w-full bg-white/5 shadow p-4 rounded-xl flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-neutral-100">총 수익</div>
          <div
            className={`text-2xl lg:text-3xl font-bold ${
              stats.allTimeProfit >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {stats.allTimeProfit > 0 ? "+" : ""}
            {Math.floor(animatedProfit).toLocaleString()} 원
          </div>
        </div>
        <div className="text-xs mt-1 text-gray-300">
          <div className="flex justify-between lg:text-base">
            <span>실현 수익</span>
            <span
              className={`${
                stats.realisedProfit >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"
              }`}
            >
              {stats.realisedProfit > 0 ? "+" : ""}
              {Math.floor(stats.realisedProfit).toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between lg:text-base">
            <span>미실현 수익</span>
            <span
              className={`${
                stats.unrealisedProfit >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"
              }`}
            >
              {stats.unrealisedProfit > 0 ? "+" : ""}
              {Math.floor(stats.unrealisedProfit).toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between lg:text-base">
            <span>총 수익률</span>
            <span
              className={`${
                stats.profitRate >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"
              }`}
            >
              {stats.profitRate > 0 ? "+" : ""}
              {stats.profitRate.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AssetSummary;