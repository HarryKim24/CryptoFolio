'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import useCandles from '@/hooks/useCandles';
import { CandleType, GetCandlesOptions } from '@/types/upbitCandle';
import { ApexOptions } from 'apexcharts';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import { formatNumberForDisplay } from '@/utils/formatNumber';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  market: string;
  disableZoom?: boolean;
};

const CoinChart = ({ market }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>('days');
  const [unit, setUnit] = useState<number>(1);
  const count = 200;

  const options = useMemo<GetCandlesOptions>(
    () => ({
      market,
      candleType,
      unit: candleType === 'minutes' ? unit : undefined,
      count,
    }),
    [market, candleType, unit, count]
  );

  const { data: candles, cache } = useCandles(options);

  const prefetch = (type: CandleType, u?: number) => {
    const key = `${market}_${type}_${type === 'minutes' ? u : 'default'}`;
    if (cache.has(key)) return;

    const prefetchOptions: GetCandlesOptions = {
      market,
      candleType: type,
      unit: type === 'minutes' ? u || 1 : undefined,
      count,
    };

    fetchNormalizedCandles(prefetchOptions).then((res) => {
      cache.set(key, res);
    });
  };

  const ohlc = useMemo(
    () =>
      candles.map((c) => ({
        x: new Date(c.date),
        y: [c.open, c.high, c.low, c.close],
      })),
    [candles]
  );

  const volume = useMemo(
    () =>
      candles.map((c) => ({
        x: new Date(c.date),
        y: c.volume,
      })),
    [candles]
  );

  const candlestickOptions: ApexOptions = {
    chart: {
      id: 'candlestick-chart',
      type: 'candlestick',
      background: '#0b0f19',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      opposite: true,
      tooltip: { enabled: true },
      labels: {
        style: { colors: '#fff' },
        minWidth: 60,
        formatter: (val: number) => String(formatNumberForDisplay(val)),
      },
    },
    grid: {
      borderColor: '#222',
    },
    tooltip: {
      shared: true,
      custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
        const d = candles[dataPointIndex];
        if (!d) return '';
        return `
          <div>
            <strong>${format(d.date, 'yyyy-MM-dd HH:mm')}</strong><br/>
            시가: ${d.open}<br/>
            고가: ${d.high}<br/>
            저가: ${d.low}<br/>
            종가: ${d.close}
          </div>
        `;
      },
    },
    theme: {
      mode: 'dark',
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#3FB68B',
          downward: '#F46A6A',
        },
      },
    },
  };

  const volumeOptions: ApexOptions = {
    chart: {
      id: 'volume-chart',
      type: 'bar',
      background: '#0b0f19',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#ccc' } },
    },
    yaxis: {
      opposite: true,
      show: true,
      labels: {
        style: { colors: '#fff' },
        minWidth: 60,
        formatter: () => '',
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => formatNumberForDisplay(val),
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '75%',
      },
    },
    grid: {
      borderColor: '#222',
    },
    theme: {
      mode: 'dark',
    },
    
  };

  return (
    <div className="flex flex-col h-full w-full px-2 py-2">
      <div className="flex flex-wrap justify-end gap-2 px-2 text-sm mb-2">
        {['minutes', 'days', 'weeks', 'months', 'years'].map((type) => (
          <button
            key={type}
            onClick={() => setCandleType(type as CandleType)}
            onMouseEnter={() => prefetch(type as CandleType, unit)}
            className={`px-3 py-1 border rounded ${
              candleType === type
                ? 'bg-white text-black'
                : 'text-white border-white/20'
            }`}
          >
            {{
              minutes: '분',
              days: '일',
              weeks: '주',
              months: '월',
              years: '년',
            }[type as CandleType]}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-2 px-2 mb-2 min-h-[32px]">
        {candleType === 'minutes' ? (
          [1, 3, 5, 10, 15, 30, 60, 240].map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              onMouseEnter={() => prefetch('minutes', u)}
              className={`px-2 py-1 text-xs border rounded ${
                unit === u
                  ? 'bg-white text-black'
                  : 'text-white border-white/20'
              }`}
            >
              {u}분
            </button>
          ))
        ) : (
          <div className="invisible flex gap-2">
            {[1, 3, 5, 10, 15, 30, 60, 240].map((u) => (
              <button
                key={u}
                className="px-2 py-1 text-xs border rounded border-transparent"
              >
                {u}분
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl shadow">
        <div className="h-[600px] bg-[#0b0f19]">
          <ReactApexChart
            key={`${market}-${candleType}-${unit}-price`}
            options={candlestickOptions}
            series={[{ data: ohlc, name: '가격' }]}
            type="candlestick"
            height="100%"
          />
        </div>
        <div className="h-[120px] bg-[#0b0f19]">
          <ReactApexChart
            key={`${market}-${candleType}-${unit}-volume`}
            options={volumeOptions}
            series={[{ data: volume, name: '거래량' }]}
            type="bar"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default CoinChart;