/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, TimeScale,
  PointElement, LineElement, Tooltip, Legend
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Tooltip, Legend);

interface CoinVolume {
  market: string;
  korean_name: string;
}

const TopVolume = () => {
  const [topCoins, setTopCoins] = useState<CoinVolume[]>([]);
  const [current, setCurrent] = useState(0);
  const [chartData, setChartData] = useState<Record<string, any>>({});
  const chartDataRef = useRef<Record<string, any>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % topCoins.length);
    }, 5000);
  }, [topCoins.length]);

  const pauseAndSetCurrent = (updateFn: (prev: number) => number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

    setCurrent(updateFn);

    pauseTimeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 5000);
  };

  const handlePrev = () => {
    pauseAndSetCurrent((prev) => (prev - 1 + topCoins.length) % topCoins.length);
  };

  const handleNext = () => {
    pauseAndSetCurrent((prev) => (prev + 1) % topCoins.length);
  };

  useEffect(() => {
    const fetchTopVolumeCoins = async () => {
      try {
        const marketRes = await axios.get("https://api.upbit.com/v1/market/all?isDetails=false");
        const krwMarkets = marketRes.data.filter((m: any) => m.market.startsWith("KRW-"));
        const altMarkets = krwMarkets.filter((m: any) => m.market !== "KRW-BTC");

        const marketQuery = altMarkets.map((m: any) => m.market).join(",");
        const tickerRes = await axios.get(`https://api.upbit.com/v1/ticker?markets=${marketQuery}`);
        const tickers = tickerRes.data.filter((t: any) => t.market !== "KRW-BTC");

        const sorted = tickers
          .sort((a: any, b: any) => b.acc_trade_price_24h - a.acc_trade_price_24h)
          .slice(0, 3)
          .map((t: any) => {
            const m = altMarkets.find((k: any) => k.market === t.market);
            return {
              market: t.market,
              korean_name: m?.korean_name ?? t.market,
            };
          });

        setTopCoins(sorted);
      } catch (err) {
        console.error("Top volume fetch error:", err);
      }
    };

    fetchTopVolumeCoins();
  }, []);

  useEffect(() => {
    const fetchChart = async (market: string) => {
      try {
        const res = await axios.get("https://api.upbit.com/v1/candles/minutes/30", {
          params: { market, count: 48 },
        });
        const data = res.data.reverse().map((item: any) => ({
          x: new Date(item.candle_date_time_kst),
          y: item.trade_price,
        }));

        setChartData((prev) => {
          const updated = { ...prev, [market]: data };
          chartDataRef.current = updated;
          return updated;
        });
      } catch (err) {
        console.error("Chart data error:", err);
      }
    };

    topCoins.forEach((coin) => {
      if (!chartDataRef.current[coin.market]?.length) {
        fetchChart(coin.market);
      }
    });
  }, [topCoins]);

  useEffect(() => {
    if (topCoins.length === 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    startAutoSlide();

    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(pauseTimeoutRef.current!);
    };
  }, [topCoins, startAutoSlide]);

  return (
    <section className="bg-white/5 rounded-xl p-6 shadow flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-xl font-bold">가장 많이 거래되는 알트코인</h2>
      </div>

      <div className="relative flex-1 overflow-hidden min-h-[297px]">
        <AnimatePresence mode="sync">
          {topCoins.length > 0 ? (
            chartData[topCoins[current].market]?.length ? (
              <motion.div
                key={topCoins[current].market}
                initial={{ opacity: 0, x: 534 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -534 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex flex-col h-full"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {topCoins[current].korean_name} ({topCoins[current].market})
                </h3>
                <div className="flex-1">
                  <Line
                    data={{
                      datasets: [
                        {
                          label: "가격",
                          data: chartData[topCoins[current].market],
                          borderColor: "#34D399",
                          backgroundColor: "rgba(52, 211, 153, 0.1)",
                          fill: true,
                          tension: 0.4,
                          pointRadius: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          type: "time",
                          time: { unit: "hour", displayFormats: { hour: "HH:mm" } },
                          ticks: { color: "#aaa" },
                          grid: { color: "rgba(255,255,255,0.05)" },
                        },
                        y: {
                          ticks: {
                            color: "#aaa",
                            callback: (val: any) => `₩${Number(val).toLocaleString("ko-KR")}`,
                          },
                          grid: { color: "rgba(255,255,255,0.05)" },
                        },
                      },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2 h-full animate-pulse">
                <div className="h-5 w-2/5 bg-white/10 rounded" />
                <div className="flex-1 bg-white/5 rounded" />
              </div>
            )
          ) : (
            <div className="flex flex-col gap-2 h-full animate-pulse">
              <div className="h-5 w-1/3 bg-white/10 rounded" />
              <div className="flex-1 bg-white/5 rounded" />
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-6">
        <button
          onClick={handlePrev}
          className="w-8 h-8 text-lg bg-white/10 rounded-full hover:bg-white/20 transition flex items-center justify-center"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="w-8 h-8 text-lg bg-white/10 rounded-full hover:bg-white/20 transition flex items-center justify-center"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
};

export default TopVolume;