import { Asset } from '@/types/assetTypes';

export interface PortfolioStats {
  evaluation: number;
  costBasis: number;
  totalBuy: number;
  realisedProfit: number;
  unrealisedProfit: number;
  allTimeProfit: number;
  profitRate: number;
}

type BuyInfo = {
  totalBuy: number;
  quantity: number;
};

type SellInfo = {
  totalSell: number;
  quantity: number;
};

const calculateStats = (
  assets: Asset[],
  priceMap: Record<string, number>
): PortfolioStats => {
  const buyMap = new Map<string, BuyInfo>();
  const sellMap = new Map<string, SellInfo>();
  const holdMap = new Map<string, number>();

  for (const asset of assets) {
    if (asset.type === 'buy') {
      const existingBuy = buyMap.get(asset.symbol) || {
        totalBuy: 0,
        quantity: 0,
      };

      existingBuy.totalBuy =
        existingBuy.totalBuy + asset.quantity * asset.averagePrice;
      existingBuy.quantity = existingBuy.quantity + asset.quantity;

      buyMap.set(asset.symbol, existingBuy);

      const currentHoldQuantity = holdMap.get(asset.symbol) ?? 0;
      const nextHoldQuantity = currentHoldQuantity + asset.quantity;
      holdMap.set(asset.symbol, nextHoldQuantity);
    }

    if (asset.type === 'sell') {
      const existingSell = sellMap.get(asset.symbol) || {
        totalSell: 0,
        quantity: 0,
      };

      existingSell.totalSell =
        existingSell.totalSell + asset.quantity * asset.averagePrice;
      existingSell.quantity = existingSell.quantity + asset.quantity;

      sellMap.set(asset.symbol, existingSell);

      const currentHoldQuantity = holdMap.get(asset.symbol) ?? 0;
      const nextHoldQuantity = currentHoldQuantity - asset.quantity;
      holdMap.set(asset.symbol, nextHoldQuantity);
    }
  }

  let totalBuy = 0;
  let realisedProfit = 0;
  let unrealisedProfit = 0;
  let evaluation = 0;

  for (const entry of buyMap.entries()) {
    const symbol = entry[0];
    const buyInfo = entry[1];

    const buyCost = buyInfo.totalBuy;
    const buyQuantity = buyInfo.quantity;

    const sellInfo = sellMap.get(symbol);
    const holdQuantity = holdMap.get(symbol) ?? 0;

    const safeQuantity = buyQuantity || 1;
    const averageBuyPrice = buyCost / safeQuantity;

    totalBuy = totalBuy + buyCost;

    if (sellInfo) {
      const realisedForSymbol =
        sellInfo.totalSell - averageBuyPrice * sellInfo.quantity;
      realisedProfit = realisedProfit + realisedForSymbol;
    }

    if (holdQuantity > 0) {
      const currentPrice = priceMap[symbol] ?? 0;
      const currentEvaluation = currentPrice * holdQuantity;
      const unrealisedForSymbol =
        (currentPrice - averageBuyPrice) * holdQuantity;

      evaluation = evaluation + currentEvaluation;
      unrealisedProfit = unrealisedProfit + unrealisedForSymbol;
    }
  }

  const allTimeProfit = realisedProfit + unrealisedProfit;
  let profitRate = 0;

  if (totalBuy > 0) {
    profitRate = (allTimeProfit / totalBuy) * 100;
  }

  const stats: PortfolioStats = {
    evaluation,
    costBasis: totalBuy,
    totalBuy,
    realisedProfit,
    unrealisedProfit,
    allTimeProfit,
    profitRate,
  };

  return stats;
};

export { calculateStats };