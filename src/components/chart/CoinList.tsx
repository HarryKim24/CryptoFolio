"use client";

import React, { useState, useMemo } from "react";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";
import CoinListItem from "@/components/chart/CoinListItem";
import CoinListHeader from "@/components/chart/CoinListHeader";
import { CautionType } from "@/types/upbitTypes";

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

  const combined = useMemo(() => {
    return Object.values(tickers)
      .filter((t) => t.market.startsWith(`${activeTab}-`))
      .map((t) => {
        const marketInfo = markets.find((m) => m.market === t.market);
        return marketInfo
          ? {
              ticker: t,
              korean_name: marketInfo.korean_name,
              caution: marketInfo.market_event?.caution as CautionType | undefined,
            }
          : null;
      })
      .filter(Boolean) as {
        ticker: typeof tickers[string];
        korean_name: string;
        caution?: CautionType;
      }[];
  }, [tickers, markets, activeTab]);

  const sorted = useMemo(() => {
    return [...combined].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortKey === "korean_name") {
        aValue = a.korean_name;
        bValue = b.korean_name;
      } else {
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
  }, [combined, sortKey, sortDirection]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sorted.filter(({ ticker, korean_name }) => {
      return (
        ticker.market.toLowerCase().includes(term) ||
        korean_name.toLowerCase().includes(term)
      );
    });
  }, [sorted, searchTerm]);

  const isLoading = combined.length === 0;

  return (
    <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
      <div className="sticky z-10">
        <div className="flex justify-center gap-12 border-b border-white/10 p-2">
          {(["KRW", "BTC", "USDT"] as MarketTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
        {isLoading
          ? Array.from({ length: 10 }).map((_, idx) => (
              <CoinListItem key={idx} isLoading />
            ))
          : filtered.map(({ ticker, korean_name, caution }) => (
              <CoinListItem
                key={ticker.market}
                ticker={ticker}
                korean_name={korean_name}
                caution={caution}
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