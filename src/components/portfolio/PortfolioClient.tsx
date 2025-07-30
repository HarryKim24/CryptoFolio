"use client";

import React, { useState, useEffect } from "react";
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
import { addAsset, deleteAsset, deleteAllAssets } from "@/lib/portfolioActions";

interface PortfolioClientProps {
  initialAssets: Asset[];
  userId: string;
}

const PortfolioClient = ({ initialAssets, userId }: PortfolioClientProps) => {
  const [assets, setAssets] = useState(initialAssets);
  const [distribution, setDistribution] = useState<{ symbol: string; value: number }[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [showEmptyModal, setShowEmptyModal] = useState(initialAssets.length === 0);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>();
  const [isAdding, setIsAdding] = useState(false);

  const updatePrices = async (updatedAssets: Asset[]) => {
    const symbols = [...new Set(updatedAssets.map((a) => a.symbol))];
    if (symbols.length === 0) {
      setPriceMap({});
      setDistribution([]);
      setShowEmptyModal(true);
      return;
    }

    const tickers = await getTickerInfo(symbols.map((s) => `KRW-${s}`));
    const priceMap: Record<string, number> = {};
    tickers.forEach((t) => {
      const symbol = t.market.replace("KRW-", "");
      priceMap[symbol] = t.trade_price;
    });

    setPriceMap(priceMap);
    setDistribution(getDistribution(updatedAssets, priceMap));
  };

  useEffect(() => {
    updatePrices(initialAssets);
  }, [initialAssets]);

  const handleAddAsset = async (asset: Omit<Asset, 'userId' | '_id'>) => {
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
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setAssets((prev) => prev.filter((a) => a._id !== pendingDeleteId));
    await deleteAsset(pendingDeleteId);
    setConfirmOpen(false);
    setPendingDeleteId(undefined);
  };

  const confirmDeleteAll = async () => {
    setAssets([]);
    await deleteAllAssets(userId);
    setConfirmAllOpen(false);
  };

  return (
    <div className="p-6 space-y-6 text-neutral-100 max-w-screen-2xl mx-auto lg:px-20">
      <div className="flex flex-col xs:px-20 lg:px-0 lg:flex-row items-stretch gap-6">
        <div className="w-full lg:w-5/6">
          <AssetSummary assets={assets} />
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

      <AssetModal show={showModal} onClose={() => setShowModal(false)} onSave={handleAddAsset} />

      <div className="xs:px-20 lg:px-0 lg:flex-row gap-6 w-full items-center">
        <AssetTable assets={assets} onDelete={requestDelete} onDeleteAll={() => setConfirmAllOpen(true)} />
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

      <EmptyPortfolioModal open={showEmptyModal} onClose={() => setShowEmptyModal(false)} />
    </div>
  );
};

export default PortfolioClient;