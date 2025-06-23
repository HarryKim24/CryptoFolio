'use client'

import React, { useEffect, useState } from 'react'
import type { Asset } from './types'

interface Props {
  assets: Asset[]
  onDelete: (id: string | undefined) => void
  onDeleteAll: () => void
}

const AssetTable = ({ assets, onDelete, onDeleteAll }: Props) => {
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
              {Array.from({ length: 7 }).map((__, j) => (
                <div key={j} className="h-4" style={{ width: j === 2 ? '30%' : '12%' }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 rounded-xl shadow p-4 flex flex-col h-[500px] overflow-hidden">
      <div className='flex justify-between pb-4'>
        <h3 className="text-lg text-gray-300 mb-2">거래 내역</h3>
        <button
          onClick={onDeleteAll}
          className="px-2 py-0.5 rounded-lg bg-red-600/40 hover:bg-red-600/70 text-neutral-100 transition text-sm"
          >
          모두 삭제
        </button>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <table className="min-w-full table-fixed text-sm text-white whitespace-nowrap">
          <thead className="sticky top-0 bg-white/5 backdrop-blur-xl z-10 text-gray-300">
            <tr>
              <th className="p-2 text-center">거래일</th>
              <th className="p-2 text-center">종류</th>
              <th className="p-2 text-center">코인</th>
              <th className="p-2 text-center">수량</th>
              <th className="p-2 text-center">단가</th>
              <th className="p-2 text-center">거래 금액</th>
              <th className="p-2 text-center">삭제</th>
            </tr> 
          </thead>
          <tbody>
            {[...assets]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((a, i) => {
                const value = a.quantity * a.currentPrice
                const isBuy = a.type === 'buy'
                return (
                  <tr key={i} className="border-t border-gray-400">
                    <td className="p-2 text-center">{a.date}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-[2px] rounded-xl text-xs font-medium tracking-wide uppercase
                          ${isBuy ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'}`}
                      >
                        {isBuy ? '구매' : '매도'}
                      </span>
                    </td>
                    <td className="p-2 text-center">{a.symbol} - {a.name}</td>
                    <td className="p-2 text-right">{a.quantity}</td>
                    <td className="p-2 text-right">{a.averagePrice.toLocaleString()}</td>
                    <td className="p-2 text-right">{value.toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => onDelete(a._id)}
                        className="px-2 py-1 rounded-lg bg-red-500/40 hover:bg-red-500/70 text-neutral-100 transition text-sm"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AssetTable