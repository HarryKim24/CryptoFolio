import React from 'react'

interface Props {
  totalValue: number
  totalProfit: number
  profitRate: number
  deposit: number
  totalInvestment: number
}

const AssetSummary = ({ totalValue, totalProfit, profitRate, deposit, totalInvestment }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white">
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="text-sm text-gray-400">총 평가 금액</div>
        <div className="text-2xl font-bold">{totalValue.toLocaleString()} 원</div>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="text-sm text-gray-400">투자 수익률</div>
        <div className="text-2xl font-bold">{profitRate.toFixed(2)}% ({totalProfit.toLocaleString()} 원)</div>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="text-sm text-gray-400">입금된 원화 / 총 투자금</div>
        <div className="text-2xl font-bold">{deposit.toLocaleString()} / {totalInvestment.toLocaleString()} 원</div>
      </div>
    </div>
  )
}

export default AssetSummary