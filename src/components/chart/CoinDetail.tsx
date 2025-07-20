"use client";

import React from "react";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import CoinCautionBadge from "./CautionBadge";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Market } from "@/types/upbitTypes";

type Props = {
  market: string;
  isMobile?: boolean;
  view?: "chart" | "list";
  onToggleView?: () => void;
  isChartSection?: boolean;
  isLoading?: boolean;
};

const CoinDetail = ({
  market,
  isMobile = false,
  view = "chart",
  onToggleView,
  isChartSection,
  isLoading = false,
}: Props) => {
  const { tickers, markets } = useUpbitTickerContext();
  const ticker = tickers[market];
  const marketInfo = markets.find((m: Market) => m.market === market);

  const activeTab = market.split("-")[0] as "KRW" | "BTC" | "USDT";
  const coinSymbol = market.split("-")[1] ?? "--";

  const price = ticker?.trade_price ?? 0;
  const changeRate = ticker?.signed_change_rate ?? 0;
  const change = ticker?.signed_change_price ?? 0;
  const volume24h = ticker?.acc_trade_price_24h ?? 0;

  const rateColor =
    changeRate > 0 ? "text-red-400" : changeRate < 0 ? "text-blue-400" : "text-gray-300";

  const formatPrice = (value: number) => {
    if (activeTab === "KRW") return `${value.toLocaleString()} 원`;
    if (activeTab === "BTC") return `${value.toFixed(8)} BTC`;
    return value >= 1000
      ? `$${Math.round(value).toLocaleString()}`
      : `$${value.toFixed(3)}`;
  };

  const formattedPrice = formatPrice(price);
  const formattedChange = formatPrice(change);
  const formattedVolume =
    activeTab === "KRW"
      ? `${Math.floor(volume24h / 1_0000_000).toLocaleString()}백만`
      : activeTab === "BTC"
      ? `${volume24h.toFixed(6)} BTC`
      : volume24h >= 1000
      ? `$${Math.round(volume24h).toLocaleString()}`
      : `$${volume24h.toFixed(4)}`;

  return (
    <div className="border-b border-white/10">
      <div
        className={`md:h-[119px] p-4 ${isChartSection ? "pr-4" : "pr-0"} md:pr-4 flex justify-between items-start gap-2 lg:gap-4`}
      >
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex justify-between gap-2 items-start px-2 py-4 bg-white/5 animate-pulse" />
          ) : (
            <>
              <div className="flex items-center gap-1 font-medium whitespace-nowrap">
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold truncate">
                  {marketInfo?.korean_name ?? "--"}
                </h2>
                <span className="text-lg md:text-2xl lg:text-3xl text-gray-400">
                  ({coinSymbol})
                </span>
              </div>
              <div className="text-sm md:text-base lg:text-xl text-gray-400 truncate">
                {market}
              </div>
              <div className="mt-1 min-h-[20px]">
                {marketInfo && (
                  <CoinCautionBadge caution={marketInfo.market_event?.caution} />
                )}
              </div>
            </>
          )}
        </div>

        <div className="text-right space-y-0.5 lg:space-y-1 shrink-0 flex items-center">
          {isLoading ? (
            <div className="flex flex-col gap-2 w-40 xs:w-80 bg-white/5 animate-pulse">
              <div className="h-6 w-full bg-gray-500/30 rounded" />
              <div className="h-4 w-2/3 bg-gray-500/20 rounded" />
              <div className="h-3 w-3/4 bg-gray-500/10 rounded" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span
                className="block text-lg md:text-xl lg:text-3xl font-semibold text-white truncate min-h-[1.5rem]"
                aria-label="price"
              >
                {isLoading ? "\u00A0" : formattedPrice}
              </span>
              <div className={`text-xs lg:text-base ${rateColor}`}>
                {(changeRate * 100).toFixed(2)}% ({change > 0 ? "+" : ""}
                {formattedChange})
              </div>
              <div className="text-[10px] lg:text-sm text-gray-400 truncate">
                24H 거래대금: {formattedVolume}
              </div>
            </div>
          )}

          {isMobile && onToggleView && (
            <button
              onClick={onToggleView}
              className="p-1 text-neutral-100 bg-transparent border-none shadow-none"
            >
              {view === "chart" ? <HiChevronRight size={40} /> : <HiChevronLeft size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;