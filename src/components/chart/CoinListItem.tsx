"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Ticker, CautionType } from "@/types/upbitTypes";
import CoinCautionBadge from "./CautionBadge";

type LoadingProps = {
  isLoading: true;
  market?: string;
};

type DataProps = {
  isLoading?: false;
  ticker: Ticker;
  korean_name: string;
  caution?: CautionType;
  onClickSameMarket?: () => void;
};

type CoinListItemProps = LoadingProps | DataProps;

const getLoadingPrice = (marketType: string) => {
  if (marketType === "BTC") return "0.00000000 BTC";
  if (marketType === "USDT") return "$0.00";
  return "0 원";
};

const getLoadingVolume = (marketType: string) => {
  if (marketType === "BTC") return "0.000000 BTC";
  if (marketType === "USDT") return "$0.0000";
  return "0백만";
};

const formatPrice = (ticker: Ticker) => {
  const value = ticker.trade_price;
  if (value == null) return "--";

  if (ticker.market.startsWith("KRW")) {
    return `${value.toLocaleString()} 원`;
  }

  if (ticker.market.startsWith("BTC")) {
    return `${value.toFixed(8)} BTC`;
  }

  return value >= 1000
    ? `$${Math.round(value).toLocaleString()}`
    : `$${value.toFixed(3)}`;
};

const formatChangeRate = (ticker: Ticker) => {
  const rate = ticker.signed_change_rate;
  if (rate == null) return "--";

  const percent = (rate * 100).toFixed(2);
  return `${rate > 0 ? "+" : ""}${percent}%`;
};

const formatVolume = (ticker: Ticker) => {
  const value = ticker.acc_trade_price_24h;
  if (value == null) return "--";

  if (ticker.market.startsWith("KRW")) {
    return `${Math.floor(value / 1_0000_000).toLocaleString()}백만`;
  }

  if (ticker.market.startsWith("BTC")) {
    return `${value.toFixed(6)} BTC`;
  }

  return value >= 1000
    ? `$${Math.round(value).toLocaleString()}`
    : `$${value.toFixed(4)}`;
};

const getCautionCount = (caution: CautionType | undefined): number => {
  if (!caution) return 0;
  return Object.values(caution).filter(Boolean).length;
};

const CoinListItem = (props: CoinListItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  if ("isLoading" in props && props.isLoading) {
    const marketCode = props.market || "KRW-LOADING";
    const marketType = marketCode.split("-")[0] || "KRW";

    return (
      <div className="flex justify-between items-start px-2 py-1 rounded">
        <div className="max-w-[180px]">
          <div className="flex items-center gap-1 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="truncate text-neutral-100">종목명</span>
          </div>
          <div className="text-sm text-gray-400">
            {props.market || "마켓"}
          </div>
        </div>

        <div className="text-right whitespace-nowrap">
          <div className="text-base text-neutral-100">
            {getLoadingPrice(marketType)}
          </div>
          <div className="text-sm text-gray-400">0.00%</div>
          <div className="text-[10px] text-gray-400">
            {getLoadingVolume(marketType)}
          </div>
        </div>
      </div>
    );
  }

  const { ticker, korean_name, caution, onClickSameMarket } = props;
  const targetPath = `/chart/${ticker.market}`;
  const isActive = pathname === targetPath;

  const handleClick = () => {
    if (isActive) {
      onClickSameMarket?.();
    } else {
      router.push(targetPath);
    }
  };

  const changeRate = ticker.signed_change_rate ?? 0;
  const isCompact =
    korean_name.length >= 7 || getCautionCount(caution) >= 2;

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
        <div className="text-base">{formatPrice(ticker)}</div>
        <div
          className={`text-sm ${
            changeRate > 0
              ? "text-red-400"
              : changeRate < 0
              ? "text-blue-400"
              : "text-gray-300"
          }`}
        >
          {formatChangeRate(ticker)}
        </div>
        <div className="text-[10px] text-gray-400">
          {formatVolume(ticker)}
        </div>
      </div>
    </div>
  );
};

export default CoinListItem;