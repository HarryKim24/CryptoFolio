"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Asset } from "@/types/assetTypes";
import { getTickerInfo } from "@/api/upbitApi";
import { getDistribution } from "@/utils/portfolioCharts";
import { calculateStats, PortfolioStats } from "@/utils/calculateStats";
import { addAsset, deleteAsset, deleteAllAssets } from "@/lib/portfolioActions";

const ZERO_STATS: PortfolioStats = {
  evaluation: 0,
  totalBuy: 0,
  allTimeProfit: 0,
  realisedProfit: 0,
  unrealisedProfit: 0,
  profitRate: 0,
  costBasis: 0,
};

export const usePortfolioAssets = (initialAssets: Asset[], userId: string) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [distribution, setDistribution] = useState<{ symbol: string; value: number }[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [showEmptyModal, setShowEmptyModal] = useState(initialAssets.length === 0);
  const [isAdding, setIsAdding] = useState(false);

  const prevCountRef = useRef<number>(initialAssets.length);

  const updatePricesAndStats = useCallback(
    async (currentAssets: Asset[]) => {
      if (currentAssets.length === 0) {
        setPriceMap({});
        setDistribution([]);
        setStats(ZERO_STATS);
        return;
      }

      const symbols = [...new Set(currentAssets.map((a) => a.symbol))];

      try {
        const tickers = await getTickerInfo(symbols.map((s) => `KRW-${s}`));

        const nextPriceMap: Record<string, number> = {};
        tickers.forEach((t) => {
          const symbol = t.market.replace("KRW-", "");
          nextPriceMap[symbol] = t.trade_price;
        });

        setPriceMap(nextPriceMap);
        setDistribution(getDistribution(currentAssets, nextPriceMap));
        setStats(calculateStats(currentAssets, nextPriceMap));
      } catch (error) {
        console.error("가격/통계 계산 중 오류:", error);
        setPriceMap({});
        setDistribution([]);
        setStats(ZERO_STATS);
      }
    },
    []
  );

  useEffect(() => {
    updatePricesAndStats(assets);
  }, [assets, updatePricesAndStats]);

  useEffect(() => {
    const prevCount = prevCountRef.current;
    const currentCount = assets.length;

    if (prevCount > 0 && currentCount === 0) {
      setShowEmptyModal(true);
    }

    prevCountRef.current = currentCount;
  }, [assets.length]);

  const handleAddAsset = async (asset: Omit<Asset, "userId" | "_id">) => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const newId = await addAsset({ ...asset, userId });
      setAssets((prev) => [...prev, { ...asset, userId, _id: newId }]);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    setAssets((prev) => prev.filter((a) => a._id !== id));
    try {
      await deleteAsset(id);
    } catch (error) {
      console.error("거래 삭제 중 오류:", error);
    }
  };

  const handleDeleteAllAssets = async () => {
    setAssets([]);
    try {
      await deleteAllAssets(userId);
    } catch (error) {
      console.error("전체 삭제 중 오류:", error);
    }
  };

  const dismissEmptyModal = () => {
    setShowEmptyModal(false);
  };

  return {
    assets,
    stats,
    distribution,
    priceMap,
    showEmptyModal,
    isAdding,
    addAsset: handleAddAsset,
    deleteAssetById: handleDeleteAsset,
    deleteAllAssets: handleDeleteAllAssets,
    dismissEmptyModal,
  };
};