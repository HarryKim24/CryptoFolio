import { getUpbitCandles } from '@/api/upbitCandle';
import {
  GetCandlesOptions,
  NormalizedCandle,
  upbitCandle,
} from '@/types/upbitTypes';

const normalizeCandles = (candles: upbitCandle[]): NormalizedCandle[] => {
  return candles.map((candle) => {
    const date = new Date(candle.candle_date_time_kst);
    
    return {
      date,
      open: candle.opening_price,
      high: candle.high_price,
      low: candle.low_price,
      close: candle.trade_price,
      volume: candle.candle_acc_trade_volume,
    };
  });
};

const fetchNormalizedCandles = async (
  options: GetCandlesOptions
): Promise<NormalizedCandle[]> => {
  const count = options.count ?? 200;

  const rawCandles = await getUpbitCandles({
    ...options,
    count, 
  });

  const normalized = normalizeCandles(rawCandles);

  normalized.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return normalized;
};

export { normalizeCandles, fetchNormalizedCandles };