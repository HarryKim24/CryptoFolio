"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useUpbitTickerStore } from "@/stores/useUpbitTickerStore";
import CoinListItem from "@/components/chart/CoinListItem";
import CoinListHeader from "@/components/chart/CoinListHeader";
import { CautionType, Market } from "@/types/upbitTypes";
import { getChosung } from "@/utils/getChosung";

type SortKey = "korean_name" | "trade_price" | "signed_change_rate" | "acc_trade_price_24h";
type SortDirection = "asc" | "desc";
type MarketTab = "KRW" | "BTC" | "USDT";

type Props = {
  initialTab: MarketTab;
  currentMarket: string;
  onClickSameMarket?: () => void;
};

const CoinList = ({ initialTab, currentMarket, onClickSameMarket }: Props) => {
  const tickers = useUpbitTickerStore((s) => s.tickers);
  const markets = useUpbitTickerStore((s) => s.markets);
  const loading = useUpbitTickerStore((s) => s.loading);

  const [activeTab, setActiveTab] = useState<MarketTab>("KRW");
  const [sortKey, setSortKey] = useState<SortKey>("acc_trade_price_24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = loading || markets.length === 0 || Object.keys(tickers).length === 0;
  if (isLoading) {
    throw Promise.resolve();
  }

  useEffect(() => {
    const stored = localStorage.getItem("activeTab") as MarketTab | null;
    if (stored && ["KRW", "BTC", "USDT"].includes(stored)) {
      setActiveTab(stored);
    } else {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: MarketTab) => {
    localStorage.setItem("activeTab", tab);
    setActiveTab(tab);
  };

  const combined = useMemo(() => {
    if (isLoading) return [];
    return Object.values(tickers)
      .filter((t) => t.market.startsWith(`${activeTab}-`))
      .map((t) => {
        const marketInfo = markets.find((m: Market) => m.market === t.market);
        return marketInfo
          ? {
              ticker: t,
              korean_name: marketInfo.korean_name,
              english_name: marketInfo.english_name,
              caution: marketInfo.market_event?.caution as CautionType | undefined,
            }
          : null;
      })
      .filter(Boolean) as {
        ticker: typeof tickers[string];
        korean_name: string;
        english_name: string;
        caution?: CautionType;
      }[];
  }, [tickers, markets, activeTab, isLoading]);

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
    const isChosungOnly = /^[ㄱ-ㅎ]+$/.test(term);
    const choTerm = isChosungOnly ? getChosung(term) : null;

    return sorted.filter(({ ticker, korean_name, english_name }) => {
      const symbol = ticker.market.replace(`${activeTab}-`, "").toLowerCase();
      const choName = getChosung(korean_name);

      return (
        korean_name.toLowerCase().includes(term) ||
        english_name.toLowerCase().includes(term) ||
        symbol.includes(term) ||
        (isChosungOnly && choName.includes(choTerm!))
      );
    });
  }, [sorted, searchTerm, activeTab]);

  const dummyList = Array.from({ length: 10 }).map((_, idx) => ({
    market: `${activeTab}-MARKET${idx}`,
  }));

  return (
    <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
      <div className="sticky z-10">
        <div className="flex justify-center gap-12 border-b border-white/10 p-2">
          {(["KRW", "BTC", "USDT"] as MarketTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
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
          ? dummyList.map((dummy) => (
              <CoinListItem key={dummy.market} market={dummy.market} isLoading />
            ))
          : filtered.length === 0
          ? (
            <div className="text-center text-gray-400 py-8">검색 결과가 없습니다.</div>
          ) : (
            filtered.map(({ ticker, korean_name, caution }) => (
              <CoinListItem
                key={ticker.market}
                ticker={ticker}
                korean_name={korean_name}
                caution={caution}
                market={ticker.market}
                onClickSameMarket={
                  ticker.market === currentMarket ? onClickSameMarket : undefined
                }
              />
            ))
          )}
      </div>
    </div>
  );
};

export default CoinList;