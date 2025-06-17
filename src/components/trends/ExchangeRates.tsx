"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type CurrencyRate = {
  country: string;
  pair: string;
  rate: string;
};

const currencies = [
  { country: "미국", pair: "USD/KRW" },
  { country: "일본", pair: "JPY/KRW" },
  { country: "중국", pair: "CNY/KRW" },
  { country: "유로", pair: "EUR/KRW" },
];

const ExchangeRates = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get("/api/exchange");
        setRates(res.data);
      } catch (err) {
        console.error("환율 불러오기 실패", err);
        setRates(
          currencies.map((c) => ({
            ...c,
            rate: "N/A",
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <section className="bg-white/5 rounded-xl p-3 shadow flex-none">
      <h2 className="text-xl font-bold mb-2">KRW 기준 환율</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-stretch">
        {isLoading
          ? currencies.map((_, i) => (
              <div
                key={i}
                className="bg-white/10 px-3 py-2 rounded min-h-[64px] animate-pulse space-y-2"
              >
                <div className="h-4 rounded w-2/3" />
                <div className="h-3 rounded w-1/2" />
              </div>
            ))
          : rates.map((currency, i) => (
              <div
                key={i}
                className="bg-white/10 px-3 py-2 rounded flex flex-col justify-center min-h-[64px]"
              >
                <div className="flex justify-between items-center">
                  <div className="text-neutral-100">
                    <div className="text-md">{currency.country}</div>
                    <div className="text-[12px] lg:text-[14px] text-gray-400">
                      {currency.pair}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-400 leading-tight">
                      {currency.rate !== "N/A" ? `₩${currency.rate}` : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default ExchangeRates;