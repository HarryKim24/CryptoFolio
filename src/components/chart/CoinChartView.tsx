"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { formatNumberForDisplay } from "@/utils/formatNumber";
import { CandleType, NormalizedCandle } from "@/types/upbitTypes";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ChartData = {
  x: Date;
  y: number | number[];
};

type Props = {
  market: string;
  candles: NormalizedCandle[];
  ohlc: ChartData[];
  volume: ChartData[];
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

  const processedOhlc = useMemo(
    () => ohlc.map(p => ({ x: p.x.getTime(), y: p.y })),
    [ohlc]
  );

  const processedVolume = useMemo(
    () => volume.map(p => ({ x: p.x.getTime(), y: p.y })),
    [volume]
  );

  const currentCandle = candles.length > 0 ? candles[candles.length - 1] : null;
  const currentPrice = currentCandle ? currentCandle.close : null;
  const isUpward = currentCandle ? currentCandle.close >= currentCandle.open : true;
  const labelColor = isUpward ? "#3FB68B" : "#F46A6A";

  const candlestickOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: "candlestick-chart",
        type: "candlestick",
        background: "#0b0f19",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: false,
          dynamicAnimation: { enabled: false },
        },
      },

      annotations: {
        yaxis: currentPrice
          ? [
              {
                y: currentPrice,
                borderColor: "transparent",
                label: {
                  borderColor: labelColor,
                  style: {
                    color: "#fff",
                    background: labelColor,
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: { left: 4, right: 4, top: 2, bottom: 3 },
                  },
                  text: formatNumberForDisplay(currentPrice),
                  position: "right",
                  textAnchor: "start",
                  offsetX: 15,
                  offsetY: 5,
                },
              },
            ]
          : [],
      },

      states: {
        active: { filter: { type: "none" } },
        hover: { filter: { type: "none" } },
      },

      xaxis: {
        type: "datetime",
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: true },
        crosshairs: {
          show: true,
          width: 1,
          stroke: { color: "#555", width: 1, dashArray: 3 },
        },
      },

      yaxis: {
        opposite: true,
        tooltip: { enabled: true },
        crosshairs: {
          show: true,
          position: "back",
          stroke: { color: "#555", width: 1, dashArray: 3 },
        },
        labels: {
          style: { colors: "#fff" },
          minWidth: 80,
          maxWidth: 80,
          formatter: (value: number) => String(formatNumberForDisplay(value)),
        },
      },

      grid: { borderColor: "#222" },

      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        theme: "dark",
        x: { format: "yyyy-MM-dd HH:mm" },
        y: { formatter: value => formatNumberForDisplay(value) },
      },

      plotOptions: {
        candlestick: {
          colors: { upward: "#3FB68B", downward: "#F46A6A" },
        },
      },
    }),
    [currentPrice, labelColor]
  );

  const volumeOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: "volume-chart",
        type: "bar",
        background: "#0b0f19",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: false },
      },

      colors: ["#5e6673"],

      states: {
        active: { filter: { type: "none" } },
        hover: { filter: { type: "none" } },
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
        crosshairs: {
          show: true,
          width: 1,
          stroke: { color: "#555", width: 1, dashArray: 3 },
        },
      },

      yaxis: {
        opposite: true,
        show: true,
        labels: {
          style: { colors: "#fff" },
          minWidth: 60,
          maxWidth: 60,
          formatter: () => "",
        },
      },

      dataLabels: { enabled: false },

      tooltip: {
        enabled: true,
        theme: "dark",
        y: {
          formatter: value => formatNumberForDisplay(value),
        },
      },

      plotOptions: { bar: { columnWidth: "75%" } },

      grid: { borderColor: "#222" },
      theme: { mode: "dark" },
    }),
    []
  );

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl shadow">
      <div className="flex-1 bg-[#0b0f19]">
        <ReactApexChart
          key={`${market}-${candleType}-${unit}-price`}
          options={candlestickOptions}
          series={[{ data: processedOhlc, name: "가격" }]}
          type="candlestick"
          height="100%"
        />
      </div>

      <div className="h-[120px] bg-[#0b0f19]">
        <ReactApexChart
          key={`${market}-${candleType}-${unit}-volume`}
          options={volumeOptions}
          series={[{ data: processedVolume, name: "거래량" }]}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CoinChartView;