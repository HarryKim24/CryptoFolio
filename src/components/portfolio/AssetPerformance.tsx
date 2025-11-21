'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Asset } from '../../types/assetTypes'
import { formatNumberForDisplay, formatPrice } from '@/utils/formatNumber'
import { calculateAssetsPerformance } from '@/utils/calculateAssetsPerformance'

interface Props {
  assets: Asset[]
  priceMap: Record<string, number>
}

const AssetPerformance = ({ assets, priceMap }: Props) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 300)
    return () => clearTimeout(timeout)
  }, [])

  const data = calculateAssetsPerformance(assets, priceMap)

  if (!isReady) {
    return (
      <div className="bg-white/5 rounded-xl shadow p-4 h-[400px] animate-pulse flex flex-col">
        <div className="h-6 w-24" />
        <div className="flex-1 overflow-auto space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-white/5 rounded-xl shadow p-4 h-[400px] flex flex-col overflow-hidden"
    >
      <h3 className="text-xl font-bold text-neutral-100 mb-2">보유 종목 수익</h3>

      <div className="flex-1 overflow-auto w-full">
        <table className="min-w-full table-fixed text-sm text-neutral-100 whitespace-nowrap">
          <thead className="sticky top-0 text-gray-300 text-left bg-white/5 backdrop-blur-xl z-10">
            <tr>
              <th className="p-2">코인</th>
              <th className="p-2 text-right">보유 수량</th>
              <th className="p-2 text-right">평단가</th>
              <th className="p-2 text-right">현재가</th>
              <th className="p-2 text-right">수익</th>
              <th className="p-2 text-right">수익률</th>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a, b) => b.profit - a.profit)
              .map((d, i) => (
                <tr key={i} className="border-t border-gray-400">
                  <td className="py-2 pr-2 pl-2 truncate">
                    {d.symbol} - {d.name}
                  </td>
                  <td className="py-2 pr-2 text-right">
                    {formatNumberForDisplay(d.quantity)}
                  </td>
                  <td className="py-2 pr-2 text-right">
                    {formatPrice(d.averagePrice)} 원
                  </td>
                  <td className="py-2 pr-2 text-right">
                    {formatPrice(d.currentPrice)} 원
                  </td>
                  <td
                    className={`py-2 pr-2 text-right ${
                      d.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {d.profit >= 0 ? '+' : ''}
                    {Math.floor(d.profit).toLocaleString()} 원
                  </td>
                  <td
                    className={`py-2 pr-2 text-right ${
                      d.rate >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {d.rate >= 0 ? '+' : ''}
                    {d.rate.toFixed(2)}%
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default AssetPerformance