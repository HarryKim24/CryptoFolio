import { getUpbitCandles } from "@/api/upbitCandle";
import type { CandleType, GetCandlesOptions, NormalizedCandle, upbitCandle } from "@/types/upbitCandle";

const normalizeCandles = (candles: upbitCandle[]): NormalizedCandle[] =>
  candles.map((candle) => ({
    date: new Date(candle.candle_date_time_kst),
    open: candle.opening_price,
    high: candle.high_price,
    low: candle.low_price,
    close: candle.trade_price,
    volume: candle.candle_acc_trade_volume,
  }));

const MAX_CANDLE_COUNTS: Record<CandleType, number> = {
  minutes: 400,
  days: 800,
  weeks: 400,
  months: 400,
  years: 400,
};

export const fetchNormalizedCandles = async (
  options: GetCandlesOptions,
  signal?: AbortSignal
): Promise<NormalizedCandle[]> => {
  const now = new Date();
  const paddedTo = new Date(now.getTime() + 2 * 60 * 1000).toISOString();
  const { to = paddedTo, candleType, count = 100, ...rest } = options;

  const maxCount = MAX_CANDLE_COUNTS[candleType];
  const totalCount = Math.min(count, maxCount);

  const allCandles: upbitCandle[] = [];
  let remaining = totalCount;
  let nextTo = to;

  while (remaining > 0) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const batchCount = Math.min(400, remaining);

    const batch = await getUpbitCandles(
      {
        ...rest,
        candleType,
        count: batchCount,
        to: nextTo,
      },
      signal
    );

    if (!batch.length) break;

    allCandles.push(...batch);
    remaining -= batch.length;
    nextTo = batch[batch.length - 1].candle_date_time_utc;

    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const normalized = normalizeCandles(allCandles).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const deduplicated = normalized.filter(
    (candle, index, self) =>
      index === self.findIndex((t) => t.date.getTime() === candle.date.getTime())
  );

  return deduplicated;
};