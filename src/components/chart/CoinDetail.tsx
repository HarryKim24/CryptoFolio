"use client";

import React from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import CoinCautionBadge from "./CautionBadge";
import { useCoinDetailData } from "@/hooks/useCoinDetailData";

type Props = {
  market: string;
  isMobile?: boolean;
  view?: "chart" | "list";
  onToggleView?: () => void;
  isChartSection?: boolean;
};

const CoinDetail = ({
  market,
  isMobile = false,
  view = "chart",
  onToggleView,
  isChartSection,
}: Props) => {
  const {
    marketInfo,
    coinSymbol,
    formattedPrice,
    formattedChange,
    formattedVolume,
    changeRate,
    rateColor,
  } = useCoinDetailData(market);

  return (
    <div className="border-b border-white/10">
      <div
        className={`md:h-[119px] p-4 ${
          isChartSection ? "pr-4" : "pr-0"
        } md:pr-4 flex justify-between items-start gap-2 lg:gap-4`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 font-medium whitespace-nowrap">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold truncate">
              {marketInfo?.korean_name ?? "알수없음"}
            </h2>
            <span className="text-lg md:text-2xl lg:text-3xl text-gray-400">
              ({coinSymbol})
            </span>
          </div>
          <div className="text-sm md:text-base lg:text-xl text-gray-400 truncate">
            {market}
          </div>
          <div className="mt-1 min-h-[20px]">
            {marketInfo && <CoinCautionBadge caution={marketInfo.market_event?.caution} />}
          </div>
        </div>

        <div className="text-right space-y-0.5 lg:space-y-1 shrink-0 flex items-center">
          <div className="flex flex-col gap-1">
            <span
              className="block text-lg md:text-xl lg:text-3xl font-semibold text-white truncate min-h-[1.5rem]"
              aria-label="price"
            >
              {formattedPrice}
            </span>
            <div className={`text-xs lg:text-base ${rateColor}`}>
              {(changeRate * 100).toFixed(2)}% ({changeRate > 0 ? "+" : ""}
              {formattedChange})
            </div>
            <div className="text-[10px] lg:text-sm text-gray-400 truncate">
              24H 거래대금: {formattedVolume}
            </div>
          </div>

          {isMobile && (
            <button
              onClick={onToggleView}
              className="p-1 text-neutral-100 bg-transparent border-none shadow-none"
              disabled={!onToggleView}
            >
              {view === "chart" ? <HiChevronRight size={40} /> : <HiChevronLeft size={40} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;