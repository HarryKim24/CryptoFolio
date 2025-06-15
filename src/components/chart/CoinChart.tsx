"use client";

import { NormalizedCandle } from "@/types/upbitCandle";
import CoinCandle from "./CoinCandle";

type Props = {
  data: NormalizedCandle[];
  chartHeight?: number;
};

const CoinChart = ({ data, chartHeight = 300 }: Props) => {
  if (data.length === 0) return <div className="text-neutral-400">차트 데이터 없음</div>;

  const prices = data.flatMap((d) => [d.high, d.low]);
  const max = Math.max(...prices);
  const min = Math.min(...prices);

  return (
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
  );
};


export default CoinChart;