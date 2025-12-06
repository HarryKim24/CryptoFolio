"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import { formatNumberForDisplay } from "@/utils/formatNumber";
import { CandleType, NormalizedCandle } from "@/types/upbitTypes";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ChartPoint = { x: Date; y: number | [number, number, number, number] };

type Props = {
  market: string;
  candles: NormalizedCandle[];
  ohlc: ChartPoint[];
  volume: ChartPoint[];
  candleType: CandleType;
  unit: number;
};

const CoinChartView = ({
  market,
  candles,
  ohlc,
  volume,
  candleType,
  unit,
}: Props) => {
  
  const candlestickOptions: ApexOptions = useMemo(() => ({
      chart: {
        id: "candlestick-chart",
        type: "candlestick",
        background: "#0b0f19",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        type: "datetime",
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        opposite: true,
        tooltip: { enabled: true },
        labels: {
          style: { colors: "#fff" },
          minWidth: 60,
          formatter: (value: number) => String(formatNumberForDisplay(value)),
        },
      },
      grid: { borderColor: "#222" },
      tooltip: {
        shared: true,
        custom: ({ dataPointIndex }) => {
          const candle = candles[dataPointIndex];
          if (!candle) return "";
          return `<div><strong>${format(
            candle.date,
            "yyyy-MM-dd HH:mm"
          )}</strong><br/>시가: ${candle.open}<br/>고가: ${
            candle.high
          }<br/>저가: ${candle.low}<br/>종가: ${candle.close}</div>`;
        },
      },
      theme: { mode: "dark" },
      plotOptions: {
        candlestick: {
          colors: { upward: "#3FB68B", downward: "#F46A6A" },
        },
      },
    }), [candles]);

  const volumeOptions: ApexOptions = useMemo(() => ({
      chart: {
        id: "volume-chart",
        type: "bar",
        background: "#0b0f19",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: { colors: "#ccc" },
          datetimeFormatter: {
            year: "yyyy",
            month: "yyyy-MM",
            day: "MM-dd",
            hour: "HH:mm",
            minute: "HH:mm",
          },
        },
      },
      yaxis: {
        opposite: true,
        show: true,
        labels: {
          style: { colors: "#fff" },
          minWidth: 60,
          formatter: () => "",
        },
      },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value: number) => formatNumberForDisplay(value),
        },
      },
      plotOptions: { bar: { columnWidth: "75%" } },
      grid: { borderColor: "#222" },
      theme: { mode: "dark" },
    }), []);

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl shadow">
      <div className="flex-1 bg-[#0b0f19]">
        <ReactApexChart
          key={`${market}-${candleType}-${unit}-price`}
          options={candlestickOptions}
          series={[{ data: ohlc, name: "가격" }]}
          type="candlestick"
          height="100%"
        />
      </div>

      <div className="h-[120px] bg-[#0b0f19]">
        <ReactApexChart
          key={`${market}-${candleType}-${unit}-volume`}
          options={volumeOptions}
          series={[{ data: volume, name: "거래량" }]}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CoinChartView;