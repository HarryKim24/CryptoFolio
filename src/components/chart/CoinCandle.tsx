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

  const topPrice = Math.max(open, close);
  const bottomPrice = Math.min(open, close);

  const highToTop = ((max - high) / priceRange) * chartHeight;
  const lowToBottom = ((max - low) / priceRange) * chartHeight;
  const openToTop = ((max - topPrice) / priceRange) * chartHeight;
  const closeToBottom = ((max - bottomPrice) / priceRange) * chartHeight;

  const bodyHeight = Math.max(1, closeToBottom - openToTop);
  const wickHeight = Math.max(1, lowToBottom - highToTop);

  const isUp = close >= open;
  const color = isUp ? "#ef4444" : "#3b82f6";

  return (
    <div style={{ position: "relative", width: "6px", height: `${chartHeight}px` }}>
      <div
        style={{
          position: "absolute",
          top: `${highToTop}px`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: `${wickHeight}px`,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${openToTop}px`,
          left: 0,
          right: 0,
          margin: "0 auto",
          height: `${bodyHeight}px`,
          backgroundColor: color,
          borderRadius: "2px",
          width: "100%",
        }}
        title={`O: ${open}, H: ${high}, L: ${low}, C: ${close}`}
      />
    </div>
  );
};

export default CoinCandle;