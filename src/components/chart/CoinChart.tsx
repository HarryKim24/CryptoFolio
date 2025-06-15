"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CandleType, GetCandlesOptions } from "@/types/upbitCandle";
import CoinCandle from "./CoinCandle";
import useCandles from "@/hooks/useCandles";

type Props = {
  market: string;
};

const minuteUnits = [1, 3, 5, 10, 15, 30, 60, 240] as const;

const candleTypeLabels: Record<CandleType, string> = {
  seconds: "초봉",
  minutes: "분봉",
  days: "일봉",
  weeks: "주봉",
  months: "월봉",
  years: "년봉",
};

const SIDE_PADDING = 16;

const CoinChart = ({ market }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>("days");
  const [unit, setUnit] = useState<number>(1);
  const [chartHeight, setChartHeight] = useState<number>(400);
  const [chartWidth, setChartWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo<GetCandlesOptions>(() => ({
    market,
    candleType,
    unit: candleType === "minutes" ? unit : undefined,
    count: 200,
  }), [market, candleType, unit]);

  const { data, loading } = useCandles(options);

  const prices = data.flatMap((d) => [d.high, d.low]);
  const max = Math.max(...prices);
  const min = Math.min(...prices);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setChartHeight(entry.contentRect.height);
      setChartWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const usableWidth = chartWidth - SIDE_PADDING * 2;
  const barWidth = data.length > 0 ? usableWidth / data.length : 4;

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <div className="flex flex-wrap justify-end gap-1 mb-4 px-4">
        {Object.entries(candleTypeLabels).map(([type, label]) => (
          <button
            key={type}
            className={`px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm border ${
              candleType === type ? "bg-white text-black" : "text-white border-white/20"
            }`}
            onClick={() => setCandleType(type as CandleType)}
          >
            {label}
          </button>
        ))}
      </div>

      {candleType === "minutes" && (
        <div className="flex flex-wrap justify-end gap-1 mb-2 px-4">
          {minuteUnits.map((u) => (
            <button
              key={u}
              className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded text-xs md:text-sm border ${
                unit === u ? "bg-white text-black" : "text-white border-white/20"
              }`}
              onClick={() => setUnit(u)}
            >
              {u}분
            </button>
          ))}
        </div>
      )}

      <div
        className="flex-1 relative overflow-hidden rounded-xl shadow-md"
        ref={containerRef}
        style={{
          margin: "16px",
          backgroundColor: "#0f172a",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full p-4">
            <div className="w-6 h-6 border-2 border-t-transparent border-white/20 rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-neutral-400 text-center">차트 데이터 없음</div>
        ) : (
          <div
            className="absolute bottom-0 left-0 flex h-full"
            style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING }}
          >
            {data.map((d) => (
              <CoinCandle
                key={d.date.toISOString()}
                open={d.open}
                close={d.close}
                high={d.high}
                low={d.low}
                max={max}
                min={min}
                chartHeight={chartHeight}
                candleType={candleType}
                barWidth={barWidth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinChart;