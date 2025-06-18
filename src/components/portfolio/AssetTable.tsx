import React from 'react'
import { Asset } from './types'

interface Props {
  assets: Asset[]
}

const AssetTable = ({ assets }: Props) => (
  <div className="overflow-x-auto mt-4 text-white">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-700 text-left">
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
            <tr key={i} className="border-t border-gray-700">
              <td className="p-2">{a.date}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    isBuy ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
)

export default AssetTable