import { getUpbitCandles } from '@/api/upbitCandle';
import {
  CandleType,
  GetCandlesOptions,
  NormalizedCandle,
  upbitCandle,
} from '@/types/upbitTypes';

const normalizeCandles = (candles: upbitCandle[]): NormalizedCandle[] => {
  return candles.map((candle) => {
    const date = new Date(candle.candle_date_time_kst);
    const open = candle.opening_price;
    const high = candle.high_price;
    const low = candle.low_price;
    const close = candle.trade_price;
    const volume = candle.candle_acc_trade_volume;

    const normalizedCandle: NormalizedCandle = {
      date,
      open,
      high,
      low,
      close,
      volume,
    };

    return normalizedCandle;
  });
};

const MAX_CANDLE_COUNTS: Record<CandleType, number> = {
  minutes: 400,
  days: 800,
  weeks: 400,
  months: 400,
  years: 400,
};

const fetchNormalizedCandles = async (
  options: GetCandlesOptions,
  signal?: AbortSignal
): Promise<NormalizedCandle[]> => {
  const now = new Date();
  const nowTime = now.getTime();
  const paddedTime = nowTime + 2 * 60 * 1000;
  const paddedTo = new Date(paddedTime).toISOString();

  const safeOptions = options || {};
  const candleType = safeOptions.candleType;
  const baseCount = safeOptions.count ?? 100;
  const to = safeOptions.to ?? paddedTo;

  const restOptions = { ...safeOptions };
  delete (restOptions as Partial<GetCandlesOptions>).candleType;
  delete (restOptions as Partial<GetCandlesOptions>).count;
  delete (restOptions as Partial<GetCandlesOptions>).to;

  const maxCount = MAX_CANDLE_COUNTS[candleType];
  const totalCount = Math.min(baseCount, maxCount);

  const allCandles: upbitCandle[] = [];
  let remaining = totalCount;
  let nextTo = to;

  while (remaining > 0) {
    if (signal && signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const batchCount = Math.min(400, remaining);

    const batch = await getUpbitCandles(
      {
        ...restOptions,
        candleType,
        count: batchCount,
        to: nextTo,
      },
      signal
    );

    if (batch.length === 0) {
      break;
    }

    allCandles.push(...batch);
    remaining = remaining - batch.length;

    const lastCandle = batch[batch.length - 1];
    const lastTime = lastCandle.candle_date_time_utc;
    nextTo = lastTime;

    if (remaining > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }
  }

  const normalized = normalizeCandles(allCandles).sort((a, b) => {
    const timeA = a.date.getTime();
    const timeB = b.date.getTime();
    return timeA - timeB;
  });

  const seenTimes = new Set<number>();
  const deduplicated: NormalizedCandle[] = [];

  for (const candle of normalized) {
    const time = candle.date.getTime();

    if (seenTimes.has(time)) {
      continue;
    }

    seenTimes.add(time);
    deduplicated.push(candle);
  }

  return deduplicated;
};

export { normalizeCandles, fetchNormalizedCandles };