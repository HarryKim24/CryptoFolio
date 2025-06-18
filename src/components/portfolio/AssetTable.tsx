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
          <th className="p-2">코인</th>
          <th className="p-2 text-right">수량</th>
          <th className="p-2 text-right">평균가</th>
          <th className="p-2 text-right">현재가</th>
          <th className="p-2 text-right">평가금액</th>
          <th className="p-2 text-right">손익</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((a, i) => {
          const value = a.quantity * a.currentPrice
          const cost = a.quantity * a.averagePrice
          const profit = value - cost
          const rate = cost ? (profit / cost) * 100 : 0
          return (
            <tr key={i} className="border-t border-gray-700">
              <td className="p-2">{a.symbol} - {a.name}</td>
              <td className="p-2 text-right">{a.quantity}</td>
              <td className="p-2 text-right">{a.averagePrice.toLocaleString()}</td>
              <td className="p-2 text-right">{a.currentPrice.toLocaleString()}</td>
              <td className="p-2 text-right">{value.toLocaleString()}</td>
              <td className="p-2 text-right">{profit.toLocaleString()} ({rate.toFixed(2)}%)</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default AssetTable