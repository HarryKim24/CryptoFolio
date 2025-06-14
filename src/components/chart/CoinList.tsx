"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Market, Ticker } from "@/types/upbitTypes";

type SortKey = "korean_name" | "trade_price" | "signed_change_rate" | "acc_trade_price_24h";
type SortDirection = "asc" | "desc";
type MarketTab = "KRW" | "BTC" | "USDT";

type CoinItem = {
  market: Market;
  ticker: Ticker;
};

const CoinList = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MarketTab>("KRW");
  const [sortKey, setSortKey] = useState<SortKey>("acc_trade_price_24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: marketData } = await axios.get<Market[]>(
          "https://api.upbit.com/v1/market/all?isDetails=true"
        );

        const selectedMarkets = marketData.filter((m) =>
          m.market.startsWith(`${activeTab}-`)
        );
        setMarkets(selectedMarkets);

        const marketQuery = selectedMarkets.map((m) => m.market).join(",");
        const { data: tickerData } = await axios.get<Ticker[]>(
          `https://api.upbit.com/v1/ticker?markets=${marketQuery}`
        );

        setTickers(tickerData);
      } catch (error) {
        console.error("API 호출 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const combinedData: CoinItem[] = tickers
    .map((ticker) => {
      const market = markets.find((m) => m.market === ticker.market);
      if (!market) return null;
      return { ticker, market };
    })
    .filter(Boolean) as CoinItem[];

  const sortedData = [...combinedData].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortKey) {
      case "korean_name":
        aValue = a.market.korean_name;
        bValue = b.market.korean_name;
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

  return (
    <div className="text-sm">
      <div className="flex justify-center gap-6 mb-2 border-b border-gray-600 pb-1">
        {["KRW", "BTC", "USDT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as MarketTab)}
            className={`pb-1 font-semibold ${
              activeTab === tab ? "border-b-2 border-white" : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 px-2 py-1 text-xs border-b border-gray-700">
        {(["korean_name", "trade_price", "signed_change_rate", "acc_trade_price_24h"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => toggleSort(key)}
            className={`flex items-center gap-1 ${
              sortKey === key ? "text-white" : "text-gray-400"
            }`}
          >
            {{
              korean_name: "한글명",
              trade_price: "현재가",
              signed_change_rate: "전일대비",
              acc_trade_price_24h: "거래대금",
            }[key]}
            {sortKey === key && (
              <span>{sortDirection === "asc" ? "⬆" : "⬇"}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 p-4">로딩 중...</div>
      ) : (
        <div className="space-y-1 mt-2">
          {sortedData.map(({ ticker, market }) => (
            <Link
              key={ticker.market}
              href={`/chart/${ticker.market.replace(`${activeTab}-`, "")}`}
            >
              <div className="flex justify-between items-center p-2 rounded hover:bg-white/10 cursor-pointer">
                <div>
                  <div className="font-medium">{market.korean_name}</div>
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
                      ? `${Math.floor(
                          ticker.acc_trade_price_24h / 1_0000_000
                        ).toLocaleString()}백만`
                      : activeTab === "BTC"
                      ? `${ticker.acc_trade_price_24h.toFixed(6)} BTC`
                      : ticker.acc_trade_price_24h >= 1000
                      ? `$${Math.round(ticker.acc_trade_price_24h).toLocaleString()}`
                      : `$${ticker.acc_trade_price_24h.toFixed(4)}`}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinList;