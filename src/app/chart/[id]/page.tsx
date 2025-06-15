"use client";

import { useParams } from "next/navigation";
import CoinDetail from "@/components/chart/CoinDetail";
import CoinList from "@/components/chart/CoinList";

const ChartPage = () => {
  const params = useParams();
  const coinSymbol = decodeURIComponent((params?.id ?? "BTC") as string); // fallback to BTC
  const market = `KRW-${coinSymbol.toUpperCase()}`;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="w-full min-w-[320px] h-full overflow-auto p-2">
        <div className="text-sm h-full flex flex-col bg-chart-gradient/10 border border-white/10 rounded-3xl shadow-lg backdrop-blur-md overflow-hidden">
          <CoinDetail market={market} />
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            차트 영역
          </div>
        </div>
      </div>

      <div className="w-[320px] min-w-[320px] h-full overflow-y-auto p-2">
        <CoinList />
      </div>
    </div>
  );
};

export default ChartPage;