"use client";

import { useEffect, useRef, useState } from "react";
import { Asset } from "@/types/assetTypes";
import { calculateStats, PortfolioStats } from "@/utils/calculateStats";
import { getDistribution } from "@/utils/portfolioCharts";
import { getTickerInfo } from "@/api/upbitApi";
import { addAsset, deleteAsset, deleteAllAssets } from "@/lib/portfolioActions";

type DistributionItem = {
  symbol: string;
  value: number;
};

export const usePortfolioAssets = (initialAssets: Asset[], userId: string) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [distribution, setDistribution] = useState<DistributionItem[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [showEmptyModal, setShowEmptyModal] = useState(initialAssets.length === 0);
  const [isAdding, setIsAdding] = useState(false);

  const previousCountRef = useRef(initialAssets.length);

  useEffect(() => {
    const loadInitialPrices = async () => {
      const hasAssets = initialAssets.length > 0;

      if (!hasAssets) {
        setPriceMap({});
        setDistribution([]);
        setStats(calculateStats([], {}));
        return;
      }

      const symbols = initialAssets.map((asset) => asset.symbol);
      const uniqueSymbols = Array.from(new Set(symbols));
      const markets = uniqueSymbols.map((symbol) => `KRW-${symbol}`);

      const tickers = await getTickerInfo(markets);
      const nextPriceMap: Record<string, number> = {};

      tickers.forEach((ticker) => {
        const symbol = ticker.market.replace("KRW-", "");
        nextPriceMap[symbol] = ticker.trade_price;
      });

      const nextStats = calculateStats(initialAssets, nextPriceMap);
      const nextDistribution = getDistribution(initialAssets, nextPriceMap);

      setPriceMap(nextPriceMap);
      setStats(nextStats);
      setDistribution(nextDistribution);
    };

    loadInitialPrices();
  }, [initialAssets]);

  useEffect(() => {
    const previousCount = previousCountRef.current;
    const currentCount = assets.length;
    const hadAssetsBefore = previousCount > 0;
    const hasNoAssetsNow = currentCount === 0;

    if (hadAssetsBefore && hasNoAssetsNow) {
      setShowEmptyModal(true);
    }

    previousCountRef.current = currentCount;

    const loadPrices = async () => {
      const hasAssets = assets.length > 0;

      if (!hasAssets) {
        setPriceMap({});
        setDistribution([]);
        setStats(calculateStats([], {}));
        return;
      }

      const symbols = assets.map((asset) => asset.symbol);
      const uniqueSymbols = Array.from(new Set(symbols));
      const markets = uniqueSymbols.map((symbol) => `KRW-${symbol}`);

      const tickers = await getTickerInfo(markets);
      const nextPriceMap: Record<string, number> = {};

      tickers.forEach((ticker) => {
        const symbol = ticker.market.replace("KRW-", "");
        nextPriceMap[symbol] = ticker.trade_price;
      });

      const nextStats = calculateStats(assets, nextPriceMap);
      const nextDistribution = getDistribution(assets, nextPriceMap);

      setPriceMap(nextPriceMap);
      setStats(nextStats);
      setDistribution(nextDistribution);
    };

    loadPrices();
  }, [assets]);

  const handleAddAsset = async (asset: Omit<Asset, "userId" | "_id">) => {
    if (isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      const newId = await addAsset({ ...asset, userId });
      const nextAsset: Asset = { ...asset, userId, _id: newId };

      setAssets((previous) => {
        return [...previous, nextAsset];
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAssetById = async (id: string) => {
    setAssets((previous) => {
      return previous.filter((asset) => asset._id !== id);
    });

    await deleteAsset(id);
  };

  const handleDeleteAllAssets = async () => {
    setAssets([]);
    await deleteAllAssets(userId);
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
    deleteAssetById: handleDeleteAssetById,
    deleteAllAssets: handleDeleteAllAssets,
    dismissEmptyModal,
  };
};