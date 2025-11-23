"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type CurrencyRate = {
  country: string;
  pair: string;
  rate: string;
};

type CurrencyBase = {
  country: string;
  pair: string;
};

const currencies: CurrencyBase[] = [
  { country: "미국", pair: "USD/KRW" },
  { country: "일본", pair: "JPY/KRW" },
  { country: "중국", pair: "CNY/KRW" },
  { country: "유로", pair: "EUR/KRW" },
];

const getTodayText = () => {
  const date = new Date();

  const year = date.getFullYear();
  const monthNumber = date.getMonth() + 1;
  const dayNumber = date.getDate();

  const month = String(monthNumber).padStart(2, "0");
  const day = String(dayNumber).padStart(2, "0");

  let weekday = "요일";

  try {
    weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
  } catch {
    weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  }

  return `${year}. ${month}. ${day} (${weekday})`;
};

const ExchangeRates = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get<CurrencyRate[]>("/api/exchange");

        const dataArray = Array.isArray(response.data) ? response.data : [];

        const validRates = dataArray.filter((item) => {
          if (!item) {
            return false;
          }

          const hasCountry = typeof item.country === "string";
          const hasPair = typeof item.pair === "string";
          const hasRate = typeof item.rate === "string";

          return hasCountry && hasPair && hasRate;
        });

        setRates(validRates);
      } catch (error) {
        console.error("환율 불러오기 실패", error);

        const fallbackRates: CurrencyRate[] = currencies.map((currency) => {
          return {
            country: currency.country,
            pair: currency.pair,
            rate: "N/A",
          };
        });

        setRates(fallbackRates);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  const today = getTodayText();

  return (
    <section className="bg-white/5 rounded-xl p-6 shadow flex-none min-h-[160px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">KRW 기준 환율</h2>
        <span className="text-sm text-gray-300">{today}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 items-center">
        {currencies.map((currency, index) => {
          const rateData = rates.find((rateItem) => {
            return rateItem.pair === currency.pair;
          });

          let displayRate = "0 원";

          if (!isLoading) {
            if (rateData && rateData.rate !== "N/A") {
              displayRate = `${rateData.rate} 원`;
            } else if (rateData && rateData.rate === "N/A") {
              displayRate = "N/A";
            }
          }

          const isActiveRate = !isLoading;

          return (
            <div
              key={index}
              className="bg-white/10 px-3 py-3 rounded flex flex-col justify-center min-h-[72px]"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[16px] font-bold text-neutral-100">
                  {currency.country}
                </span>
                <span
                  className={`text-[16px] font-semibold ${
                    isActiveRate
                      ? "text-red-400"
                      : "text-gray-400 animate-pulse"
                  }`}
                >
                  {displayRate}
                </span>
              </div>
              <div className="text-[12px] lg:text-[14px] text-gray-300">
                {currency.pair}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExchangeRates;