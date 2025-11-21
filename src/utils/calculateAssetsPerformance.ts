import { Asset } from "@/types/assetTypes";

export interface AssetPerformanceRow {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  profit: number;
  rate: number;
}

export const calculateAssetsPerformance = (
  assets: Asset[],
  priceMap: Record<string, number>
): AssetPerformanceRow[] => {
  const holdings = new Map<string, { name: string; quantity: number; totalCost: number }>();

  const sortedAssets = [...assets].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const a of sortedAssets) {
    const record = holdings.get(a.symbol) ?? { name: a.name, quantity: 0, totalCost: 0 };

    if (a.type === "buy") {
      record.quantity += a.quantity;
      record.totalCost += a.quantity * a.averagePrice;
    } else if (a.type === "sell") {
      const prevQuantity = record.quantity;
      const prevAvgPrice = prevQuantity > 0 ? record.totalCost / prevQuantity : 0;

      record.quantity -= a.quantity;
      record.totalCost -= a.quantity * prevAvgPrice;
    }

    holdings.set(a.symbol, record);
  }

  const data: AssetPerformanceRow[] = Array.from(holdings.entries())
    .filter(([, v]) => v.quantity > 0)
    .map(([symbol, { name, quantity, totalCost }]) => {
      const currentPrice = priceMap[symbol] ?? 0;
      const currentValue = quantity * currentPrice;
      const profit = currentValue - totalCost;
      const rate = totalCost > 0 ? (profit / totalCost) * 100 : 0;
      const averagePrice = quantity > 0 ? totalCost / quantity : 0;

      return {
        symbol,
        name,
        quantity,
        averagePrice,
        currentPrice,
        currentValue,
        profit,
        rate,
      };
    });

  return data;
};