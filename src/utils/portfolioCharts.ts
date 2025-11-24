import { Asset } from '@/types/assetTypes';

type DistributionItem = {
  symbol: string;
  value: number;
};

type SnapshotItem = {
  timestamp: number;
  value: number;
};

const getDistribution = (
  assets: Asset[],
  priceMap: Record<string, number>
): DistributionItem[] => {
  const result: Record<string, number> = {};

  for (const asset of assets) {
    let quantity = asset.quantity;

    if (asset.type === 'sell') {
      quantity = -asset.quantity;
    }

    const previousQuantity = result[asset.symbol] ?? 0;
    const nextQuantity = previousQuantity + quantity;

    result[asset.symbol] = nextQuantity;
  }

  const entries = Object.entries(result);
  const filteredEntries = entries.filter((entry) => {
    const quantity = entry[1];
    return quantity > 0;
  });

  const distribution: DistributionItem[] = [];

  for (const entry of filteredEntries) {
    const symbol = entry[0];
    const quantity = entry[1];
    const price = priceMap[symbol] ?? 0;
    const value = quantity * price;

    const item: DistributionItem = {
      symbol,
      value,
    };

    distribution.push(item);
  }

  return distribution;
};

const getSnapshot = (
  assets: Asset[],
  priceMap: Record<string, number>
): SnapshotItem[] => {
  const holdings: Record<string, number> = {};

  for (const asset of assets) {
    let quantity = asset.quantity;

    if (asset.type === 'sell') {
      quantity = -asset.quantity;
    }

    const previousQuantity = holdings[asset.symbol] ?? 0;
    const nextQuantity = previousQuantity + quantity;

    holdings[asset.symbol] = nextQuantity;
  }

  const entries = Object.entries(holdings);
  let totalValue = 0;

  for (const entry of entries) {
    const symbol = entry[0];
    const quantity = entry[1];
    const price = priceMap[symbol] ?? 0;
    const value = quantity * price;

    totalValue = totalValue + value;
  }

  const snapshot: SnapshotItem = {
    timestamp: Date.now(),
    value: totalValue,
  };

  return [snapshot];
};

export { getDistribution, getSnapshot };