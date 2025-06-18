'use client'

import React, { useEffect, useState } from 'react'
import { Asset } from './types'
import { getTickerInfo } from '@/api/upbitApi'
import { calculateStats, PortfolioStats } from '@/utils/calculateStats'

interface Props {
  assets: Asset[]
}

const AssetSummary = ({ assets }: Props) => {
  const [stats, setStats] = useState<PortfolioStats | null>(null)

  useEffect(() => {
    const load = async () => {
      const symbols = [...new Set(assets.map(a => a.symbol))]
      if (symbols.length === 0) return

      const tickers = await getTickerInfo(symbols.map(s => `KRW-${s}`))
      const priceMap: Record<string, number> = {}
      tickers.forEach(t => {
        const symbol = t.market.replace('KRW-', '')
        priceMap[symbol] = t.trade_price
      })

      const s = calculateStats(assets, priceMap)
      setStats(s)
    }

    load()
  }, [assets])

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-white">
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="text-sm text-gray-400 flex items-center gap-1">
          총 평가금액
          <span title="보유 수량 × 현재가">ℹ️</span>
        </div>
        <div className="text-2xl font-bold">{stats.evaluation.toLocaleString()} 원</div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="text-sm text-gray-400 flex items-center gap-1">
          총 투자금 (Cost Basis)
          <span title="모든 매수 금액의 합 (수량 × 매수가)">ℹ️</span>
        </div>
        <div className="text-2xl font-bold">{stats.totalBuy.toLocaleString()} 원</div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl col-span-2 xl:col-span-1">
        <div className="text-sm text-gray-400 flex items-center gap-1">
          총 수익
          <span title="실현 수익 + 미실현 수익">ℹ️</span>
        </div>
        <div className={`text-2xl font-bold ${stats.allTimeProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {stats.allTimeProfit >= 0 ? '+' : ''}{stats.allTimeProfit.toLocaleString()} 원
        </div>
        <div className="text-xs mt-2 text-gray-400 space-y-1">
          <div>
            실현 수익:
            <span className={`ml-1 ${stats.realisedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.realisedProfit >= 0 ? '+' : ''}{stats.realisedProfit.toLocaleString()} 원
            </span>
          </div>
          <div>
            미실현 수익:
            <span className={`ml-1 ${stats.unrealisedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.unrealisedProfit >= 0 ? '+' : ''}{stats.unrealisedProfit.toLocaleString()} 원
            </span>
          </div>
          <div>
            총 수익률:
            <span className={`ml-1 ${stats.profitRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.profitRate.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetSummary