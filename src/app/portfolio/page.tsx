'use client'

import React, { useState } from 'react'
import AssetSummary from '@/components/portfolio/AssetSummary'
import AssetTable from '@/components/portfolio/AssetTable'
import AssetModal from '@/components/portfolio/AssetModal'
import { Asset } from '@/components/portfolio/types'

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deposit] = useState<number>(0)

  const totalInvestment = assets.reduce((sum, a) => sum + a.quantity * a.averagePrice, 0)
  const totalValue = assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0)
  const totalProfit = totalValue - totalInvestment
  const profitRate = totalInvestment ? (totalProfit / totalInvestment) * 100 : 0

  const handleAddAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset])
  }

  return (
    <div className="p-6 space-y-6">
      <AssetSummary
        totalValue={totalValue}
        totalProfit={totalProfit}
        profitRate={profitRate}
        deposit={deposit}
        totalInvestment={totalInvestment}
      />

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        + 자산 추가
      </button>

      <AssetModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddAsset}
      />

      <AssetTable assets={assets} />
    </div>
  )
}