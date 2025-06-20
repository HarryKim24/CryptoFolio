'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Asset } from './types'

interface Props {
  assets: Asset[]
}

const AssetTable = ({ assets }: Props) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 300)
    return () => clearTimeout(timeout)
  }, [])

  if (!isReady) {
    return (
      <div className="bg-white/5 rounded-xl shadow p-4 h-[500px] animate-pulse flex flex-col overflow-hidden">
        <div className="h-6 w-32 mb-4" />
        <div className="flex-1 space-y-3 overflow-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              {Array.from({ length: 6 }).map((__, j) => (
                <div
                  key={j}
                  className="h-4"
                  style={{ width: j === 2 ? '30%' : '12%' }}
                />
              ))}
            </div>
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
      className="bg-white/5 rounded-xl shadow p-4 flex flex-col h-[500px] overflow-hidden"
    >
      <h3 className="text-lg text-gray-300 mb-2">거래 내역</h3>

      <div className="flex-1 overflow-auto w-full">
        <table className="min-w-full table-fixed text-sm text-white whitespace-nowrap">
          <thead className="sticky top-0 bg-white/5 backdrop-blur-xl z-10 text-gray-300">
            <tr>
              <th className="p-2">거래일</th>
              <th className="p-2">종류</th>
              <th className="p-2">코인</th>
              <th className="p-2 text-right">수량</th>
              <th className="p-2 text-right">단가</th>
              <th className="p-2 text-right">거래 금액</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => {
              const value = a.quantity * a.currentPrice
              const isBuy = a.type === 'buy'

              return (
                <tr key={i} className="border-t border-gray-400">
                  <td className="p-2">{a.date}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        isBuy ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {isBuy ? '구매' : '매도'}
                    </span>
                  </td>
                  <td className="p-2">{a.symbol} - {a.name}</td>
                  <td className="p-2 text-right">{a.quantity}</td>
                  <td className="p-2 text-right">{a.averagePrice.toLocaleString()}</td>
                  <td className="p-2 text-right">{value.toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default AssetTable