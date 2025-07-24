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
  market?: string;
}

const CoinListItem = ({
  ticker,
  korean_name,
  caution,
  onClickSameMarket,
  isLoading = false,
  market,
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
    const marketType = (ticker?.market || market || "KRW").split("-")[0];

    const getLoadingPrice = () => {
      if (marketType === "BTC") return "0.00000000 BTC";
      if (marketType === "USDT") return "$0.00";
      return "0 원";
    };

    const getLoadingVolume = () => {
      if (marketType === "BTC") return "0.000000 BTC";
      if (marketType === "USDT") return "$0.0000";
      return "0백만";
    };

    return (
      <div className="flex justify-between items-start px-2 py-1 rounded bg-white/5">
        <div className="max-w-[180px]">
          <div className="flex items-center gap-1 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="truncate text-neutral-100">종목명</span>
          </div>
          <div className="text-sm text-gray-400">{market || "마켓"}</div>
        </div>

        <div className="text-right whitespace-nowrap">
          <div className="text-base text-neutral-100">{getLoadingPrice()}</div>
          <div className="text-sm text-gray-400">0.00%</div>
          <div className="text-[10px] text-gray-400">{getLoadingVolume()}</div>
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
    const percent = (changeRate * 100).toFixed(2);
    return `${changeRate > 0 ? "+" : ""}${percent}%`;
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