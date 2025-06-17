import React from "react";

const TopPerformance = () => {
  return (
    <section className="bg-white/5 rounded-xl p-4 shadow flex flex-col gap-4 flex-1 min-h-[480px]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">디지털 자산 퍼포먼스</h2>
        <span className="text-sm text-gray-400">업비트 기준</span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left md:whitespace-nowrap">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="p-3 font-medium whitespace-nowrap">자산명</th>
              <th className="p-3 font-medium">마켓</th>
              <th className="p-3 font-medium text-right">1주</th>
              <th className="p-3 font-medium text-right">1달</th>
              <th className="p-3 font-medium text-right">3달</th>
              <th className="p-3 font-medium text-right">6달</th>
              <th className="p-3 font-medium text-right">1년</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="hover:bg-white/5 transition">
                <td className="p-3 text-gray-100">코인명</td>
                <td className="p-3 text-gray-300">KRW/BTC</td>
                <td className="p-3 text-red-400 text-right">+0.00%</td>
                <td className="p-3 text-red-400 text-right">+0.00%</td>
                <td className="p-3 text-blue-400 text-right">-0.00%</td>
                <td className="p-3 text-blue-400 text-right">-0.00%</td>
                <td className="p-3 text-gray-400 text-right">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TopPerformance;