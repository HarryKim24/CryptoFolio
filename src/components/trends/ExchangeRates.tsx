"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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

        const validRates = Array.isArray(res.data)
          ? res.data.filter(
              (r): r is CurrencyRate =>
                r &&
                typeof r.country === "string" &&
                typeof r.pair === "string" &&
                typeof r.rate === "string"
            )
          : [];

        setRates(validRates);
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

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let weekday = "요일";
  try {
    weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
  } catch {
    weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  }

  const today = `${year}. ${month}. ${day} (${weekday})`;

  return (
    <section className="bg-white/5 rounded-xl p-6 shadow flex-none min-h-[160px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">KRW 기준 환율</h2>
        <span className="text-sm text-gray-300">{today}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-center">
        {isLoading ? (
          currencies.map((_, i) => (
            <div
              key={i}
              className="bg-white/10 px-3 py-3 rounded min-h-[72px] animate-pulse space-y-2"
            />
          ))
        ) : (
          <AnimatePresence>
            {rates.map((currency, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-white/10 px-3 py-3 rounded flex flex-col justify-center min-h-[72px]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[16px] font-bold text-neutral-100">
                    {currency.country ?? "국가 없음"}
                  </span>
                  <span className="text-[16px] font-semibold text-red-400">
                    {currency.rate !== "N/A"
                      ? `${currency.rate} 원`
                      : "N/A"}
                  </span>
                </div>
                <div className="text-[12px] lg:text-[14px] text-gray-300">
                  {currency.pair ?? "통화쌍 없음"}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default ExchangeRates;