"use client";

import React, { useState } from "react";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import CoinListItem from "@/components/chart/CoinListItem";
import CoinListHeader from "@/components/chart/CoinListHeader";

type SortKey = "korean_name" | "trade_price" | "signed_change_rate" | "acc_trade_price_24h";
type SortDirection = "asc" | "desc";
type MarketTab = "KRW" | "BTC" | "USDT";

type Props = {
  initialTab: MarketTab;
  currentMarket: string;
  onClickSameMarket?: () => void;
};

const CoinList = ({ initialTab, currentMarket, onClickSameMarket }: Props) => {
  const { tickers, markets } = useUpbitTickerContext();
  const [activeTab, setActiveTab] = useState<MarketTab>(initialTab);
  const [sortKey, setSortKey] = useState<SortKey>("acc_trade_price_24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const combined = Object.values(tickers)
    .filter((t) => t.market.startsWith(`${activeTab}-`))
    .map((t) => {
      const marketInfo = markets.find((m) => m.market === t.market);
      return marketInfo
        ? {
            ticker: t,
            korean_name: marketInfo.korean_name,
            caution: marketInfo.market_event?.caution,
          }
        : null;
    })
    .filter(Boolean) as {
      ticker: typeof tickers[string];
      korean_name: string;
      caution?: {
        PRICE_FLUCTUATIONS: boolean;
        TRADING_VOLUME_SOARING: boolean;
        DEPOSIT_AMOUNT_SOARING: boolean;
        GLOBAL_PRICE_DIFFERENCES: boolean;
        CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
      };
    }[];

  const sorted = [...combined].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortKey) {
      case "korean_name":
        aValue = a.korean_name;
        bValue = b.korean_name;
        break;
      default:
        aValue = a.ticker[sortKey];
        bValue = b.ticker[sortKey];
    }

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const filtered = sorted.filter(({ ticker, korean_name }) => {
    const term = searchTerm.toLowerCase();
    return (
      ticker.market.toLowerCase().includes(term) ||
      korean_name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="text-sm h-full flex flex-col bg-chart-gradient/10 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
      <div className="sticky z-10">
        <div className="flex justify-center gap-12 border-b border-white/10 p-2">
          {["KRW", "BTC", "USDT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as MarketTab)}
              className={`pb-1 font-semibold ${
                activeTab === tab ? "border-b-2 border-neutral-100" : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="m-2">
          <input
            type="text"
            placeholder="코인명 또는 심볼 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 rounded bg-neutral-800 text-neutral-100 text-sm placeholder-gray-400 focus:outline-none"
          />
        </div>

        <CoinListHeader
          sortKey={sortKey}
          sortDirection={sortDirection}
          setSortKey={setSortKey}
          setSortDirection={setSortDirection}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {filtered.map(({ ticker, korean_name, caution }) => (
          <CoinListItem
            key={ticker.market}
            ticker={ticker}
            korean_name={korean_name}
            caution={caution ?? undefined}
            onClickSameMarket={
              ticker.market === currentMarket ? onClickSameMarket : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CoinList;