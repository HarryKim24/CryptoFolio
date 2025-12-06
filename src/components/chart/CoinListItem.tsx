"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Ticker, CautionType } from "@/types/upbitTypes";
import CoinCautionBadge from "./CautionBadge";

type Props = {
  ticker: Ticker;
  korean_name: string;
  caution?: CautionType;
  isActive: boolean;
  onClick: () => void;
};

const formatPrice = (price: number, market: string) => {
  if (market.startsWith("KRW")) {
    return `${price.toLocaleString()} 원`;
  }
  if (market.startsWith("BTC")) {
    return `${price.toFixed(8)} BTC`;
  }
  return price >= 1000 
    ? `$${Math.round(price).toLocaleString()}` 
    : `$${price.toFixed(3)}`;
};

const formatChange = (rate: number) => {
  const percent = (rate * 100).toFixed(2);
  return `${rate > 0 ? "+" : ""}${percent}%`;
};

const formatVolume = (volume: number, market: string) => {
  if (market.startsWith("KRW")) {
    return `${Math.floor(volume / 1000000).toLocaleString()}백만`;
  }
  return `${volume.toFixed(3)}`;
};

const CoinListItem = ({ ticker, korean_name, caution, isActive, onClick }: Props) => {
  const router = useRouter();
  
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPriceRef = useRef(ticker.trade_price);

  useEffect(() => {
    const currentPrice = ticker.trade_price;
    const prevPrice = prevPriceRef.current;

    if (currentPrice !== prevPrice) {
      if (currentPrice > prevPrice) {
        setFlash("up");
      } else if (currentPrice < prevPrice) {
        setFlash("down");
      }

      prevPriceRef.current = currentPrice;

      const timer = setTimeout(() => {
        setFlash(null);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [ticker.trade_price]);

  const handleClick = () => {
    if (isActive) {
      onClick();
    } else {
      router.push(`/chart/${ticker.market}`);
    }
  };

  const changeRate = ticker.signed_change_rate;
  
  let colorClass = "text-gray-300";
  if (changeRate > 0) colorClass = "text-red-400";
  else if (changeRate < 0) colorClass = "text-blue-400";

  let borderClass = "border-2";
  
  if (flash === "up") {
    borderClass += " border-red-500/50";
  } else if (flash === "down") {
    borderClass += " border-blue-500/50";
  } else {
    borderClass += " border-transparent";
  }

  const bgClass = isActive ? "bg-white/10" : "hover:bg-white/5";

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-start px-2 py-1 rounded cursor-pointer ${bgClass} ${borderClass}`}
    >
      <div className="max-w-[180px]">
        <div className="flex items-center gap-1 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="truncate text-neutral-100">{korean_name}</span>
          {caution && <CoinCautionBadge caution={caution} compact={true} />}
        </div>
        <div className="text-sm text-gray-400">{ticker.market}</div>
      </div>

      <div className="text-right whitespace-nowrap">
        <div className={`text-base ${flash === 'up' ? 'text-red-400' : flash === 'down' ? 'text-blue-400' : 'text-neutral-100'}`}>
          {formatPrice(ticker.trade_price, ticker.market)}
        </div>
        <div className={`text-sm ${colorClass}`}>
          {formatChange(changeRate)}
        </div>
        <div className="text-[10px] text-gray-400">
          {formatVolume(ticker.acc_trade_price_24h, ticker.market)}
        </div>
      </div>
    </div>
  );
};

export default CoinListItem;