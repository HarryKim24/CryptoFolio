"use client";

import type { CandleType } from "@/types/upbitCandle";

type Props = {
  open: number;
  close: number;
  high: number;
  low: number;
  max: number;
  min: number;
  chartHeight: number;
  candleType: CandleType;
  barWidth: number;
};

const CoinCandle = ({
  open,
  close,
  high,
  low,
  max,
  min,
  chartHeight,
  barWidth,
}: Props) => {
  const priceRange = max - min || 1;
  const scale = chartHeight / priceRange;

  const yHigh = chartHeight - (high - min) * scale;
  const yLow = chartHeight - (low - min) * scale;
  const yOpen = chartHeight - (open - min) * scale;
  const yClose = chartHeight - (close - min) * scale;

  const wickHeight = Math.max(1, yLow - yHigh);
  const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));
  const bodyTop = Math.min(yOpen, yClose);

  const isUp = close >= open;
  const color = isUp ? "#ef4444" : "#3b82f6";

  return (
    <div className="relative" style={{ width: `${barWidth}px`, height: chartHeight }}>
      <div
        style={{
          position: "absolute",
          top: Math.round(yHigh),
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: Math.round(wickHeight),
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: Math.round(bodyTop),
          left: 0,
          right: 0,
          margin: "0 auto",
          height: Math.round(bodyHeight),
          width: "100%",
          backgroundColor: color,
          borderRadius: "2px",
        }}
        title={`O: ${open}, H: ${high}, L: ${low}, C: ${close}`}
      />
    </div>
  );
};

export default CoinCandle;