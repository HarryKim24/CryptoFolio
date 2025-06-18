import { Asset } from '@/components/portfolio/types'

export interface PortfolioStats {
  evaluation: number
  costBasis: number
  totalBuy: number
  realisedProfit: number
  unrealisedProfit: number
  allTimeProfit: number
  profitRate: number
}

export function calculateStats(
  assets: Asset[],
  priceMap: Record<string, number>
): PortfolioStats {
  const buyMap = new Map<
    string,
    { totalBuy: number; quantity: number }
  >()
  const sellMap = new Map<
    string,
    { totalSell: number; quantity: number }
  >()
  const holdMap = new Map<string, number>()

  for (const a of assets) {
    if (a.type === 'buy') {
      const b = buyMap.get(a.symbol) ?? { totalBuy: 0, quantity: 0 }
      b.totalBuy += a.quantity * a.averagePrice
      b.quantity += a.quantity
      buyMap.set(a.symbol, b)

      const h = holdMap.get(a.symbol) ?? 0
      holdMap.set(a.symbol, h + a.quantity)
    }

    if (a.type === 'sell') {
      const s = sellMap.get(a.symbol) ?? { totalSell: 0, quantity: 0 }
      s.totalSell += a.quantity * a.averagePrice
      s.quantity += a.quantity
      sellMap.set(a.symbol, s)

      const h = holdMap.get(a.symbol) ?? 0
      holdMap.set(a.symbol, h - a.quantity)
    }
  }

  let totalBuy = 0
  let realisedProfit = 0
  let unrealisedProfit = 0
  let evaluation = 0

  for (const [symbol, { totalBuy: bCost, quantity: bQty }] of buyMap.entries()) {
    const s = sellMap.get(symbol)
    const hQty = holdMap.get(symbol) ?? 0
    const avgBuyPrice = bCost / (bQty || 1)

    totalBuy += bCost

    if (s) {
      const rProfit = (s.totalSell - avgBuyPrice * s.quantity)
      realisedProfit += rProfit
    }

    if (hQty > 0) {
      const currentPrice = priceMap[symbol] ?? 0
      evaluation += currentPrice * hQty
      unrealisedProfit += (currentPrice - avgBuyPrice) * hQty
    }
  }

  const allTimeProfit = realisedProfit + unrealisedProfit
  const profitRate = totalBuy > 0 ? (allTimeProfit / totalBuy) * 100 : 0

  return {
    evaluation,
    costBasis: totalBuy,
    totalBuy,
    realisedProfit,
    unrealisedProfit,
    allTimeProfit,
    profitRate,
  }
}