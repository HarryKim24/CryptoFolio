"use client";

import React from "react";

type SortKey = "korean_name" | "trade_price" | "signed_change_rate" | "acc_trade_price_24h";
type SortDirection = "asc" | "desc";

interface Props {
  sortKey: SortKey;
  sortDirection: SortDirection;
  setSortKey: (key: SortKey) => void;
  setSortDirection: (dir: SortDirection) => void;
}

const CoinListHeader = ({ sortKey, sortDirection, setSortKey, setSortDirection }: Props) => {
  const headers: SortKey[] = [
    "korean_name",
    "trade_price",
    "signed_change_rate",
    "acc_trade_price_24h",
  ];

  const labels: Record<SortKey, string> = {
    korean_name: "한글명",
    trade_price: "현재가",
    signed_change_rate: "전일대비",
    acc_trade_price_24h: "거래대금",
  };

  return (
    <div className="grid grid-cols-4 gap-2 px-2 py-2 text-xs border-b border-white/10">
      {headers.map((key) => (
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
          className={`flex items-center justify-center gap-1 text-center w-full h-full ${
            sortKey === key ? "text-neutral-100" : "text-gray-400"
          }`}
        >
          {labels[key]}
          {sortKey === key && <span>{sortDirection === "asc" ? "⬆" : "⬇"}</span>}
        </button>
      ))}
    </div>
  );
};

export default CoinListHeader;