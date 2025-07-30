export type Asset = {
  _id?: string;
  userId: string;        
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  date: string;
  type?: "buy" | "sell";
};