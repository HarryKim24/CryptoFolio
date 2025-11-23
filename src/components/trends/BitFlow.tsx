/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type PricePoint = {
  x: Date;
  y: number;
};

type UpbitCandle = {
  candle_date_time_kst: string;
  trade_price: number;
};

const BitFlow = () => {
  const [btcData, setBtcData] = useState<PricePoint[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<any>(null);
  const [gradient, setGradient] = useState<string | CanvasGradient>(
    "rgba(96,165,250,0.2)"
  );

  useEffect(() => {
    const fetchBTC = async () => {
      try {
        const response = await axios.get<UpbitCandle[]>(
          "/api/proxy/v1/candles/minutes/30",
          {
            params: { market: "KRW-BTC", count: 48 },
          }
        );

        const dataArray = Array.isArray(response.data) ? response.data : [];

        const formattedData: PricePoint[] = dataArray
          .reverse()
          .filter(
            (item) =>
              item.candle_date_time_kst &&
              typeof item.trade_price === "number"
          )
          .map((item) => {
            const time = new Date(item.candle_date_time_kst);
            const price = item.trade_price;

            return {
              x: time,
              y: price,
            };
          });

        setBtcData(formattedData);
      } catch (error) {
        console.error("BTC 데이터 로딩 실패:", error);
        setBtcData([]);
      }
    };

    fetchBTC();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobileWidth = 768;
      const isNowMobile = window.innerWidth < mobileWidth;
      setIsMobile(isNowMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chartInstance = chartRef.current.chart ?? chartRef.current;
    const context = chartInstance?.ctx;

    if (!context) {
      return;
    }

    const linearGradient = context.createLinearGradient(0, 0, 0, 400);
    linearGradient.addColorStop(0, "rgba(96,165,250,0.35)");
    linearGradient.addColorStop(1, "rgba(96,165,250,0.02)");

    setGradient(linearGradient);
  }, [btcData]);

  const formatPrice = (value: number) => {
    if (isMobile) {
      const divided = Math.round(value / 10000);
      const localized = divided.toLocaleString("ko-KR");
      return `${localized} 만원`;
    }

    const localized = value.toLocaleString("ko-KR");
    return `${localized} 원`;
  };

  const latestPrice =
    btcData.length > 0 ? btcData[btcData.length - 1].y : null;

  const chartData: ChartData<"line", PricePoint[]> = {
    datasets: [
      {
        label: "BTC 가격 (KRW)",
        data: btcData,
        borderColor: "#60A5FA",
        backgroundColor: gradient,
        fill: "origin",
        tension: 0.45,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#3B82F6",
        animations: {
          x: {
            type: "number",
            easing: "easeInOutQuart",
            duration: 500,
            from: Number.NaN,
            delay: (ctx: any) => ctx.index * 50,
          },
        } as any,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        hitRadius: 10,
        hoverRadius: 6,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH시",
          },
        },
        ticks: {
          color: "#aaa",
          font: {
            size: 12,
            weight: "normal",
          },
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
      y: {
        ticks: {
          color: "#aaa",
          callback: (tickValue: string | number) => {
            if (typeof tickValue === "number") {
              return formatPrice(tickValue);
            }
            return tickValue;
          },
          font: {
            size: 12,
            weight: "normal",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#93c5fd",
        bodyColor: "#e5e7eb",
        borderColor: "#3b82f6",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.parsed?.y;
            if (typeof value === "number") {
              return formatPrice(value);
            }
            return "";
          },
        },
      },
    },
  };

  return (
    <section className="bg-white/5 rounded-xl p-6 pb-4 shadow flex flex-col gap-6 min-h-[620px]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">비트코인 트렌드</h2>
        <span className="text-xl font-semibold text-red-400">
          {latestPrice !== null ? formatPrice(latestPrice) : "0 원"}
        </span>
      </div>

      <div className="mt-6">
        <div
          className="bg-white/5 rounded-lg shadow-inner p-4"
          style={{ height: "490px" }}
        >
          {btcData.length > 0 && (
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
    </section>
  );
};

export default BitFlow;