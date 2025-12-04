"use client";

import { useEffect, useState } from "react";
import { Asset } from "@/types/assetTypes";
import { calculateStats, PortfolioStats } from "@/utils/calculateStats";
import { getDistribution } from "@/utils/portfolioCharts";
import { getTickerInfo } from "@/api/upbitApi";
import { addAsset, deleteAsset, deleteAllAssets } from "@/lib/portfolioActions";

type DistributionItem = {
  symbol: string;
  value: number;
};

type PriceMap = {
  [key: string]: number;
};

type NewAssetInput = {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  date: string | Date;
  type: 'buy' | 'sell';
};

export const usePortfolioAssets = (initialAssets: Asset[], userId: string) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [distribution, setDistribution] = useState<DistributionItem[]>([]);
  const [priceMap, setPriceMap] = useState<PriceMap>({});
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [showEmptyModal, setShowEmptyModal] = useState(initialAssets.length === 0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const updatePortfolio = async () => {

      if (assets.length === 0) {
        setPriceMap({});
        setDistribution([]);
        setStats(calculateStats([], {}));
        setIsLoading(false);
        return;
      }

      setShowEmptyModal(false);

      const symbols = assets.map((asset) => asset.symbol);
      const uniqueSymbols = symbols.filter((symbol, index) => {
          return symbols.indexOf(symbol) === index;
      });
      
      const markets = uniqueSymbols.map((symbol) => `KRW-${symbol}`);

      try {
        const tickers = await getTickerInfo(markets);
        
        const nextPriceMap: PriceMap = {};
        
        tickers.forEach((ticker) => {
          const symbol = ticker.market.replace("KRW-", "");
          nextPriceMap[symbol] = ticker.trade_price;
        });

        const nextStats = calculateStats(assets, nextPriceMap);
        const nextDistribution = getDistribution(assets, nextPriceMap);

        setPriceMap(nextPriceMap);
        setStats(nextStats);
        setDistribution(nextDistribution);
      } catch (e) {
        console.error("포트폴리오 업데이트 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    updatePortfolio();
  }, [assets, initialAssets]); 

  const handleAddAsset = async (asset: NewAssetInput) => {
    if (isAdding) return;

    setIsAdding(true);
    try {
      const newId = await addAsset({ ...asset, userId } as Asset);
      const nextAsset = { ...asset, userId, _id: newId } as Asset;
      
      setAssets((prev) => [...prev, nextAsset]);
      setShowEmptyModal(false);
    } catch {
        alert("자산 추가 실패");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAssetById = async (id: string) => {
    try {
        await deleteAsset(id);
        setAssets((prev) => {
            const nextAssets = prev.filter((asset) => asset._id !== id);
            if (nextAssets.length === 0) {
                setShowEmptyModal(true);
            }
            return nextAssets;
        });
    } catch (e) {
        console.error(e);
    }
  };

  const handleDeleteAllAssets = async () => {
    if (confirm("정말 모든 자산을 삭제하시겠습니까?")) {
        await deleteAllAssets(userId);
        setAssets([]);
        setShowEmptyModal(true);
    }
  };

  return {
    assets,
    stats,
    distribution,
    priceMap,
    isLoading,
    showEmptyModal,
    isAdding,
    addAsset: handleAddAsset,
    deleteAssetById: handleDeleteAssetById,
    deleteAllAssets: handleDeleteAllAssets,
    dismissEmptyModal: () => setShowEmptyModal(false),
  };
};