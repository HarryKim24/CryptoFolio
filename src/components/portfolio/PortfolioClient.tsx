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
import EmptyPortfolioModal from '@/components/portfolio/EmptyPortfolioModal'

const PortfolioClient = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [showModal, setShowModal] = useState(false);
  const [distribution, setDistribution] = useState<{ symbol: string; value: number }[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [showEmptyModal, setShowEmptyModal] = useState(false);


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/asset')
        if (!res.ok) throw new Error('자산 불러오기 실패')
  
        const data: Asset[] = await res.json()
  
        const symbols = [...new Set(data.map(a => a.symbol))]
        if (symbols.length === 0) {
          setAssets(data)
          setPriceMap({})
          setDistribution([])
          setShowEmptyModal(true)
          return
        }
  
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

  const requestDeleteAll = () => {
    setConfirmAllOpen(true)
  }
  
  const confirmDeleteAll = async () => {
    try {
      const res = await fetch(`/api/asset`, {
        method: 'DELETE',
      })
  
      if (!res.ok) throw new Error("전체 삭제 실패")
  
      setAssets([])
    } catch (err) {
      console.error("전체 삭제 오류:", err)
      alert("전체 삭제 중 문제가 발생했습니다.")
    } finally {
      setConfirmAllOpen(false)
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
              className="w-full px-4 py-2 rounded-xl whitespace-nowrap bg-portfolio
              text-neutral-100 hover:bg-portfolio/90 shadow transition"
            >
              + 거래 추가
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
          onDeleteAll={requestDeleteAll}
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

      <EmptyPortfolioModal open={showEmptyModal} onClose={() => setShowEmptyModal(false)} />
    </div>
  )
}

export default PortfolioClient;