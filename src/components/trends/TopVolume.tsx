import React from "react";

const TopVolume = () => {
  return (
    <section className="bg-white/5 rounded-xl p-4 shadow flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-xl font-bold">일간 거래량 TOP 10</h2>
      </div>
      <ol className="space-y-2 text-sm">
        {[...Array(10)].map((_, i) => (
          <li
            key={i}
            className="flex justify-between items-center border-b border-white/10 pb-1"
          >
            <span>{i + 1}. 코인명 (KRW-ABC)</span>
            <span className="text-gray-200 whitespace-nowrap">₩ 000,000,000</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default TopVolume;