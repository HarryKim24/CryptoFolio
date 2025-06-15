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
  seconds: 200,
  minutes: 200,
  days: 200,
  weeks: 200,
  months: 200,
  years: 200,
};

export const fetchNormalizedCandles = async (
  options: GetCandlesOptions
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
    const batchCount = Math.min(200, remaining);
    console.log(`📥 요청 ${totalCount}개 중 ${totalCount - remaining + 1}번째: ${batchCount}개 요청 → to: ${nextTo}`);

    const batch = await getUpbitCandles({
      ...rest,
      candleType,
      count: batchCount,
      to: nextTo,
    });

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

  console.log(`✅ 총 수신된 캔들: ${deduplicated.length}개`);

  return deduplicated;
};