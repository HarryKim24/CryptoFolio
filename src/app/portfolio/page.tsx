'use client'

import React, { useEffect, useState } from 'react'
import AssetSummary from '@/components/portfolio/AssetSummary'
import AssetTable from '@/components/portfolio/AssetTable'
import AssetModal from '@/components/portfolio/AssetModal'
import { Asset } from '@/components/portfolio/types'

const PortfolioPage = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/asset')
        if (!res.ok) throw new Error('자산 불러오기 실패')

        const data: Asset[] = await res.json()
        setAssets(data)
      } catch (err) {
        console.error(err)
        alert('자산을 불러오는 데 실패했습니다.')
      }
    }

    fetchAssets()
  }, [])

  const handleAddAsset = async (asset: Asset) => {
    try {
      const response = await fetch("/api/asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "자산 저장 실패");
      }

      const savedAsset = await response.json()
      setAssets(prev => [...prev, savedAsset])
      setShowModal(false)
    } catch (err) {
      console.error("자산 저장 실패:", err)
      alert("거래 저장 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <AssetSummary assets={assets} />

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        + 거래 추가
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

export default PortfolioPage