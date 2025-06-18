export type Asset = {
  symbol: string
  name: string
  quantity: number
  averagePrice: number
  currentPrice: number
  date: string
  type?: 'buy' | 'sell'
}