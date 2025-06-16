export interface Ticker {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: "RISE" | "FALL" | "EVEN";
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

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

export type CandleType = "minutes" | "days" | "weeks" | "months" | "years";

export interface GetCandlesOptions {
  market: string;
  candleType: CandleType;
  unit?: number;
  to?: string;
  count?: number;
}

export interface CautionFlags {
  PRICE_FLUCTUATIONS: boolean;
  TRADING_VOLUME_SOARING: boolean;
  DEPOSIT_AMOUNT_SOARING: boolean;
  GLOBAL_PRICE_DIFFERENCES: boolean;
  CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
}

export interface Market {
  market: string;
  korean_name: string;
  english_name: string;
  market_event?: MarketEvent;
}

export interface MarketEvent {
  warning: boolean;
  caution: CautionFlags;
}

export interface MarketInfo {
  market: string;
  korean_name: string;
  english_name: string;
  market_event?: MarketEvent;
}