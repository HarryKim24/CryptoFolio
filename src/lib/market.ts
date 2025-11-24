export type MarketTab = "KRW" | "BTC" | "USDT";

export const parseMarketTab = (market: string): MarketTab => {
  const parts = market.split("-");
  const prefix = parts[0] ? parts[0].toUpperCase() : "";

  const isKRW = prefix === "KRW";
  const isBTC = prefix === "BTC";
  const isUSDT = prefix === "USDT";

  if (isKRW || isBTC || isUSDT) {
    return prefix as MarketTab;
  }

  return "KRW";
};