"use client";

import { useEffect, useMemo, useState } from "react";
import CoinListItem from "@/components/chart/CoinListItem";
import CoinListHeader from "@/components/chart/CoinListHeader";
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

const ACTIVE_TABS: MarketTab[] = ["KRW", "BTC", "USDT"];
const LOCAL_STORAGE_KEY = "activeTab";

const CoinList = ({ initialTab, currentMarket, onClickSameMarket }: Props) => {
  const tickers = useUpbitTickerStore((state) => state.tickers);
  const markets = useUpbitTickerStore((state) => state.markets);
  const loading = useUpbitTickerStore((state) => state.loading);

  const [activeTab, setActiveTab] = useState<MarketTab>(initialTab);
  
  const [sortKey, setSortKey] = useState<SortKey>("acc_trade_price_24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = loading || tickers.length === 0;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabClick = (tab: MarketTab) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, tab);
    setActiveTab(tab);
  };

  const combinedList = useMemo(() => {
    if (isLoading) return [];

    return tickers
      .filter((t) => t.market.startsWith(`${activeTab}-`))
      .map((t) => {
        const info = markets.find((m) => m.market === t.market);
        return {
          ticker: t,
          korean_name: info?.korean_name || "",
          english_name: info?.english_name || "",
          caution: info?.market_event?.caution,
        };
      })
      .filter((item) => item.korean_name !== "");
  }, [tickers, markets, activeTab, isLoading]);

  const sortedList = useMemo(() => {
    const list = [...combinedList];

    list.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "korean_name") {
        return a.korean_name.localeCompare(b.korean_name) * dir;
      } else {
        const key = sortKey as TickerSortKey;
        
        const valA = a.ticker[key] || 0;
        const valB = b.ticker[key] || 0;
        
        return (valA - valB) * dir;
      }
    });

    return list;
  }, [combinedList, sortKey, sortDirection]);

  const finalRenderList = useMemo(() => {
    if (!searchTerm) return sortedList;

    const term = searchTerm.toLowerCase();
    const chosungTerm = getChosung(term);

    return sortedList.filter((item) => {
      const name = item.korean_name;
      const symbol = item.ticker.market.split("-")[1].toLowerCase();
      
      return (
        name.includes(term) ||
        symbol.includes(term) ||
        getChosung(name).includes(chosungTerm)
      );
    });
  }, [sortedList, searchTerm]);

  return (
    <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
      <div className="sticky top-0 z-10 bg-white/5 backdrop-blur">
        <div className="flex justify-center gap-12 border-b border-white/10 p-2">
          {ACTIVE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`pb-1 font-semibold ${
                activeTab === tab
                  ? "border-b-2 border-neutral-100 text-neutral-100"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="m-2">
          <input
            type="text"
            placeholder="코인명/심볼 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 rounded bg-neutral-800 text-neutral-100 text-sm focus:outline-none"
          />
        </div>

        <CoinListHeader
          sortKey={sortKey}
          sortDirection={sortDirection}
          setSortKey={setSortKey}
          setSortDirection={setSortDirection}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">로딩 중...</div>
        ) : finalRenderList.length === 0 ? (
          <div className="p-8 text-center text-gray-400">검색 결과가 없습니다.</div>
        ) : (
          finalRenderList.map((item) => (
            <CoinListItem
              key={item.ticker.market}
              ticker={item.ticker}
              korean_name={item.korean_name}
              caution={item.caution}
              isActive={item.ticker.market === currentMarket}
              onClick={() => {
                if (item.ticker.market === currentMarket) {
                  onClickSameMarket?.();
                } 
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CoinList;