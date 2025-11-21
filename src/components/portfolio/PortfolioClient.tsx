"use client";

import React, { useState } from "react";
import AssetSummary from "@/components/portfolio/AssetSummary";
import AssetTable from "@/components/portfolio/AssetTable";
import AssetModal from "@/components/portfolio/AssetModal";
import AssetDistribution from "@/components/portfolio/AssetDisturibution";
import AssetPerformance from "@/components/portfolio/AssetPerformance";
import ConfirmModal from "@/components/portfolio/ConfirmModal";
import EmptyPortfolioModal from "@/components/portfolio/EmptyPortfolioModal";
import { Asset } from "@/types/assetTypes";
import { usePortfolioAssets } from "@/hooks/usePortfolioAssets";

interface PortfolioClientProps {
  initialAssets: Asset[];
  userId: string;
}

const PortfolioClient = ({ initialAssets, userId }: PortfolioClientProps) => {
  const {
    assets,
    stats,
    distribution,
    priceMap,
    showEmptyModal,
    isAdding,
    addAsset,
    deleteAssetById,
    deleteAllAssets,
    dismissEmptyModal,
  } = usePortfolioAssets(initialAssets, userId);

  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleAddAsset = async (asset: Omit<Asset, "userId" | "_id">) => {
    await addAsset(asset);
  };

  const requestDelete = (id: string | undefined) => {
    if (!id) return;
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const targetId = pendingDeleteId;
    setConfirmOpen(false);
    setPendingDeleteId(null);
    await deleteAssetById(targetId);
  };

  const confirmDeleteAll = async () => {
    setConfirmAllOpen(false);
    await deleteAllAssets();
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

      <EmptyPortfolioModal open={showEmptyModal} onClose={dismissEmptyModal} />
    </div>
  );
};

export default PortfolioClient;