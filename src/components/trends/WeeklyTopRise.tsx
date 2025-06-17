import React from "react";

const WeeklyTopRise = () => {
  return (
    <section className="bg-white/5 rounded-xl p-4 shadow flex flex-col gap-4 flex-1">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">주간 상승률 Top 10</h2>
        <span className="text-sm text-gray-400">06.17 10:00 기준</span>
      </div>
      <ol className="space-y-2 text-sm">
        {[...Array(10)].map((_, i) => (
          <li key={i} className="flex justify-between">
            <span>{i + 1}. 코인명 (KRW-ABC)</span>
            <span className="text-red-400">+00.00%</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default WeeklyTopRise;