"use client";

type SortKey =
  | "korean_name"
  | "trade_price"
  | "signed_change_rate"
  | "acc_trade_price_24h";

type SortDirection = "asc" | "desc";

type Props = {
  sortKey: SortKey;
  sortDirection: SortDirection;
  setSortKey: (key: SortKey) => void;
  setSortDirection: (direction: SortDirection) => void;
};

const HEADERS: SortKey[] = [
  "korean_name",
  "trade_price",
  "signed_change_rate",
  "acc_trade_price_24h",
];

const LABELS: Record<SortKey, string> = {
  korean_name: "한글명",
  trade_price: "현재가",
  signed_change_rate: "전일대비",
  acc_trade_price_24h: "거래대금",
};

const CoinListHeader = ({
  sortKey,
  sortDirection,
  setSortKey,
  setSortDirection,
}: Props) => {
  const handleClickHeader = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 px-2 py-2 text-xs border-b border-white/10">
      {HEADERS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => handleClickHeader(key)}
          className={`flex items-center justify-center gap-1 text-center w-full h-full ${
            sortKey === key ? "text-neutral-100" : "text-gray-400"
          }`}
        >
          {LABELS[key]}
          {sortKey === key && (
            <span>{sortDirection === "asc" ? "⬆" : "⬇"}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CoinListHeader;