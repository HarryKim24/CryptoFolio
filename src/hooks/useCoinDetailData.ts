import { useUpbitTickerStore } from "@/stores/upbitTickerStore";
import { Market, Ticker } from "@/types/upbitTypes";

const formatPrice = (value: number, activeTab: "KRW" | "BTC" | "USDT"): string => {
  if (activeTab === "KRW") return `${value.toLocaleString()} 원`;
  if (activeTab === "BTC") return `${value.toFixed(8)} BTC`;
  return value >= 1000 ? `$${Math.round(value).toLocaleString()}` : `$${value.toFixed(3)}`;
};

const formatVolume = (value: number, activeTab: "KRW" | "BTC" | "USDT"): string => {
  if (activeTab === "KRW") {
    return `${Math.floor(value / 100000000).toLocaleString()}억`;
  }
  if (activeTab === "BTC") return `${value.toFixed(6)} BTC`;
  return value >= 1000 ? `$${Math.round(value).toLocaleString()}` : `$${value.toFixed(4)}`;
};

const normalizeTab = (prefix: string | undefined): "KRW" | "BTC" | "USDT" => {
  if (prefix === "BTC") return "BTC";
  if (prefix === "USDT") return "USDT";
  return "KRW";
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
  const tickers = useUpbitTickerStore((state) => state.tickers);
  const markets = useUpbitTickerStore((state) => state.markets);

  const ticker = tickers.find((t) => t.market === market);
  const marketInfo = markets.find((item) => item.market === market);

  const parts = market.split("-");
  const marketPrefix = parts[0];
  const symbol = parts[1];

  const activeTab = normalizeTab(marketPrefix);
  const coinSymbol = symbol ?? "N/A";

  const price = ticker?.trade_price ?? 0;
  const changeRate = ticker?.signed_change_rate ?? 0;
  const changePrice = ticker?.signed_change_price ?? 0;
  const volume24h = ticker?.acc_trade_price_24h ?? 0;

  let rateColor = "text-gray-300";
  if (changeRate > 0) rateColor = "text-red-400";
  else if (changeRate < 0) rateColor = "text-blue-400";

  const formattedPrice = formatPrice(price, activeTab);
  const formattedChange = formatPrice(changePrice, activeTab);
  const formattedVolume = formatVolume(volume24h, activeTab);

  return {
    marketInfo,
    ticker,
    activeTab,
    coinSymbol,
    formattedPrice,
    formattedChange,
    formattedVolume,
    changeRate,
    rateColor,
  };
};