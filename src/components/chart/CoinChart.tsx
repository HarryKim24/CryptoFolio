"use client";

import { useMemo, useState } from "react";
import useCandles from "@/hooks/useCandles";
import {
  CandleType,
  GetCandlesOptions,
  NormalizedCandle,
} from "@/types/upbitTypes";
import CoinChartView from "./CoinChartView";

type ChartPoint = { x: Date; y: number | [number, number, number, number] };

type Props = {
  market: string;
};

const CANDLE_TYPES: CandleType[] = [
  "minutes",
  "days",
  "weeks",
  "months",
  "years",
];

const MINUTE_UNITS = [1, 3, 5, 10, 15, 30, 60, 240] as const;

const CANDLE_TYPE_LABELS: Record<CandleType, string> = {
  minutes: "분",
  days: "일",
  weeks: "주",
  months: "월",
  years: "년",
};

const CoinChart = ({ market }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>("days");
  const [unit, setUnit] = useState<number>(1);
  const count = 200;

  const requestOptions = useMemo<GetCandlesOptions>(
    () => ({
      market,
      candleType,
      unit: candleType === "minutes" ? unit : undefined,
      count,
    }),
    [market, candleType, unit]
  );

  const { data: candles = [], loading } = useCandles(requestOptions);

  const [ohlcPoints, volumePoints] = useMemo<[ChartPoint[], ChartPoint[]]>(
    () =>
      (candles as NormalizedCandle[]).reduce<[ChartPoint[], ChartPoint[]]>(
        ([ohlcAccumulator, volumeAccumulator], candle) => {
          const date = new Date(candle.date);

          ohlcAccumulator.push({
            x: date,
            y: [candle.open, candle.high, candle.low, candle.close],
          });

          volumeAccumulator.push({
            x: date,
            y: candle.volume,
          });

          return [ohlcAccumulator, volumeAccumulator];
        },
        [[], []]
      ),
    [candles]
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full px-2 py-2 overflow-hidden">
      <div className="flex flex-wrap justify-end gap-2 px-2 text-sm mb-2">
        {CANDLE_TYPES.map((typeOption) => (
          <button
            key={typeOption}
            onClick={() => setCandleType(typeOption)}
            className={`px-3 py-1 border rounded ${
              candleType === typeOption
                ? "bg-white text-black"
                : "text-white border-white/20"
            }`}
          >
            {CANDLE_TYPE_LABELS[typeOption]}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-2 px-2 mb-2 min-h-[32px]">
        {candleType === "minutes" ? (
          MINUTE_UNITS.map((minuteUnit) => (
            <button
              key={minuteUnit}
              onClick={() => setUnit(minuteUnit)}
              className={`px-2 py-1 text-xs border rounded ${
                unit === minuteUnit
                  ? "bg-white text-black"
                  : "text-white border-white/20"
              }`}
            >
              {minuteUnit}분
            </button>
          ))
        ) : (
          <div className="invisible flex gap-2">
            <button className="px-2 py-1 text-xs border border-transparent">
              1분
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 relative min-h-0 w-full">
        {(loading || candles.length === 0) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b0f19]/50 backdrop-blur-[1px]">
            <span className="text-neutral-300">차트 로딩 중...</span>
          </div>
        )}

        <div className="absolute inset-0">
          <CoinChartView
            market={market}
            candles={candles as NormalizedCandle[]}
            ohlc={ohlcPoints}
            volume={volumePoints}
            candleType={candleType}
            unit={unit}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinChart;