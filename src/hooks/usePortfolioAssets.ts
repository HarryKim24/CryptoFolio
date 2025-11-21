"use client";

import { useEffect, useRef, useState } from "react";
import { Asset } from "@/types/assetTypes";
import { calculateStats, PortfolioStats } from "@/utils/calculateStats";
import { getDistribution } from "@/utils/portfolioCharts";
import { getTickerInfo } from "@/api/upbitApi";
import { addAsset, deleteAsset, deleteAllAssets } from "@/lib/portfolioActions";

export const usePortfolioAssets = (initialAssets: Asset[], userId: string) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [distribution, setDistribution] = useState<{ symbol: string; value: number }[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [showEmptyModal, setShowEmptyModal] = useState(initialAssets.length === 0);
  const [isAdding, setIsAdding] = useState(false);

  const prevCountRef = useRef(initialAssets.length);

  const updatePrices = async (currentAssets: Asset[]) => {
    const symbols = [...new Set(currentAssets.map((a) => a.symbol))];

    if (symbols.length === 0) {
      setPriceMap({});
      setDistribution([]);
      setStats(calculateStats([], {}));
      return;
    }

    const tickers = await getTickerInfo(symbols.map((s) => `KRW-${s}`));
    const map: Record<string, number> = {};

    tickers.forEach((t) => {
      const symbol = t.market.replace("KRW-", "");
      map[symbol] = t.trade_price;
    });

    setPriceMap(map);
    setStats(calculateStats(currentAssets, map));
    setDistribution(getDistribution(currentAssets, map));
  };

  useEffect(() => {
    updatePrices(initialAssets);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (prevCountRef.current > 0 && assets.length === 0) {
      setShowEmptyModal(true);
    }
    prevCountRef.current = assets.length;
    updatePrices(assets);
  }, [assets]);

  const addAssetHandler = async (asset: Omit<Asset, "userId" | "_id">) => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const newId = await addAsset({ ...asset, userId });
      setAssets((prev) => [...prev, { ...asset, userId, _id: newId }]);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteAssetById = async (id: string) => {
    setAssets((prev) => prev.filter((a) => a._id !== id));
    await deleteAsset(id);
  };

  const deleteAllAssetsHandler = async () => {
    setAssets([]);
    await deleteAllAssets(userId);
  };

  const dismissEmptyModal = () => setShowEmptyModal(false);

  return {
    assets,
    stats,
    distribution,
    priceMap,
    showEmptyModal,
    isAdding,
    addAsset: addAssetHandler,
    deleteAssetById,
    deleteAllAssets: deleteAllAssetsHandler,
    dismissEmptyModal,
  };
};