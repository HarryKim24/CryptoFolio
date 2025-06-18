/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React from 'react'
import { Asset } from './types'

interface Props {
  assets: Asset[]
  priceMap: Record<string, number>
}

const AssetPerformance = ({ assets, priceMap }: Props) => {
  const holdings = new Map<string, { name: string, quantity: number, totalCost: number }>()

  for (const a of assets) {
    const record = holdings.get(a.symbol) ?? { name: a.name, quantity: 0, totalCost: 0 }

    if (a.type === 'buy') {
      record.quantity += a.quantity
      record.totalCost += a.quantity * a.averagePrice
    } else if (a.type === 'sell') {
      record.quantity -= a.quantity
      record.totalCost -= a.quantity * a.averagePrice
    }

    holdings.set(a.symbol, record)
  }

  const data = Array.from(holdings.entries())
    .filter(([_, v]) => v.quantity > 0)
    .map(([symbol, { name, quantity, totalCost }]) => {
      const currentPrice = priceMap[symbol] ?? 0
      const currentValue = quantity * currentPrice
      const profit = currentValue - totalCost
      const rate = totalCost > 0 ? (profit / totalCost) * 100 : 0

      return {
        symbol,
        name,
        quantity,
        currentPrice,
        currentValue,
        profit,
        rate,
      }
    })

  return (
    <div className="bg-gray-800 p-4 rounded-xl h-[400px] flex flex-col overflow-hidden">
      <h3 className="text-sm text-white mb-2">보유 종목 수익</h3>
      <div className="flex-1 overflow-auto w-full">
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-xs text-white">
            <thead className="text-gray-400 border-b border-gray-600 text-left">
              <tr>
                <th className="pb-1">코인</th>
                <th className="pb-1 text-right">현재가</th>
                <th className="pb-1 text-right">수익</th>
                <th className="pb-1 text-right">수익률</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-1 truncate">{d.symbol} - {d.name}</td>
                  <td className="py-1 text-right">{d.currentPrice.toLocaleString()} ₩</td>
                  <td className={`py-1 text-right ${d.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {d.profit >= 0 ? '+' : ''}{d.profit.toLocaleString()} ₩
                  </td>
                  <td className={`py-1 text-right ${d.rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {d.rate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AssetPerformance