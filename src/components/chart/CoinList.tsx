"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUpbitTickerContext } from "@/context/UpbitTickerContext";

type SortKey = "korean_name" | "trade_price" | "signed_change_rate" | "acc_trade_price_24h";
type SortDirection = "asc" | "desc";
type MarketTab = "KRW" | "BTC" | "USDT";

const CoinList = () => {
  const { tickers, loading, markets } = useUpbitTickerContext(); // ✅ markets 가져오기
  const [activeTab, setActiveTab] = useState<MarketTab>("KRW");
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
          }
        : null;
    })
    .filter(Boolean) as {
      ticker: typeof tickers[string];
      korean_name: string;
    }[];

  const sorted = [...combined].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortKey) {
      case "korean_name":
        aValue = a.korean_name;
        bValue = b.korean_name;
        break;
      case "trade_price":
      case "signed_change_rate":
      case "acc_trade_price_24h":
        aValue = a.ticker[sortKey];
        bValue = b.ticker[sortKey];
        break;
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
    <div className="text-sm h-full flex flex-col bg-chart-gradient/10 m-1 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
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

        <div className="grid grid-cols-4 gap-2 px-2 py-2 text-xs border-b border-white/10">
          {(["korean_name", "trade_price", "signed_change_rate", "acc_trade_price_24h"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                if (sortKey === key) {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortKey(key);
                  setSortDirection("desc");
                }
              }}
              className={`flex items-center gap-1 ${
                sortKey === key ? "text-neutral-100" : "text-gray-400"
              }`}
            >
              {({
                korean_name: "한글명",
                trade_price: "현재가",
                signed_change_rate: "전일대비",
                acc_trade_price_24h: "거래대금",
              } as Record<SortKey, string>)[key]}
              {sortKey === key && <span>{sortDirection === "asc" ? "⬆" : "⬇"}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {loading ? (
          <div className="flex justify-center items-center h-full p-4">
            <div className="w-6 h-6 border-2 border-t-transparent border-white/20 rounded-full animate-spin" />
          </div>
        ) : (
          filtered.map(({ ticker, korean_name }) => (
            <Link
              key={ticker.market}
              href={`/chart/${ticker.market.replace(`${activeTab}-`, "")}`}
            >
              <div className="flex justify-between items-center p-2 rounded hover:ring-1 ring-white/10 hover:bg-white/5 cursor-pointer">
                <div>
                  <div className="font-medium">{korean_name}</div>
                  <div className="text-xs text-gray-400">{ticker.market}</div>
                </div>
                <div className="text-right">
                  <div>
                    {activeTab === "KRW"
                      ? `${ticker.trade_price.toLocaleString()}₩`
                      : activeTab === "BTC"
                      ? `${ticker.trade_price.toFixed(8)} BTC`
                      : ticker.trade_price >= 1000
                      ? `$${Math.round(ticker.trade_price).toLocaleString()}`
                      : `$${ticker.trade_price.toFixed(3)}`}
                  </div>

                  <div
                    className={`text-xs ${
                      ticker.signed_change_rate > 0
                        ? "text-red-400"
                        : ticker.signed_change_rate < 0
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}
                  >
                    {(ticker.signed_change_rate * 100).toFixed(2)}%
                  </div>

                  <div className="text-[10px] text-gray-400">
                    {activeTab === "KRW"
                      ? `${Math.floor(ticker.acc_trade_price_24h / 1_0000_000).toLocaleString()}백만`
                      : activeTab === "BTC"
                      ? `${ticker.acc_trade_price_24h.toFixed(6)} BTC`
                      : ticker.acc_trade_price_24h >= 1000
                      ? `$${Math.round(ticker.acc_trade_price_24h).toLocaleString()}`
                      : `$${ticker.acc_trade_price_24h.toFixed(4)}`}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CoinList;