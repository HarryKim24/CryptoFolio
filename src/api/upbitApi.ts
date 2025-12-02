import { Market, Ticker } from "@/types/upbitTypes";
import axios from "axios";

export const getMarketList = async (): Promise<Market[]> => {
  try {
    const response = await axios.get("/api/proxy/market", {
      params: { isDetails: true },
    });
    return response.data;
  } catch (error) {
    console.error("마켓 리스트 로딩 실패:", error);
    return [];
  }
};

export const getTickerInfo = async (markets: string[]): Promise<Ticker[]> => {
  try {
    if (markets.length === 0) {
      return [];
    }

    const marketParam = markets.join(",");
    
    const response = await axios.get("/api/proxy/ticker", {
      params: { markets: marketParam },
    });
    
    return response.data;
  } catch (error) {
    console.error("티커 정보 로딩 실패:", error);
    return [];
  }
};