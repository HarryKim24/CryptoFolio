'use client';

import React, { useCallback, useMemo, useState } from 'react';
import useCandles from '@/hooks/useCandles';
import { CandleType, GetCandlesOptions, NormalizedCandle } from '@/types/upbitTypes';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import CoinChartView from './CoinChartView';

type ChartPoint = { x: Date; y: number | [number, number, number, number] };

type Props = {
  market: string;
  disableZoom?: boolean;
};

const CANDLE_TYPES: CandleType[] = ['minutes', 'days', 'weeks', 'months', 'years'];
const MINUTE_UNITS = [1, 3, 5, 10, 15, 30, 60, 240] as const;

const CoinChart = ({ market, disableZoom = false }: Props) => {
  const [candleType, setCandleType] = useState<CandleType>('days');
  const [unit, setUnit] = useState<number>(1);
  const count = 200;

  const requestOptions = useMemo<GetCandlesOptions>(
    () => ({
      market,
      candleType,
      unit: candleType === 'minutes' ? unit : undefined,
      count,
    }),
    [market, candleType, unit]
  );

  const { data: candles = [], cache } = useCandles(requestOptions);

  const prefetch = useCallback(
    (type: CandleType, u?: number) => {
      const key = `${market}_${type}_${type === 'minutes' ? u ?? 1 : 'default'}`;
      if (cache.has(key)) return;

      const prefetchOptions: GetCandlesOptions = {
        market,
        candleType: type,
        unit: type === 'minutes' ? u ?? 1 : undefined,
        count,
      };

      fetchNormalizedCandles(prefetchOptions).then((res) => {
        cache.set(key, res);
      });
    },
    [market, cache]
  );

  const [ohlc, volume] = useMemo<[ChartPoint[], ChartPoint[]]>(() => {
    return (candles as NormalizedCandle[]).reduce<[ChartPoint[], ChartPoint[]]>(
      ([ohlcAcc, volumeAcc], c) => {
        const date = new Date(c.date);
        ohlcAcc.push({ x: date, y: [c.open, c.high, c.low, c.close] });
        volumeAcc.push({ x: date, y: c.volume });
        return [ohlcAcc, volumeAcc];
      },
      [[], []]
    );
  }, [candles]);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full px-2 py-2 overflow-hidden">
      <div className="flex flex-wrap justify-end gap-2 px-2 text-sm mb-2">
        {CANDLE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setCandleType(type)}
            onMouseEnter={() => prefetch(type, unit)}
            className={`px-3 py-1 border rounded ${
              candleType === type ? 'bg-white text-black' : 'text-white border-white/20'
            }`}
          >
            {{ minutes: '분', days: '일', weeks: '주', months: '월', years: '년' }[type]}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-2 px-2 mb-2 min-h-[32px]">
        {candleType === 'minutes' ? (
          MINUTE_UNITS.map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              onMouseEnter={() => prefetch('minutes', u)}
              className={`px-2 py-1 text-xs border rounded ${
                unit === u ? 'bg-white text-black' : 'text-white border-white/20'
              }`}
            >
              {u}분
            </button>
          ))
        ) : (
          <div className="invisible flex gap-2">
            {MINUTE_UNITS.map((u) => (
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

      <CoinChartView
        market={market}
        candles={candles as NormalizedCandle[]}
        ohlc={ohlc}
        volume={volume}
        candleType={candleType}
        unit={unit}
        disableZoom={disableZoom}
      />
    </div>
  );
};

export default CoinChart;