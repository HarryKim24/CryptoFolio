import { Market, Ticker } from "@/types/upbitTypes";
import axios from "axios";

export const getMarketList = async (): Promise<Market[]> => {
  const res = await axios.get(
    "https://api.upbit.com/v1/market/all?isDetails=true"
  );
  return res.data;
};

export const getTickerInfo = async (
  markets: string[]
): Promise<Ticker[]> => {
  const marketStr = markets.join(",");
  const res = await axios.get(
    `https://api.upbit.com/v1/ticker?markets=${marketStr}`
  );
  return res.data;
};
