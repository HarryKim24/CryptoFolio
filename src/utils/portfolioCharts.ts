/* eslint-disable @typescript-eslint/no-unused-vars */
import { Asset } from "@/components/portfolio/types"

export function getDistribution(assets: Asset[], priceMap: Record<string, number>) {
  const result: Record<string, number> = {}

  for (const a of assets) {
    const qty = a.type === 'buy' ? a.quantity : -a.quantity
    result[a.symbol] = (result[a.symbol] ?? 0) + qty
  }

  return Object.entries(result)
    .filter(([_, qty]) => qty > 0)
    .map(([symbol, qty]) => ({
      symbol,
      value: qty * (priceMap[symbol] ?? 0),
    }))
}

export function getSnapshot(assets: Asset[], priceMap: Record<string, number>) {
  const holdings: Record<string, number> = {}

  for (const a of assets) {
    const qty = a.type === 'buy' ? a.quantity : -a.quantity
    holdings[a.symbol] = (holdings[a.symbol] ?? 0) + qty
  }

  const value = Object.entries(holdings).reduce((sum, [symbol, qty]) => {
    return sum + qty * (priceMap[symbol] ?? 0)
  }, 0)

  return [{ timestamp: Date.now(), value }]
}
