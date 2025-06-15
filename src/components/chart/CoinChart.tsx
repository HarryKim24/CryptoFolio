"use client";

import { NormalizedCandle } from "@/types/upbitCandle";
import CoinCandle from "./CoinCandle";

type Props = {
  data: NormalizedCandle[];
};

const CoinChart = ({ data }: Props) => {
  if (data.length === 0) return <div className="text-neutral-400">차트 데이터 없음</div>;

  const prices = data.flatMap((d) => [d.high, d.low]);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const chartHeight = 300;

  return (
    <div className="flex gap-[2px] items-end h-[300px] overflow-x-auto px-2">
      {data.map((d, i) => (
        <CoinCandle
          key={i}
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