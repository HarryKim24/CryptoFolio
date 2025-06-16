'use client';

import { Chart } from 'react-chartjs-2';
import { ChartOptions, ChartDataset } from 'chart.js';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CandleType, GetCandlesOptions, NormalizedCandle } from '@/types/upbitCandle';
import useCandles from '@/hooks/useCandles';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import '@/lib/chart';

type Props = { market: string };

type CandlestickData = {
  x: number | string | Date;
  o: number;
  h: number;
  l: number;
  c: number;
};

const candleTypeLabels: Record<CandleType, string> = {
  seconds: '초봉',
  minutes: '분봉',
  days: '일봉',
  weeks: '주봉',
  months: '월봉',
  years: '년봉',
};

const minuteUnits = [1, 3, 5, 10, 15, 30, 60, 240] as const;

const getTimeUnitFromRange = (
  data: NormalizedCandle[]
): 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' => {
  if (data.length < 2) return 'minute';

  const start = data[0].date.getTime();
  const end = data[data.length - 1].date.getTime();
  const diffMinutes = (end - start) / (1000 * 60);

  if (diffMinutes < 5) return 'second';
  if (diffMinutes < 60) return 'minute';
  if (diffMinutes < 60 * 24 * 2) return 'hour';
  if (diffMinutes < 60 * 24 * 60) return 'day';
  if (diffMinutes < 60 * 24 * 180) return 'week';
  if (diffMinutes < 60 * 24 * 365 * 2) return 'month';
  return 'year';
};

const CoinChart = ({ market }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>('days');
  const [unit, setUnit] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const [chartKey, setChartKey] = useState(0);

  const options = useMemo<GetCandlesOptions>(() => ({
    market,
    candleType,
    unit: candleType === 'minutes' ? unit : candleType === 'seconds' ? 1 : undefined,
    count: 200,
  }), [market, candleType, unit]);

  const { data, loading } = useCandles(options);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
      setChartKey((prev) => prev + 1);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    const mapped: CandlestickData[] = data.map((d: NormalizedCandle) => ({
      x: d.date,
      o: d.open,
      h: d.high,
      l: d.low,
      c: d.close,
    }));

    const barThickness =
      data.length > 0 && dimensions.width > 0
        ? Math.max(2, Math.floor((dimensions.width / data.length) * 0.6))
        : 4;

    const dataset = {
      label: `${market} 가격`,
      data: mapped,
      color: {
        up: '#ef4444',
        down: '#3b82f6',
        unchanged: '#999',
      },
      barThickness,
    } as unknown as ChartDataset<'candlestick', CandlestickData[]>;

    return { datasets: [dataset] };
  }, [data, market, dimensions]);

  const chartOptions: ChartOptions<'candlestick'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: getTimeUnitFromRange(data),
        },
        ticks: { source: 'auto', padding: 8 },
      },
      y: {
        beginAtZero: false,
        position: 'right',
        ticks: {
          padding: 8,
          callback: (value) => {
            const isBTCMarket = market.startsWith('BTC');
            return Number(value).toLocaleString('en-US', {
              minimumFractionDigits: isBTCMarket ? 2 : 0,
              maximumFractionDigits: isBTCMarket ? 8 : 0,
            });
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        backgroundColor: '#111827',
        titleFont: { weight: 'bold' },
        bodyFont: { weight: 'normal' },
        padding: 8,
        callbacks: {
          title: (ctx) => {
            const raw = ctx[0].raw as CandlestickData;
            return format(new Date(raw.x), 'yyyy년 M월 d일 HH:mm:ss');
          },
          label: (ctx) => {
            const raw = ctx.raw as CandlestickData;
            return [
              `시가: ${raw.o.toLocaleString()}`,
              `고가: ${raw.h.toLocaleString()}`,
              `저가: ${raw.l.toLocaleString()}`,
              `종가: ${raw.c.toLocaleString()}`
            ];
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <div className="flex flex-wrap justify-end gap-1 mb-4 px-4">
        {Object.entries(candleTypeLabels).map(([type, label]) => (
          <button
            key={type}
            className={`px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm border ${
              candleType === type ? 'bg-white text-black' : 'text-white border-white/20'
            }`}
            onClick={() => setCandleType(type as CandleType)}
          >
            {label}
          </button>
        ))}
      </div>

      {candleType === 'minutes' && (
        <div className="flex flex-wrap justify-end gap-1 mb-2 px-4">
          {minuteUnits.map((u) => (
            <button
              key={u}
              className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded text-xs md:text-sm border ${
                unit === u ? 'bg-white text-black' : 'text-white border-white/20'
              }`}
              onClick={() => setUnit(u)}
            >
              {u}분
            </button>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 relative rounded-xl shadow-md m-4 bg-slate-900"
        style={{
          height: '100%',
          minHeight: '300px',
        }}
      >
        {loading || data.length === 0 ? (
          <div className="flex justify-center items-center h-full p-4">
            <div className="w-6 h-6 border-2 border-t-transparent border-white/20 rounded-full animate-spin" />
          </div>
        ) : (
          <Chart
            key={chartKey}
            type="candlestick"
            data={chartData}
            options={chartOptions}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </div>
    </div>
  );
};

export default CoinChart;