import { Asset } from '@/types/assetTypes';

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

type HoldingRecord = {
  name: string;
  quantity: number;
  totalCost: number;
};

export const calculateAssetsPerformance = (
  assets: Asset[],
  priceMap: Record<string, number>
): AssetPerformanceRow[] => {
  const holdings = new Map<string, HoldingRecord>();

  const sortedAssets = [...assets].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeA - timeB;
  });

  for (const asset of sortedAssets) {
    const existing = holdings.get(asset.symbol);
    const record: HoldingRecord = existing || {
      name: asset.name,
      quantity: 0,
      totalCost: 0,
    };

    if (asset.type === 'buy') {
      record.quantity = record.quantity + asset.quantity;
      record.totalCost = record.totalCost + asset.quantity * asset.averagePrice;
    } else if (asset.type === 'sell') {
      const previousQuantity = record.quantity;
      let previousAveragePrice = 0;

      if (previousQuantity > 0) {
        previousAveragePrice = record.totalCost / previousQuantity;
      }

      record.quantity = record.quantity - asset.quantity;
      record.totalCost = record.totalCost - asset.quantity * previousAveragePrice;
    }

    holdings.set(asset.symbol, record);
  }

  const result: AssetPerformanceRow[] = [];

  for (const [symbol, record] of holdings.entries()) {
    if (record.quantity <= 0) {
      continue;
    }

    const currentPrice = priceMap[symbol] ?? 0;
    const currentValue = record.quantity * currentPrice;
    const profit = currentValue - record.totalCost;

    let rate = 0;
    if (record.totalCost > 0) {
      rate = (profit / record.totalCost) * 100;
    }

    let averagePrice = 0;
    if (record.quantity > 0) {
      averagePrice = record.totalCost / record.quantity;
    }

    const row: AssetPerformanceRow = {
      symbol,
      name: record.name,
      quantity: record.quantity,
      averagePrice,
      currentPrice,
      currentValue,
      profit,
      rate,
    };

    result.push(row);
  }

  return result;
};