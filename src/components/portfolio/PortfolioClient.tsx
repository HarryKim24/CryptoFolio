"use client";

import React, { useState, useEffect, useCallback } from "react";
import AssetSummary from "@/components/portfolio/AssetSummary";
import AssetTable from "@/components/portfolio/AssetTable";
import AssetModal from "@/components/portfolio/AssetModal";
import AssetDistribution from "@/components/portfolio/AssetDisturibution";
import AssetPerformance from "@/components/portfolio/AssetPerformance";
import ConfirmModal from "@/components/portfolio/ConfirmModal";
import EmptyPortfolioModal from "@/components/portfolio/EmptyPortfolioModal";
import { Asset } from "@/types/assetTypes";
import { getTickerInfo } from "@/api/upbitApi";
import { getDistribution } from "@/utils/portfolioCharts";
import { calculateStats, PortfolioStats } from "@/utils/calculateStats";
import { addAsset, deleteAsset, deleteAllAssets } from "@/lib/portfolioActions";

interface PortfolioClientProps {
  initialAssets: Asset[];
  userId: string;
}

const ZERO_STATS: PortfolioStats = {
  evaluation: 0,
  totalBuy: 0,
  allTimeProfit: 0,
  realisedProfit: 0,
  unrealisedProfit: 0,
  profitRate: 0,
  costBasis: 0,
};

const PortfolioClient = ({ initialAssets, userId }: PortfolioClientProps) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [distribution, setDistribution] = useState<{ symbol: string; value: number }[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [stats, setStats] = useState<PortfolioStats | null>(null);

  const [showEmptyModal, setShowEmptyModal] = useState(initialAssets.length === 0);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
    setShowEmptyModal(assets.length === 0);
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

  const requestDelete = (id: string | undefined) => {
    if (!id) return;
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    const targetId = pendingDeleteId;
    setAssets((prev) => prev.filter((a) => a._id !== targetId));
    setConfirmOpen(false);
    setPendingDeleteId(null);

    try {
      await deleteAsset(targetId);
    } catch (error) {
      console.error("거래 삭제 중 오류:", error);
    }
  };

  const confirmDeleteAll = async () => {
    setAssets([]);
    setConfirmAllOpen(false);

    try {
      await deleteAllAssets(userId);
    } catch (error) {
      console.error("전체 삭제 중 오류:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 text-neutral-100 max-w-screen-2xl mx-auto lg:px-20">
      <div className="flex flex-col xs:px-20 lg:px-0 lg:flex-row items-stretch gap-6">
        <div className="w-full lg:w-5/6">
          <AssetSummary stats={stats} />
        </div>
        <div className="w-full lg:w-1/6 flex flex-col justify-end">
          <div className="mt-auto">
            <button
              onClick={() => !isAdding && setShowModal(true)}
              disabled={isAdding}
              className={`w-full text-xl font-bold px-4 py-2 rounded-xl whitespace-nowrap bg-portfolio 
              text-neutral-100 shadow transition 
              ${isAdding ? "opacity-50 cursor-not-allowed" : "hover:brightness-105"}`}
            >
              {isAdding ? "추가 중..." : "거래 추가"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full items-center overflow-x-auto gap-6 lg:gap-0 px-0 xs:px-20 lg:px-0">
        <div className="flex-none min-w-[320px] w-full lg:w-1/2 lg:pr-3">
          <AssetDistribution allocation={distribution} />
        </div>
        <div className="flex-none min-w-[320px] w-full lg:w-1/2 lg:pl-3">
          <AssetPerformance assets={assets} priceMap={priceMap} />
        </div>
      </div>

      <AssetModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddAsset}
      />

      <div className="xs:px-20 lg:px-0 lg:flex-row gap-6 w-full items-center">
        <AssetTable
          assets={assets}
          onDelete={requestDelete}
          onDeleteAll={() => setConfirmAllOpen(true)}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="거래를 삭제하시겠습니까?"
        description="선택한 거래 내역이 삭제됩니다."
      />

      <ConfirmModal
        open={confirmAllOpen}
        onCancel={() => setConfirmAllOpen(false)}
        onConfirm={confirmDeleteAll}
        title="모든 거래를 삭제하시겠습니까?"
        description="전체 포트폴리오 기록이 사라집니다."
      />

      <EmptyPortfolioModal
        open={showEmptyModal}
        onClose={() => setShowEmptyModal(false)}
      />
    </div>
  );
};

export default PortfolioClient;