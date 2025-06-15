"use client";

type Props = {
  open: number;
  close: number;
  high: number;
  low: number;
  max: number;
  min: number;
  chartHeight: number;
};

const CoinCandle = ({ open, close, high, low, max, min, chartHeight }: Props) => {
  const priceRange = max - min || 1;

  const top = Math.max(open, close);
  const bottom = Math.min(open, close);

  const highToTop = ((max - high) / priceRange) * chartHeight;
  const lowToBottom = ((max - low) / priceRange) * chartHeight;
  const openToTop = ((max - top) / priceRange) * chartHeight;
  const closeToBottom = ((max - bottom) / priceRange) * chartHeight;

  const bodyHeight = Math.max(1, closeToBottom - openToTop);
  const wickHeight = Math.max(1, lowToBottom - highToTop);

  const isUp = close >= open;
  const color = isUp ? "#ef4444" : "#3b82f6";

  return (
    <div className="relative" style={{ width: "6px", height: chartHeight }}>
      <div
        style={{
          position: "absolute",
          top: highToTop,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: wickHeight,
          backgroundColor: color,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: openToTop,
          left: 0,
          right: 0,
          margin: "0 auto",
          height: bodyHeight,
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