'use client'

import type { Asset } from '../../types/assetTypes'
import { formatNumberForDisplay, formatPrice } from '@/utils/formatNumber'

type AssetTableProps = {
  assets: Asset[]
  onDelete: (id: string) => void
  onDeleteAll: () => void
  isLoading?: boolean
}

const AssetTable = ({ assets, onDelete, onDeleteAll, isLoading = false }: AssetTableProps) => {
  
  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-xl shadow p-4 flex flex-col min-h-[160px] max-h-[500px] overflow-hidden animate-pulse" />
    )
  }

  const hasAssets = assets.length > 0
  const sortedAssets = [...assets].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="bg-white/5 rounded-xl shadow p-4 flex flex-col min-h-[160px] max-h-[500px] overflow-hidden">
      <div className="flex justify-between pb-4">
        <h3 className="text-xl font-bold text-neutral-100 mb-2">거래 내역</h3>
        <button
          onClick={onDeleteAll}
          disabled={!hasAssets}
          className={`px-2 py-0.5 rounded-lg text-neutral-100 transition text-sm ${
            hasAssets
              ? 'bg-red-500 hover:brightness-105'
              : 'bg-gray-500 cursor-not-allowed opacity-60'
          }`}
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
            {sortedAssets.map((item) => {
              const value = item.quantity * item.averagePrice
              const isBuy = item.type === 'buy'
              const key = item._id ?? `${item.symbol}-${item.date}-${item.type}`

              return (
                <tr key={key} className="border-t border-gray-400">
                  <td className="p-2 text-center">{item.date}</td>

                  <td className="p-2 text-center">
                    <span
                      className={`px-2 py-[2px] rounded-xl text-xs font-medium tracking-wide uppercase ${
                        isBuy
                          ? 'bg-green-400/20 text-green-300'
                          : 'bg-red-400/20 text-red-300'
                      }`}
                    >
                      {isBuy ? '구매' : '매도'}
                    </span>
                  </td>

                  <td className="p-2 text-center">
                    {item.symbol} - {item.name}
                  </td>

                  <td className="p-2 text-right">
                    {formatNumberForDisplay(item.quantity)}
                  </td>

                  <td className="p-2 text-right">
                    {formatPrice(item.averagePrice)} 원
                  </td>

                  <td className="p-2 text-right">
                    {formatPrice(value)} 원
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => item._id && onDelete(item._id)}
                      className="px-2 py-1 rounded-lg bg-red-500 hover:brightness-105 text-neutral-100 transition text-sm"
                      disabled={!item._id}
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