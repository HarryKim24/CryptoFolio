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
  const total = allocation.reduce((sum, item) => sum + item.value, 0)

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

  const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
}


  return (
    <div className="bg-gray-800 p-4 rounded-xl h-[400px] flex flex-col">
      <h3 className="text-lg text-white">배분</h3>

      <div className="flex flex-1 gap-8">
        <div className="flex-1 flex items-center justify-center p-4">
          <Doughnut data={data} options={options} />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col text-sm text-white space-y-2 w-fit">
            {displayData.map((item, index) => {
              const percent = total > 0 ? (item.value / total) * 100 : 0
              return (
                <div key={index} className="flex items-center justify-between min-w-[232px] pl-4 pr-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span>{item.symbol}</span>
                  </div>
                  <div className="text-gray-300">{percent.toFixed(2)}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetDistribution