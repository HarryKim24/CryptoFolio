/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface CoinVolume {
  market: string;
  korean_name: string;
}

type CandlePoint = {
  x: Date;
  y: number;
};

const TopVolume = () => {
  const [topCoins, setTopCoins] = useState<CoinVolume[]>([]);
  const [current, setCurrent] = useState(0);
  const [chartData, setChartData] = useState<Record<string, CandlePoint[]>>({});

  const chartDataRef = useRef<Record<string, CandlePoint[]>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % topCoins.length);
    }, 5000);
  }, [topCoins.length]);

  const pauseAndSetCurrent = (updateFn: (prev: number) => number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    setCurrent(updateFn);

    pauseTimeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 5000);
  };

  const handlePrev = () => {
    pauseAndSetCurrent(
      (prev) => (prev - 1 + topCoins.length) % topCoins.length
    );
  };

  const handleNext = () => {
    pauseAndSetCurrent((prev) => (prev + 1) % topCoins.length);
  };

  const formatYAxisTick = (value: any) => {
    if (typeof value === "number" && !Number.isNaN(value)) {
      const localized = value.toLocaleString("ko-KR");
      return `${localized} 원`;
    }
    return "- 원";
  };

  useEffect(() => {
    const fetchTopVolumeCoins = async () => {
      try {
        const marketResponse = await axios.get("/api/proxy/v1/market/all", {
          params: { isDetails: false },
        });

        const marketList = Array.isArray(marketResponse.data)
          ? marketResponse.data
          : [];

        const krwMarkets = marketList.filter((item: any) => {
          return item.market.startsWith("KRW-");
        });

        const altMarkets = krwMarkets.filter((item: any) => {
          return item.market !== "KRW-BTC";
        });

        const marketQuery = altMarkets.map((item: any) => item.market).join(",");

        const tickerResponse = await axios.get("/api/proxy/v1/ticker", {
          params: { markets: marketQuery },
        });

        const tickerList = Array.isArray(tickerResponse.data)
          ? tickerResponse.data
          : [];

        const filteredTickers = tickerList.filter((ticker: any) => {
          return ticker.market !== "KRW-BTC";
        });

        const sortedTickers = filteredTickers
          .slice()
          .sort((first: any, second: any) => {
            return second.acc_trade_price_24h - first.acc_trade_price_24h;
          })
          .slice(0, 3);

        const volumeCoins: CoinVolume[] = sortedTickers.map((ticker: any) => {
          const marketInfo = altMarkets.find(
            (item: any) => item.market === ticker.market
          );

          const koreanName =
            marketInfo && marketInfo.korean_name
              ? marketInfo.korean_name
              : ticker.market;

          return {
            market: ticker.market,
            korean_name: koreanName,
          };
        });

        setTopCoins(volumeCoins);
      } catch (error) {
        console.error("Top volume fetch error:", error);
      }
    };

    fetchTopVolumeCoins();
  }, []);

  useEffect(() => {
    const fetchChart = async (market: string) => {
      try {
        const response = await axios.get("/api/proxy/v1/candles/minutes/30", {
          params: { market, count: 48 },
        });

        const candleList = Array.isArray(response.data)
          ? response.data
          : [];

        const data: CandlePoint[] = candleList
          .slice()
          .reverse()
          .map((item: any) => {
            const time = new Date(item.candle_date_time_kst);
            const price = item.trade_price;

            return {
              x: time,
              y: price,
            };
          });

        setChartData((previous) => {
          const updated = { ...previous, [market]: data };
          chartDataRef.current = updated;
          return updated;
        });
      } catch (error) {
        console.error("Chart data error:", error);
      }
    };

    topCoins.forEach((coin) => {
      const hasData = chartDataRef.current[coin.market];
      if (!hasData || hasData.length === 0) {
        fetchChart(coin.market);
      }
    });
  }, [topCoins]);

  useEffect(() => {
    if (topCoins.length === 0) {
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    startAutoSlide();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [topCoins, startAutoSlide]);

  const currentCoin = topCoins[current] ?? null;
  const currentMarket = currentCoin ? currentCoin.market : "";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "hour" as const,
          displayFormats: { hour: "HH시" },
        },
        ticks: {
          color: "#aaa",
          maxRotation: 0,
          minRotation: 0,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: {
          color: "#aaa",
          callback: (value: any) => formatYAxisTick(value),
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <section className="bg-white/5 rounded-xl p-6 shadow flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-xl font-bold">가장 많이 거래되는 알트코인</h2>
      </div>

      <div className="relative flex-1 overflow-hidden min-h-[297px]">
        <AnimatePresence mode="sync">
          {currentCoin && chartData[currentMarket]?.length ? (
            <motion.div
              key={currentMarket}
              initial={{ opacity: 0, x: 534 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -534 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex flex-col h-full"
            >
              <h3 className="text-lg font-semibold mb-2">
                {currentCoin.korean_name} ({currentCoin.market})
              </h3>
              <div className="flex-1">
                <Line
                  data={{
                    datasets: [
                      {
                        label: "가격",
                        data: chartData[currentMarket],
                        borderColor: "#34D399",
                        backgroundColor: "rgba(52, 211, 153, 0.1)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-2">
                코인명 (KRW-COIN)
              </h3>
              <div className="flex-1">
                <Line
                  data={{
                    datasets: [],
                  }}
                  options={chartOptions}
                />
              </div>
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