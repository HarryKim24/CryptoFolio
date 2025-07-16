"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Ticker } from "@/types/upbitTypes";
import CoinCautionBadge from "./CautionBadge";
import React from "react";

interface CoinListItemProps {
  ticker: Ticker;
  korean_name: string;
  caution?: {
    PRICE_FLUCTUATIONS: boolean;
    TRADING_VOLUME_SOARING: boolean;
    DEPOSIT_AMOUNT_SOARING: boolean;
    GLOBAL_PRICE_DIFFERENCES: boolean;
    CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
  };
  onClickSameMarket?: () => void;
}

const CoinListItem = ({
  ticker,
  korean_name,
  caution,
  onClickSameMarket,
}: CoinListItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const targetPath = `/chart/${ticker.market}`;

  const isActive = pathname === targetPath;

  const handleClick = () => {
    if (isActive) {
      onClickSameMarket?.();
    } else {
      router.push(targetPath);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-start px-2 py-1 rounded cursor-pointer hover:ring-1 ring-white/10 hover:bg-white/5 ${
        isActive ? "bg-white/10" : ""
      }`}
    >
      <div>
        <div className="flex items-center gap-1 text-base font-medium flex-wrap">
          <span>{korean_name}</span>
          <CoinCautionBadge caution={caution} />
        </div>
        <div className="text-sm text-gray-400">{ticker.market}</div>
      </div>

      <div className="text-right">
        <div className="text-base">
          {typeof ticker.trade_price === "number" ? (
            ticker.market.startsWith("KRW") ? (
              `${ticker.trade_price.toLocaleString()} 원`
            ) : ticker.market.startsWith("BTC") ? (
              `${ticker.trade_price.toFixed(8)} BTC`
            ) : ticker.trade_price >= 1000 ? (
              `$${Math.round(ticker.trade_price).toLocaleString()}`
            ) : (
              `$${ticker.trade_price.toFixed(3)}`
            )
          ) : (
            "-"
          )}
        </div>

        <div
          className={`text-sm ${
            ticker.signed_change_rate > 0
              ? "text-red-400"
              : ticker.signed_change_rate < 0
              ? "text-blue-400"
              : "text-gray-300"
          }`}
        >
          {typeof ticker.signed_change_rate === "number"
            ? `${(ticker.signed_change_rate * 100).toFixed(2)}%`
            : "-"}
        </div>

        <div className="text-[10px] text-gray-400">
          {typeof ticker.acc_trade_price_24h === "number" ? (
            ticker.market.startsWith("KRW") ? (
              `${Math.floor(ticker.acc_trade_price_24h / 1_0000_000).toLocaleString()}백만`
            ) : ticker.market.startsWith("BTC") ? (
              `${ticker.acc_trade_price_24h.toFixed(6)} BTC`
            ) : ticker.acc_trade_price_24h >= 1000 ? (
              `$${Math.round(ticker.acc_trade_price_24h).toLocaleString()}`
            ) : (
              `$${ticker.acc_trade_price_24h.toFixed(4)}`
            )
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinListItem;