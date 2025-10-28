"use client";

import CoinListItem from "@/components/chart/CoinListItem";

type Props = {
  count?: number;
  marketPrefix: string;
};

const CoinListSkeleton = ({ count = 10, marketPrefix }: Props) => {

  return (
    <div className="space-y-1 px-1">
      {Array.from({ length: count }).map((_, idx) => (
        <CoinListItem
          key={idx}
          isLoading
          market={`${marketPrefix}-LOADING-${idx}`}
        />
      ))}
    </div>
  );
};

export default CoinListSkeleton;