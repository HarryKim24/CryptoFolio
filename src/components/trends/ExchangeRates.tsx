import React from "react";

const ExchangeRates = () => {
  return (
    <section className="bg-white/5 rounded-xl p-3 shadow flex-none">
      <h2 className="text-xl font-bold mb-2">오늘의 환율</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-stretch">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/10 px-3 py-2 rounded flex flex-col justify-center"
          >
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-gray-400">통화명</span>
              <div className="text-right">
                <div className="text-sm font-semibold text-red-400 leading-tight">1,361.30</div>
                <div className="text-[10px] text-gray-300 leading-none">+0.20%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExchangeRates;