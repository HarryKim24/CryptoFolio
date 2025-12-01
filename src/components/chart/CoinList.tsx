"use client";

import { useEffect, useMemo, useState } from "react";
import CoinListItem from "@/components/chart/CoinListItem";
import CoinListHeader from "@/components/chart/CoinListHeader";
import type { Ticker, CautionType } from "@/types/upbitTypes";
import { getChosung } from "@/utils/getChosung";
import { useUpbitTickerStore } from "@/stores/upbitTickerStore";
import { MarketTab } from "@/lib/market";

type SortKey =
  | "korean_name"
  | "trade_price"
  | "signed_change_rate"
  | "acc_trade_price_24h";

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

  const tickers = useUpbitTickerStore((state) => state.tickers);
  const markets = useUpbitTickerStore((state) => state.markets);
  const loading = useUpbitTickerStore((state) => state.loading);

  const [activeTab, setActiveTab] = useState<MarketTab>("KRW");
  const [sortKey, setSortKey] = useState<SortKey>("acc_trade_price_24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading =
    loading ||
    !currentMarket ||
    tickers.length === 0 ||
    markets.length === 0;

  useEffect(() => {
    const storedTab =
      typeof window !== "undefined"
        ? (localStorage.getItem(LOCAL_STORAGE_KEY) as MarketTab | null)
        : null;

    if (storedTab && ACTIVE_TABS.includes(storedTab)) {
      setActiveTab(storedTab);
    } else {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: MarketTab) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, tab);
    setActiveTab(tab);
  };

  const combined: CombinedItem[] = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return tickers
      .filter((ticker) => ticker.market.startsWith(`${activeTab}-`))
      .map((ticker) => {
        const marketInfo = markets.find(
          (item) => item.market === ticker.market
        );

        if (!marketInfo) {
          return null;
        }

        return {
          ticker,
          korean_name: marketInfo.korean_name,
          english_name: marketInfo.english_name,
          caution: marketInfo.market_event?.caution as
            | CautionType
            | undefined,
        };
      })
      .filter((item) => item !== null) as CombinedItem[];
  }, [tickers, markets, activeTab, isLoading]);

  const sorted = useMemo(() => {
    if (combined.length === 0) {
      return [];
    }

    const sortedList = [...combined];

    sortedList.sort((a, b) => {
      if (sortKey === "korean_name") {
        if (sortDirection === "asc") {
          return a.korean_name.localeCompare(b.korean_name);
        }
        return b.korean_name.localeCompare(a.korean_name);
      }

      const tickerKey = sortKey as TickerSortKey;
      const aValue = a.ticker[tickerKey] as number;
      const bValue = b.ticker[tickerKey] as number;

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sortedList;
  }, [combined, sortKey, sortDirection]);

  const filtered = useMemo(() => {
    if (sorted.length === 0) {
      return [];
    }

    const term = searchTerm.toLowerCase();

    if (!term) {
      return sorted;
    }

    const isOnlyChosung = /^[ㄱ-ㅎ]+$/.test(term);
    const chosungTerm = isOnlyChosung ? getChosung(term) : null;

    return sorted.filter(({ ticker, korean_name, english_name }) => {
      const symbol = ticker.market.replace(`${activeTab}-`, "").toLowerCase();
      const lowerKoreanName = korean_name.toLowerCase();
      const lowerEnglishName = english_name.toLowerCase();
      const chosungName = getChosung(korean_name);

      return (
        lowerKoreanName.includes(term) ||
        lowerEnglishName.includes(term) ||
        symbol.includes(term) ||
        (isOnlyChosung &&
          chosungTerm !== null &&
          chosungName.includes(chosungTerm))
      );
    });
  }, [sorted, searchTerm, activeTab]);

  const dummyList = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, index) => ({
        market: `${activeTab}-DUMMY${index}`,
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
                activeTab === tab
                  ? "border-b-2 border-neutral-100"
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
            placeholder="코인명 또는 심볼 검색"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
            <CoinListItem
              key={dummy.market}
              isLoading
              market={dummy.market}
            />
          ))}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            검색 결과가 없습니다.
          </div>
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