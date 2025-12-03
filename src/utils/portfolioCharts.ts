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
  const quantityMap: Record<string, number> = {};

  assets.forEach((asset) => {
    if (!quantityMap[asset.symbol]) {
      quantityMap[asset.symbol] = 0;
    }

    if (asset.type === 'buy') {
      quantityMap[asset.symbol] += asset.quantity;
    } else {
      quantityMap[asset.symbol] -= asset.quantity;
    }
  });

  const distribution: DistributionItem[] = [];

  Object.keys(quantityMap).forEach((symbol) => {
    const quantity = quantityMap[symbol];

    if (quantity <= 0.00000001) return;

    const price = priceMap[symbol] ?? 0;
    const value = quantity * price;

    distribution.push({
      symbol,
      value,
    });
  });

  return distribution;
};

const getSnapshot = (
  assets: Asset[],
  priceMap: Record<string, number>
): SnapshotItem[] => {
  let totalValue = 0;
  const quantityMap: Record<string, number> = {};

  assets.forEach((asset) => {
    if (!quantityMap[asset.symbol]) {
        quantityMap[asset.symbol] = 0;
    }
    if (asset.type === 'buy') {
        quantityMap[asset.symbol] += asset.quantity;
    } else {
        quantityMap[asset.symbol] -= asset.quantity;
    }
  });

  Object.keys(quantityMap).forEach((symbol) => {
      const quantity = quantityMap[symbol];
      if (quantity > 0) {
          const price = priceMap[symbol] ?? 0;
          totalValue += quantity * price;
      }
  });

  return [{
    timestamp: Date.now(),
    value: totalValue,
  }];
};

export { getDistribution, getSnapshot };