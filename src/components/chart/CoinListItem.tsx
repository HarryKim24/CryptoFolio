"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Ticker, CautionType } from "@/types/upbitTypes";
import CoinCautionBadge from "./CautionBadge";
import React from "react";

interface CoinListItemProps {
  ticker?: Ticker;
  korean_name?: string;
  caution?: CautionType;
  onClickSameMarket?: () => void;
  isLoading?: boolean;
}

const CoinListItem = ({
  ticker,
  korean_name,
  caution,
  onClickSameMarket,
  isLoading = false,
}: CoinListItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const targetPath = `/chart/${ticker?.market}`;
  const isActive = pathname === targetPath;

  const handleClick = () => {
    if (isActive) {
      onClickSameMarket?.();
    } else if (ticker?.market) {
      router.push(targetPath);
    }
  };

  if (isLoading || !ticker || !korean_name) {
    return (
      <div className="flex justify-between items-start px-2 py-3 rounded bg-white/5 animate-pulse">
        <div className="space-y-1">
          <div className="w-24 h-4 bg-gray-500/30 rounded" />
          <div className="w-16 h-3 bg-gray-500/20 rounded" />
        </div>
        <div className="space-y-1 text-right">
          <div className="w-16 h-4 bg-gray-500/30 rounded" />
          <div className="w-12 h-3 bg-gray-500/20 rounded" />
          <div className="w-24 h-3 bg-gray-500/10 rounded" />
        </div>
      </div>
    );
  }

  const tradePrice = ticker.trade_price;
  const changeRate = ticker.signed_change_rate;
  const accVolume = ticker.acc_trade_price_24h;

  const getCautionCount = (cautionObj: CautionType | undefined): number => {
    if (!cautionObj) return 0;
    return Object.values(cautionObj).filter(Boolean).length;
  };

  const isCompact = korean_name.length >= 7 || getCautionCount(caution) >= 2;

  const renderPrice = () => {
    if (tradePrice == null) return "--";
    if (ticker.market.startsWith("KRW")) return `${tradePrice.toLocaleString()} 원`;
    if (ticker.market.startsWith("BTC")) return `${tradePrice.toFixed(8)} BTC`;
    return tradePrice >= 1000
      ? `$${Math.round(tradePrice).toLocaleString()}`
      : `$${tradePrice.toFixed(3)}`;
  };

  const renderChangeRate = () => {
    if (changeRate == null) return "--";
    return `${(changeRate * 100).toFixed(2)}%`;
  };

  const renderVolume = () => {
    if (accVolume == null) return "--";
    if (ticker.market.startsWith("KRW"))
      return `${Math.floor(accVolume / 1_0000_000).toLocaleString()}백만`;
    if (ticker.market.startsWith("BTC")) return `${accVolume.toFixed(6)} BTC`;
    return accVolume >= 1000
      ? `$${Math.round(accVolume).toLocaleString()}`
      : `$${accVolume.toFixed(4)}`;
  };

  return (
    <div
      onClick={handleClick}
      className="flex justify-between items-start px-2 py-1 rounded cursor-pointer hover:ring-1 ring-white/10 hover:bg-white/5"
    >
      <div className="max-w-[180px]">
        <div className="flex items-center gap-1 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="truncate">{korean_name}</span>
          <CoinCautionBadge caution={caution} compact={isCompact} />
        </div>
        <div className="text-sm text-gray-400">{ticker.market}</div>
      </div>

      <div className="text-right whitespace-nowrap">
        <div className="text-base">{renderPrice()}</div>
        <div
          className={`text-sm ${
            changeRate > 0
              ? "text-red-400"
              : changeRate < 0
              ? "text-blue-400"
              : "text-gray-300"
          }`}
        >
          {renderChangeRate()}
        </div>
        <div className="text-[10px] text-gray-400">{renderVolume()}</div>
      </div>
    </div>
  );
};

export default CoinListItem;