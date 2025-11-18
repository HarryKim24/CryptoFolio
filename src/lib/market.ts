export type MarketTab = "KRW" | "BTC" | "USDT";

export const parseMarketTab = (market: string): MarketTab => {
  const prefix = market.split("-")[0]?.toUpperCase();

  if (prefix === "KRW" || prefix === "BTC" || prefix === "USDT") {
    return prefix;
  }

  return "KRW";
};