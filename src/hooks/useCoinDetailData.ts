import { useMemo } from "react";
import { useUpbitTickerStore } from "@/stores/upbitTickerStore";
import { Market, Ticker } from "@/types/upbitTypes";

const formatPrice = (value: number, activeTab: "KRW" | "BTC" | "USDT"): string => {
  if (activeTab === "KRW") return `${value.toLocaleString()} 원`;
  if (activeTab === "BTC") return `${value.toFixed(8)} BTC`;
  return value >= 1000 ? `$${Math.round(value).toLocaleString()}` : `$${value.toFixed(3)}`;
};

const formatVolume = (value: number, activeTab: "KRW" | "BTC" | "USDT"): string => {
  if (activeTab === "KRW") {
    return `${Math.floor(value / 10000000).toLocaleString()}백만`;
  }
  if (activeTab === "BTC") return `${value.toFixed(6)} BTC`;
  return value >= 1000 ? `$${Math.round(value).toLocaleString()}` : `$${value.toFixed(4)}`;
};

export type CoinDetailData = {
  marketInfo: Market | undefined;
  ticker: Ticker | undefined;
  activeTab: "KRW" | "BTC" | "USDT";
  coinSymbol: string;
  formattedPrice: string;
  formattedChange: string;
  formattedVolume: string;
  changeRate: number;
  rateColor: string;
};

export const useCoinDetailData = (market: string): CoinDetailData => {
  const tickers = useUpbitTickerStore((s) => s.tickers);
  const markets = useUpbitTickerStore((s) => s.markets);

  const ticker = tickers[market];

  return useMemo(() => {
    const marketInfo = markets.find((m: Market) => m.market === market);

    const [prefix, symbol] = market.split("-");
    const activeTab = prefix as "KRW" | "BTC" | "USDT";
    const validMarkets = ["KRW", "BTC", "USDT"] as const;

    const coinSymbol = validMarkets.includes(activeTab) ? symbol ?? "N/A" : "N/A";

    const price = ticker?.trade_price ?? 0;
    const changeRate = ticker?.signed_change_rate ?? 0;
    const change = ticker?.signed_change_price ?? 0;
    const volume24h = ticker?.acc_trade_price_24h ?? 0;

    const rateColor =
      changeRate > 0 ? "text-red-400" : changeRate < 0 ? "text-blue-400" : "text-gray-300";

    return {
      marketInfo,
      ticker,
      activeTab,
      coinSymbol,
      formattedPrice: formatPrice(price, activeTab),
      formattedChange: formatPrice(change, activeTab),
      formattedVolume: formatVolume(volume24h, activeTab),
      changeRate,
      rateColor,
    };
  }, [market, ticker, markets]);
};