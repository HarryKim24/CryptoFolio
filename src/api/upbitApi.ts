import { Market, Ticker } from "@/types/upbitTypes";
import axios from "axios";

export const getMarketList = async (): Promise<Market[]> => {
  const res = await axios.get("/api/proxy/market", {
    params: { isDetails: true },
  });
  return res.data;
};

export const getTickerInfo = async (
  markets: string[]
): Promise<Ticker[]> => {
  const marketStr = markets.join(",");
  const res = await axios.get("/api/proxy/ticker", {
    params: { markets: marketStr },
  });
  return res.data;
};