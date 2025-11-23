import { Market, Ticker } from "@/types/upbitTypes";
import axios from "axios";

export const getMarketList = async (): Promise<Market[]> => {
  const response = await axios.get("/api/proxy/market", {
    params: { isDetails: true },
  });
  return response.data;
};

export const getTickerInfo = async (markets: string[]): Promise<Ticker[]> => {
  const marketParam = markets.join(",");
  const response = await axios.get("/api/proxy/ticker", {
    params: { markets: marketParam },
  });
  return response.data;
};