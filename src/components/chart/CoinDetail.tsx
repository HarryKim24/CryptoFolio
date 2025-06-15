"use client";

import React from "react";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import CoinCautionBadge from "./CautionBadge";

type Props = {
  market: string;
};

const CoinDetail = ({ market }: Props) => {
  const { tickers, markets } = useUpbitTickerContext();
  const ticker = tickers[market];
  const marketInfo = markets.find((m) => m.market === market);

  if (!ticker || !marketInfo) return null;

  const activeTab = market.split("-")[0] as "KRW" | "BTC" | "USDT";
  const coinSymbol = market.split("-")[1];

  const price = ticker.trade_price;
  const changeRate = ticker.signed_change_rate;
  const change = ticker.signed_change_price;
  const volume24h = ticker.acc_trade_price_24h;

  const rateColor =
    changeRate > 0 ? "text-red-400" : changeRate < 0 ? "text-blue-400" : "text-gray-300";

  const formattedPrice =
    activeTab === "KRW"
      ? `${price.toLocaleString()}₩`
      : activeTab === "BTC"
      ? `${price.toFixed(8)} BTC`
      : price >= 1000
      ? `$${Math.round(price).toLocaleString()}`
      : `$${price.toFixed(3)}`;

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
      <div className="h-[119px] px-4 py-2 lg:px-12 lg:py-4 flex justify-between items-center gap-2 lg:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 font-medium whitespace-nowrap">
            <h2 className="text-xl lg:text-3xl font-bold truncate">{marketInfo.korean_name}</h2>
            <span className="text-sm lg:text-lg text-gray-400">({coinSymbol})</span>
          </div>
          <div className="text-xs lg:text-base text-gray-400 truncate">{market}</div>
          <div className="mt-1 min-h-[20px]">
            <CoinCautionBadge caution={marketInfo.market_event?.caution} />
          </div>
        </div>

        <div className="text-right space-y-0.5 lg:space-y-1 shrink-0">
          <div className="text-base lg:text-2xl font-semibold text-white truncate">{formattedPrice}</div>
          <div className={`text-xs lg:text-base ${rateColor}`}>
            {(changeRate * 100).toFixed(2)}% ({change.toLocaleString()})
          </div>
          <div className="text-[10px] lg:text-sm text-gray-400 truncate">
            24H 거래대금: {formattedVolume}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;