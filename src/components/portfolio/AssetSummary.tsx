'use client'

import React, { useEffect, useState } from 'react'
import { Asset } from './types'
import { getTickerInfo } from '@/api/upbitApi'
import { calculateStats, PortfolioStats } from '@/utils/calculateStats'
import { motion } from 'framer-motion'

interface Props {
  assets: Asset[]
}

const AssetSummary = ({ assets }: Props) => {
  const [stats, setStats] = useState<PortfolioStats | null>(null)

  useEffect(() => {
    const load = async () => {
      const symbols = [...new Set(assets.map((a) => a.symbol))]
      if (symbols.length === 0) return

      const tickers = await getTickerInfo(symbols.map((s) => `KRW-${s}`))
      const priceMap: Record<string, number> = {}
      tickers.forEach((t) => {
        const symbol = t.market.replace('KRW-', '')
        priceMap[symbol] = t.trade_price
      })

      const s = calculateStats(assets, priceMap)
      setStats(s)
    }

    load()
  }, [assets])

  if (!stats) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full text-neutral-100">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="w-full bg-white/5 rounded-xl shadow p-4 animate-pulse h-[68px]" />
          <div className="w-full bg-white/5 rounded-xl shadow p-4 animate-pulse h-[68px]" />
        </div>
        <div className="w-full bg-white/5 rounded-xl shadow p-4 animate-pulse h-[124px] lg:h-[152px]" />
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full text-neutral-100"
    >
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="w-full bg-white/5 transition shadow p-4 rounded-xl flex flex-row justify-between">
          <div className="text-lg text-gray-300">평가금액</div>
          <div className="text-2xl font-bold mt-1">
            {stats.evaluation.toLocaleString()} 원
          </div>
        </div>

        <div className="w-full bg-white/5 shadow p-4 rounded-xl flex flex-row justify-between">
          <div className="text-lg text-gray-300">총 투자금</div>
          <div className="text-2xl font-bold mt-1">
            {stats.totalBuy.toLocaleString()} 원
          </div>
        </div>
      </div>

      <div className="w-full bg-white/5 shadow p-4 rounded-xl flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-300">총 수익</div>
          <div
            className={`text-2xl lg:text-3xl font-bold ${
              stats.allTimeProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {stats.allTimeProfit >= 0 ? '+' : ''}
            {stats.allTimeProfit.toLocaleString()} 원
          </div>
        </div>
        <div className="text-xs mt-1 text-gray-300 space-y-1 pl-1">
          <div className="flex justify-between">
            <span>실현 수익:</span>
            <span
              className={`${
                stats.realisedProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {stats.realisedProfit >= 0 ? '+' : ''}
              {stats.realisedProfit.toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between">
            <span>미실현 수익:</span>
            <span
              className={`${
                stats.unrealisedProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {stats.unrealisedProfit >= 0 ? '+' : ''}
              {stats.unrealisedProfit.toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between">
            <span>총 수익률:</span>
            <span
              className={`${
                stats.profitRate >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {stats.profitRate.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default AssetSummary