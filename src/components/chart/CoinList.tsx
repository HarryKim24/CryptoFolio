"use client";

import React, { useEffect, useMemo, useState } from "react";
import CoinListItem from "@/components/chart/CoinListItem";
import CoinListHeader from "@/components/chart/CoinListHeader";
import type { Ticker, CautionType } from "@/types/upbitTypes";
import { getChosung } from "@/utils/getChosung";
import { useUpbitTickerStore } from "@/stores/upbitTickerStore";
import { MarketTab } from "@/lib/market";

type SortKey = "korean_name" | "trade_price" | "signed_change_rate" | "acc_trade_price_24h";
type TickerSortKey = Exclude<SortKey, "korean_name">;
type SortDirection = "asc" | "desc";

type Props = {
  initialTab: MarketTab;
  currentMarket: string;
  onClickSameMarket?: () => void;
};

type CombinedItem = {
  ticker: Ticker;
  korean_name: string;
  english_name: string;
  caution?: CautionType;
};

const ACTIVE_TABS: MarketTab[] = ["KRW", "BTC", "USDT"];
const LOCAL_STORAGE_KEY = "activeTab";

const CoinList = ({ initialTab, currentMarket, onClickSameMarket }: Props) => {
  const tickers = useUpbitTickerStore((s) => s.tickers) as Record<string, Ticker>;
  const markets = useUpbitTickerStore((s) => s.markets);
  const loading = useUpbitTickerStore((s) => s.loading);

  const [activeTab, setActiveTab] = useState<MarketTab>("KRW");
  const [sortKey, setSortKey] = useState<SortKey>("acc_trade_price_24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading =
    loading || !currentMarket || Object.keys(tickers).length === 0 || markets.length === 0;

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem(LOCAL_STORAGE_KEY) as MarketTab | null)
      : null);

    if (stored && ACTIVE_TABS.includes(stored)) {
      setActiveTab(stored);
    } else {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: MarketTab) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, tab);
    setActiveTab(tab);
  };

  const combined: CombinedItem[] = useMemo(() => {
    if (isLoading) return [];

    return Object.values(tickers)
      .filter((t) => t.market.startsWith(`${activeTab}-`))
      .flatMap((t) => {
        const marketInfo = markets.find((m) => m.market === t.market);
        if (!marketInfo) return [];
        return [
          {
            ticker: t,
            korean_name: marketInfo.korean_name,
            english_name: marketInfo.english_name,
            caution: marketInfo.market_event?.caution as CautionType | undefined,
          },
        ];
      });
  }, [tickers, markets, activeTab, isLoading]);

  const sorted = useMemo(() => {
    if (combined.length === 0) return [];

    return [...combined].sort((a, b) => {
      if (sortKey === "korean_name") {
        return sortDirection === "asc"
          ? a.korean_name.localeCompare(b.korean_name)
          : b.korean_name.localeCompare(a.korean_name);
      }

      const key = sortKey as TickerSortKey;
      const av = a.ticker[key] as number;
      const bv = b.ticker[key] as number;

      return sortDirection === "asc" ? av - bv : bv - av;
    });
  }, [combined, sortKey, sortDirection]);

  const filtered = useMemo(() => {
    if (sorted.length === 0) return [];

    const term = searchTerm.toLowerCase();
    if (!term) return sorted;

    const isChosungOnly = /^[ㄱ-ㅎ]+$/.test(term);
    const choTerm = isChosungOnly ? getChosung(term) : null;

    return sorted.filter(({ ticker, korean_name, english_name }) => {
      const symbol = ticker.market.replace(`${activeTab}-`, "").toLowerCase();
      const lowerKorean = korean_name.toLowerCase();
      const lowerEnglish = english_name.toLowerCase();
      const choName = getChosung(korean_name);

      return (
        lowerKorean.includes(term) ||
        lowerEnglish.includes(term) ||
        symbol.includes(term) ||
        (isChosungOnly && choTerm !== null && choName.includes(choTerm))
      );
    });
  }, [sorted, searchTerm, activeTab]);

  const dummyList = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, idx) => ({
        market: `${activeTab}-DUMMY${idx}`,
      })),
    [activeTab]
  );

  return (
    <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
      <div className="sticky top-0 z-10 bg-white/5 backdrop-blur">
        <div className="flex justify-center gap-12 border-b border-white/10 p-2">
          {ACTIVE_TABS.map((tab) => (
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
        {isLoading &&
          dummyList.map((dummy) => (
            <CoinListItem key={dummy.market} isLoading market={dummy.market} />
          ))}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center text-gray-400 py-8">검색 결과가 없습니다.</div>
        )}

        {!isLoading &&
          filtered.length > 0 &&
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
          ))}
      </div>
    </div>
  );
};

export default CoinList;