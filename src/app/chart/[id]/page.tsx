"use client";

export const dynamic = "force-static";

import { useParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useUpbitTickerStore } from "@/stores/useUpbitTickerStore";
import { Market } from "@/types/upbitTypes";
import useIsMobile from "@/hooks/useIsMobile";

import _dynamic from "next/dynamic";

const CoinDetail = _dynamic(() => import("@/components/chart/CoinDetail"), { ssr: false });
const CoinChart = _dynamic(() => import("@/components/chart/CoinChart"), { ssr: false });
const CoinList = _dynamic(() => import("@/components/chart/CoinList"), { ssr: false });

const CoinDetailSkeleton = _dynamic(() => import("@/components/chart/skeleton/CoinDetailSkeleton"), { ssr: false });
const CoinListSkeleton = _dynamic(() => import("@/components/chart/skeleton/CoinListSkeleton"), { ssr: false });

type MarketTab = "KRW" | "BTC" | "USDT";

const ChartPage = () => {
  const params = useParams();
  const market = typeof params?.id === "string" ? params.id : "";

  const loading = useUpbitTickerStore((s) => s.loading);
  const markets = useUpbitTickerStore((s) => s.markets);

  const [view, setView] = useState<"chart" | "list">("chart");
  const isMobile = useIsMobile();

  const isInitialLoading = !market || loading || markets.length === 0;

  const isInvalidMarket = useMemo(() => {
    return (
      !isInitialLoading &&
      (!market.includes("-") || !markets.some((m: Market) => m.market === market))
    );
  }, [market, isInitialLoading, markets]);

  const tab = useMemo(() => {
    const prefix = market.split("-")[0];
    return (["KRW", "BTC", "USDT"].includes(prefix) ? prefix : "KRW") as MarketTab;
  }, [market]);

  return (
    <div className="flex-1 h-full overflow-hidden relative flex flex-col">
      <div className="w-full min-w={[`320px`]} h-full p-4">
        <div className="text-sm h-full flex flex-col bg-white/5 rounded-xl shadow overflow-hidden">
          {(!isMobile || view === "chart") && (
            <Suspense fallback={<CoinDetailSkeleton />}>
              <CoinDetail
                market={market}
                isMobile={isMobile}
                view={view}
                onToggleView={() => setView(view === "chart" ? "list" : "chart")}
              />
            </Suspense>
          )}

          <div className="flex-1 relative min-h-0">
            {isInvalidMarket ? (
              <div className="flex justify-center items-center h-full text-neutral-100">
                잘못된 경로입니다.
              </div>
            ) : !isMobile || view === "chart" ? (
              <Suspense fallback={null}>
                <motion.div key="chart" className="w-full h-full">
                  <CoinChart market={market} />
                </motion.div>
              </Suspense>
            ) : (
              <Suspense fallback={<CoinListSkeleton marketPrefix={tab} />}>
                <motion.div
                  key="list"
                  initial={{ x: 300 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="h-full overflow-y-auto"
                >
                  <CoinList
                    initialTab={tab}
                    currentMarket={market}
                    onClickSameMarket={() => setView("chart")}
                  />
                </motion.div>
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;