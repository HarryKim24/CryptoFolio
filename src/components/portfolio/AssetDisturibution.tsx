'use client';

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

Chart.register(ArcElement, Tooltip, Legend);

type AllocationItem = {
  symbol: string;
  value: number;
};

type AssetDistributionProps = {
  allocation: AllocationItem[];
};

const COLORS = [
  '#6366f1',
  '#10b981',
  '#facc15',
  '#f472b6',
  '#60a5fa',
  '#fb923c',
  '#34d399',
  '#a78bfa',
  '#f87171',
  '#4ade80',
  '#94a3b8',
];

const AssetDistribution = ({ allocation }: AssetDistributionProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const total = allocation.reduce((sum, item) => sum + item.value, 0);
  const sortedAllocation = [...allocation].sort((a, b) => b.value - a.value);
  const top10 = sortedAllocation.slice(0, 10);
  const others = sortedAllocation.slice(10);
  const othersValue = others.reduce((sum, item) => sum + item.value, 0);

  const displayData =
    others.length > 0
      ? [...top10, { symbol: '기타', value: othersValue }]
      : top10;

  const data = {
    labels: displayData.map((item) => item.symbol),
    datasets: [
      {
        data: displayData.map((item) => item.value),
        backgroundColor: COLORS.slice(0, displayData.length),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (!isReady) {
    return (
      <div className="bg-white/5 rounded-xl shadow p-4 h-[400px] animate-pulse flex flex-col overflow-hidden">
        <div className="h-7 w-20 mb-2" />
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-8 flex-col md:flex-row w-max mx-auto">
            <div className="flex items-center justify-center w-[300px] h-[300px] flex-shrink-0">
              <div className="h-[300px] w-[300px] bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center justify-center flex-shrink-0 min-w-[200px]">
              <div className="flex flex-col space-y-2 w-fit">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-4 w-[160px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-white/5 shadow p-4 rounded-xl flex flex-col md:h-[400px] overflow-hidden"
    >
      <h3 className="text-xl font-bold text-neutral-100 mb-2">보유 종목 분포</h3>
      <div className="flex-1 w-full justify-center overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-8 flex-col md:flex-row w-max mx-auto">
          <div className="flex items-center justify-center w-[300px] h-[300px] flex-shrink-0">
            <Doughnut data={data} options={options} />
          </div>
          <div className="flex items-center justify-center flex-shrink-0 min-w-[200px]">
            <div className="flex flex-col text-sm text-white space-y-2 w-fit">
              {displayData.map((item, index) => {
                const percent = total > 0 ? (item.value / total) * 100 : 0;

                return (
                  <div
                    key={`${item.symbol}-${index}`}
                    className="flex items-center justify-between min-w-[160px] pl-4 pr-4"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span>{item.symbol}</span>
                    </div>
                    <div className="text-gray-300">
                      {percent.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetDistribution;