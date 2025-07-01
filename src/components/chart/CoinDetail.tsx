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
};

const CoinDetail = ({ market, isMobile = false, view = "chart", onToggleView }: Props) => {
  const { tickers, markets } = useUpbitTickerContext();
  const ticker = tickers[market];
  const marketInfo = markets.find((m: Market) => m.market === market);

  if (!ticker || !marketInfo) return null;

  const activeTab = market.split("-")[0] as "KRW" | "BTC" | "USDT";
  const coinSymbol = market.split("-")[1];

  const price = ticker.trade_price;
  const changeRate = ticker.signed_change_rate;
  const change = ticker.signed_change_price;
  const volume24h = ticker.acc_trade_price_24h;

  const rateColor =
    changeRate > 0 ? "text-red-400" : changeRate < 0 ? "text-blue-400" : "text-gray-300";

  const formatPrice = (value: number) => {
    if (activeTab === "KRW") {
      return `${value.toLocaleString()} 원`;
    } else if (activeTab === "BTC") {
      return `${value.toFixed(8)} BTC`;
    } else {
      return value >= 1000
        ? `$${Math.round(value).toLocaleString()}`
        : `$${value.toFixed(3)}`;
    }
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
      <div className="h-[119px] p-4 pr-0 md:pr-4 flex justify-between items-start gap-2 lg:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 font-medium whitespace-nowrap">
            <h2 className="text-2xl lg:text-3xl font-bold truncate">{marketInfo.korean_name}</h2>
            <span className="text-2xl lg:text-3xl  text-gray-400">({coinSymbol})</span>
          </div>
          <div className="text-base lg:text-xl text-gray-400 truncate">{market}</div>
          <div className="mt-1 min-h-[20px]">
            <CoinCautionBadge caution={marketInfo.market_event?.caution} />
          </div>
        </div>

        <div className="text-right space-y-0.5 lg:space-y-1 shrink-0 flex items-center">
          <div>
            <div className="text-xl lg:text-3xl font-semibold text-white truncate">{formattedPrice}</div>
            <div className={`text-xs lg:text-base ${rateColor}`}>
              {(changeRate * 100).toFixed(2)}% ({change > 0 ? `+${formattedChange}` : formattedChange})
            </div>
            <div className="text-[10px] lg:text-sm text-gray-400 truncate">
              24H 거래대금: {formattedVolume}
            </div>
          </div>

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