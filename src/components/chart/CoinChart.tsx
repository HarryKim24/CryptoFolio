"use client";

import { useState, useMemo } from "react";
import { CandleType, GetCandlesOptions } from "@/types/upbitCandle";
import CoinCandle from "./CoinCandle";
import useCandles from "@/hooks/useCandles";

type Props = {
  market: string;
  chartHeight?: number;
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

const CoinChart = ({ market, chartHeight = 300 }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>("minutes");
  const [unit, setUnit] = useState<number>(1);

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

  return (
    <div className="w-full h-full">
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {Object.entries(candleTypeLabels).map(([type, label]) => (
          <button
            key={type}
            className={`px-2 py-1 rounded text-sm border ${
              candleType === type ? "bg-white text-black" : "text-white border-white/20"
            }`}
            onClick={() => setCandleType(type as CandleType)}
          >
            {label}
          </button>
        ))}
      </div>

      {candleType === "minutes" && (
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {minuteUnits.map((u) => (
            <button
              key={u}
              className={`px-2 py-1 rounded text-xs border ${
                unit === u ? "bg-white text-black" : "text-white border-white/20"
              }`}
              onClick={() => setUnit(u)}
            >
              {u}분
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-neutral-400 text-center">차트 로딩 중...</div>
      ) : data.length === 0 ? (
        <div className="text-neutral-400 text-center">차트 데이터 없음</div>
      ) : (
        <div className="flex gap-[2px] items-end overflow-x-auto px-2" style={{ height: chartHeight }}>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinChart;