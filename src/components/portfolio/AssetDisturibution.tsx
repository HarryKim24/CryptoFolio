'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import React from 'react'

Chart.register(ArcElement, Tooltip, Legend)

interface Props {
  allocation: { symbol: string; value: number }[]
}

const COLORS = [
  '#6366f1', '#10b981', '#facc15', '#f472b6',
  '#60a5fa', '#fb923c', '#34d399', '#a78bfa',
  '#f87171', '#4ade80', '#94a3b8'
]

const AssetDistribution = ({ allocation }: Props) => {
  const sorted = [...allocation].sort((a, b) => b.value - a.value)
  const top10 = sorted.slice(0, 10)
  const others = sorted.slice(10)
  const othersValue = others.reduce((sum, item) => sum + item.value, 0)

  const displayData = others.length > 0
    ? [...top10, { symbol: '기타', value: othersValue }]
    : top10

  const data = {
    labels: displayData.map(a => a.symbol),
    datasets: [
      {
        data: displayData.map(a => a.value),
        backgroundColor: COLORS.slice(0, displayData.length),
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h3 className="text-sm text-white mb-2">배분</h3>
      <Doughnut data={data} />
    </div>
  )
}

export default AssetDistribution;