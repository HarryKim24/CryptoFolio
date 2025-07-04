'use client';

import { Chart } from 'react-chartjs-2';
import {
  ChartOptions,
  ChartDataset,
  ChartData,
  Chart as ChartJS,
  registerables,
} from 'chart.js';
import { useMemo, useRef, useState, useEffect } from 'react';
import {
  CandleType,
  GetCandlesOptions,
  NormalizedCandle,
} from '@/types/upbitCandle';
import useCandles from '@/hooks/useCandles';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import '@/lib/chart';


ChartJS.register(...registerables);

type Props = {
  market: string;
  disableZoom?: boolean;
};

type CandlestickData = {
  x: number | string | Date;
  o: number;
  h: number;
  l: number;
  c: number;
};

type VolumeData = {
  x: Date;
  y: number;
};

interface CandlestickDataset
  extends ChartDataset<'candlestick', CandlestickData[]> {
  color: {
    up: string;
    down: string;
    unchanged: string;
  };
}

const candleTypeLabels: Record<CandleType, string> = {
  minutes: '분',
  days: '일',
  weeks: '주',
  months: '월',
  years: '년',
};

const minuteUnits = [1, 3, 5, 10, 15, 30, 60, 240] as const;

const getTimeUnitFromRange = (
  data: NormalizedCandle[]
): 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' => {
  if (data.length < 2) return 'minute';
  const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
  const start = sorted[0].date.getTime();
  const end = sorted[sorted.length - 1].date.getTime();
  const diffMinutes = Math.abs(end - start) / (1000 * 60);

  if (diffMinutes < 60) return 'minute';
  if (diffMinutes < 60 * 24 * 2) return 'hour';
  if (diffMinutes < 60 * 24 * 60) return 'day';
  if (diffMinutes < 60 * 24 * 180) return 'week';
  if (diffMinutes < 60 * 24 * 365 * 2) return 'month';
  return 'year';
};

