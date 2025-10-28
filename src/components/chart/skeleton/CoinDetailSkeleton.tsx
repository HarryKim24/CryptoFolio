const CoinDetailSkeleton = () => {
  return (
    <div className="border-b border-white/10 animate-pulse">
      <div className="md:h-[119px] p-4 pr-4 flex justify-between items-start gap-2 lg:gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-6 bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="h-5 w-24 bg-gray-600 rounded" />
        </div>
        <div className="text-right flex flex-col gap-2 items-end">
          <div className="h-6 w-24 bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-600 rounded" />
          <div className="h-3 w-28 bg-gray-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CoinDetailSkeleton;