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

interface CoinStat {
  totalBuyCost: number;
  buyQuantity: number;
  totalSellCost: number;
  sellQuantity: number;
  holdQuantity: number;
}

const calculateStats = (
  assets: Asset[],
  priceMap: Record<string, number>
): PortfolioStats => {
  const tempStats: Record<string, CoinStat> = {};

  assets.forEach((asset) => {
    if (!tempStats[asset.symbol]) {
      tempStats[asset.symbol] = {
        totalBuyCost: 0,
        buyQuantity: 0,
        totalSellCost: 0,
        sellQuantity: 0,
        holdQuantity: 0,
      };
    }

    const stat = tempStats[asset.symbol];

    if (asset.type === 'buy') {
      stat.totalBuyCost += asset.quantity * asset.averagePrice;
      stat.buyQuantity += asset.quantity;
      stat.holdQuantity += asset.quantity;
    } else if (asset.type === 'sell') {
      stat.totalSellCost += asset.quantity * asset.averagePrice;
      stat.sellQuantity += asset.quantity;
      stat.holdQuantity -= asset.quantity;
    }
  });

  let totalBuy = 0;
  let realisedProfit = 0;
  let unrealisedProfit = 0;
  let evaluation = 0;

  Object.keys(tempStats).forEach((symbol) => {
    const stat = tempStats[symbol];
    
    const avgBuyPrice = stat.buyQuantity > 0 ? stat.totalBuyCost / stat.buyQuantity : 0;

    totalBuy += stat.totalBuyCost;

    if (stat.sellQuantity > 0) {
      realisedProfit += stat.totalSellCost - (avgBuyPrice * stat.sellQuantity);
    }

    if (stat.holdQuantity > 0) {
      const currentPrice = priceMap[symbol] ?? 0;
      const currentVal = currentPrice * stat.holdQuantity;
      
      evaluation += currentVal;
      unrealisedProfit += (currentPrice - avgBuyPrice) * stat.holdQuantity;
    }
  });

  const allTimeProfit = realisedProfit + unrealisedProfit;
  let profitRate = 0;

  if (totalBuy > 0) {
    profitRate = (allTimeProfit / totalBuy) * 100;
  }

  return {
    evaluation,
    costBasis: totalBuy,
    totalBuy,
    realisedProfit,
    unrealisedProfit,
    allTimeProfit,
    profitRate,
  };
};

export { calculateStats };