const CoinChart = ({ market, disableZoom = false }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>('days');
  const [unit, setUnit] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  const count = candleType === 'days' ? 800 : 400;

  const options = useMemo<GetCandlesOptions>(
    () => ({
      market,
      candleType,
      unit: candleType === 'minutes' ? unit : undefined,
      count,
    }),
    [market, candleType, unit, count]
  );

  const { data, loading } = useCandles(options);

  useEffect(() => {
    import('chartjs-plugin-zoom').then((module) => {
      const zoomPlugin = module.default;
      ChartJS.register(zoomPlugin);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions((prev) =>
        prev.width !== width || prev.height !== height
          ? { width, height }
          : prev
      );
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const mapped = useMemo<CandlestickData[]>(
    () =>
      data.map((d) => ({
        x: d.date,
        o: d.open,
        h: d.high,
        l: d.low,
        c: d.close,
      })),
    [data]
  );

  const volumeData = useMemo<VolumeData[]>(
    () =>
      data.map((d) => ({
        x: d.date,
        y: d.volume,
      })),
    [data]
  );

  const barThickness = useMemo(() => {
    const baseRatio = candleType === 'days' ? 0.4 : 0.6;
    return data.length > 0 && dimensions.width > 0
      ? Math.max(2, Math.floor((dimensions.width / data.length) * baseRatio))
      : 4;
  }, [data, dimensions, candleType]);

  const volumeMax = useMemo(() => {
    if (volumeData.length === 0) return undefined;
    const max = Math.max(...volumeData.map((v) => v.y));
    return Math.ceil(max * 5);
  }, [volumeData]);

  const chartData = useMemo<
    ChartData<'bar' | 'candlestick', (CandlestickData | VolumeData)[]>
  >(() => {
    const candlestickDataset: CandlestickDataset = {
      type: 'candlestick',
      label: `${market} 가격`,
      data: mapped,
      color: {
        up: '#ef4444',
        down: '#3b82f6',
        unchanged: '#999',
      },
      barThickness,
    };

    const volumeDataset: ChartDataset<'bar', VolumeData[]> = {
      type: 'bar',
      label: '거래량',
      data: volumeData,
      yAxisID: 'volume',
      backgroundColor: 'rgba(255,255,255,0.2)',
      barThickness: Math.floor(barThickness * 0.8),
    };

    return {
      datasets: [candlestickDataset, volumeDataset],
    };
  }, [mapped, volumeData, market, barThickness]);

  const isBTCMarket = market.startsWith('BTC');

  const minDate = data.length > 0 ? new Date(data[0].date) : undefined;
  const maxDate = data.length > 0 ? new Date(data[data.length - 1].date) : undefined;
  const bufferMs = 1000 * 60 * 60 * 24 * 180;
  const expandedMin =
    candleType === 'years' && minDate ? minDate.getTime() - bufferMs : undefined;
  const expandedMax =
    candleType === 'years' && maxDate ? maxDate.getTime() + bufferMs : undefined;

  const timeUnit = useMemo(() => getTimeUnitFromRange(data), [data]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartOptions: ChartOptions<'candlestick' | 'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 8, right: 8 } },
      scales: {
        x: {
          type: 'time',
          offset: false,
          time: {
            unit: candleType === 'days' ? 'day' : timeUnit,
            displayFormats: {
              minute: 'HH:mm',
              hour: 'HH:mm',
              day: 'yyyy-MM-dd',
              month: 'yyyy-MM',
              year: 'yyyy',
            },
            tooltipFormat: 'yyyy-MM-dd HH:mm',
          },
          grid: { display: true, color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            source: 'auto',
            padding: 4,
            autoSkip: true,
            maxRotation: 0,
            maxTicksLimit: 20,
          },
          min: expandedMin,
          max: expandedMax,
        },
        y: {
          position: 'right',
          grid: { display: true, color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            padding: 8,
            callback: (value) =>
              Number(value).toLocaleString('en-US', {
                minimumFractionDigits: isBTCMarket ? 2 : 0,
                maximumFractionDigits: isBTCMarket ? 8 : 0,
              }),
          },
        },
        volume: {
          position: 'left',
          display: true,
          weight: 0.05,
          max: volumeMax,
          beginAtZero: true,
          grid: {
            display: true,
            drawOnChartArea: false,
            color: 'rgba(255,255,255,0.05)',
          },
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: '#111827',
          titleFont: { 
            weight: 'bold',
            size: isMobile ? 7 : 14,
          },
          bodyFont: { 
            weight: 'normal',
            size: isMobile ? 6 : 12,
          },
          padding: isMobile ? 4 : 8,
          callbacks: {
            title: (ctx) => {
              const raw = ctx[0].raw as CandlestickData;
              return format(new Date(raw.x), 'yyyy년 M월 d일 HH:mm:ss');
            },
            label: (ctx) => {
              if (ctx.dataset.type === 'bar') {
                const raw = ctx.raw as VolumeData;
                return `거래량: ${raw.y.toLocaleString()}`;
              }
              const raw = ctx.raw as CandlestickData;
              return [
                `시가: ${raw.o.toLocaleString()}`,
                `고가: ${raw.h.toLocaleString()}`,
                `저가: ${raw.l.toLocaleString()}`,
                `종가: ${raw.c.toLocaleString()}`,
              ];
            },
          },
        },
        ...(disableZoom
          ? {}
          : {
              zoom: {
                pan: { enabled: true, mode: 'x' },
                zoom: {
                  wheel: { enabled: true },
                  pinch: { enabled: true },
                  mode: 'x',
                },
              },
            }),
      },
    }),
    [isMobile, timeUnit, expandedMin, expandedMax, isBTCMarket, candleType, volumeMax, disableZoom]
  );

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <div className="flex flex-wrap justify-end gap-1 mb-4 px-4">
        {Object.entries(candleTypeLabels).map(([type, label]) => (
          <button
            key={type}
            className={`px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm border ${
              candleType === type
                ? 'bg-white text-black'
                : 'text-white border-white/20'
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
                unit === u
                  ? 'bg-white text-black'
                  : 'text-white border-white/20'
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
        style={{ height: '100%', minHeight: '300px' }}
      >
        {loading || data.length === 0 ? (
          <div className="flex justify-center items-center h-full p-4">
            <div className="w-6 h-6 border-2 border-t-transparent border-white/20 rounded-full animate-spin" />
          </div>
        ) : (
          <Chart
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