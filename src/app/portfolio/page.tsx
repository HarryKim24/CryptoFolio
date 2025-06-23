'use client'

import React, { useEffect, useState } from 'react'
import AssetSummary from '@/components/portfolio/AssetSummary'
import AssetTable from '@/components/portfolio/AssetTable'
import AssetModal from '@/components/portfolio/AssetModal'
import AssetDistribution from '@/components/portfolio/AssetDisturibution'
import AssetPerformance from '@/components/portfolio/AssetPerformance'
import { Asset } from '@/components/portfolio/types'
import { getTickerInfo } from '@/api/upbitApi'
import { getDistribution } from '@/utils/portfolioCharts'
import ConfirmModal from '@/components/portfolio/ConfirmModal'

const PortfolioPage = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [showModal, setShowModal] = useState(false)
  const [distribution, setDistribution] = useState<{ symbol: string; value: number }[]>([])
  const [priceMap, setPriceMap] = useState<Record<string, number>>({})

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/asset')
        if (!res.ok) throw new Error('자산 불러오기 실패')

        const data: Asset[] = await res.json()
        const symbols = [...new Set(data.map(a => a.symbol))]
        const tickers = await getTickerInfo(symbols.map(s => `KRW-${s}`))
        const priceMap: Record<string, number> = {}
        tickers.forEach(t => {
          const symbol = t.market.replace('KRW-', '')
          priceMap[symbol] = t.trade_price
        })

        setAssets(data)
        setPriceMap(priceMap)
        setDistribution(getDistribution(data, priceMap))
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
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "자산 저장 실패")
      }

      const savedAsset: Asset = await response.json()
      setAssets(prev => [...prev, savedAsset])
      setShowModal(false)
    } catch (err) {
      console.error("자산 저장 실패:", err)
      alert("거래 저장 중 오류가 발생했습니다.")
    }
  }

  const requestDelete = (id: string | undefined) => {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    try {
      const res = await fetch(`/api/asset/${pendingDeleteId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('삭제 실패')
      setAssets(prev => prev.filter(a => a._id !== pendingDeleteId))
    } catch (err) {
      console.error('삭제 오류:', err)
      alert('삭제 중 문제가 발생했습니다.')
    } finally {
      setConfirmOpen(false)
      setPendingDeleteId(undefined)
    }
  }

  return (
    <div className="p-6 space-y-8 text-neutral-100 max-w-screen-2xl mx-auto lg:px-20">
      <div className="flex flex-col xs:px-20 lg:px-0 lg:flex-row items-stretch gap-6">
        <div className="w-full lg:w-5/6">
          <AssetSummary assets={assets} />
        </div>
        <div className="w-full lg:w-1/6 flex flex-col justify-end">
          <div className="mt-auto">
            <button
              onClick={() => setShowModal(true)}
              className="w-full px-4 py-2 border border-neutral-100/20  rounded-xl whitespace-nowrap bg-white/10 
              text-neutral-100 hover:bg-white/20 shadow transition"
            >
              + 거래 추가
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xs:px-20 lg:px-0 lg:flex-row gap-6 w-full items-center">
        <div className="flex-1 h-full w-full">
          <AssetDistribution allocation={distribution} />
        </div>
        <div className="flex-1 h-full w-full min-w-[200px]">
          <AssetPerformance assets={assets} priceMap={priceMap} />
        </div>
      </div>

      <AssetModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddAsset}
      />

      <div className="xs:px-20 lg:px-0 lg:flex-row gap-6 w-full items-center">
        <AssetTable assets={assets} onDelete={requestDelete} />
      </div>

      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="거래를 삭제하시겠습니까?"
      />
    </div>
  )
}

export default PortfolioPage