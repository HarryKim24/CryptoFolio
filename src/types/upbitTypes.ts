export interface upbitCandle {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  first_day_of_period: string;
}

export interface NormalizedCandle {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type CandleType = 'minutes' | 'days' | 'weeks' | 'months' | 'years';

export interface GetCandlesOptions {
  market: string;
  candleType: CandleType;
  unit?: number;
  to?: string;
  count?: number;
}