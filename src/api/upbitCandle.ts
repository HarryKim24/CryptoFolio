import { GetCandlesOptions, upbitCandle } from "@/types/upbitTypes";
import axios from "axios";

export const getUpbitCandles = async (
  { market, candleType, unit, to, count = 100 }: GetCandlesOptions,
  signal?: AbortSignal
): Promise<upbitCandle[]> => {
  const baseUrl = "/api/proxy/candles";

  const params: Record<string, string | number> = {
    market,
    candleType,
    count,
  };

  if (unit) {
    params.unit = unit;
  }

  if (to) {
    params.to = to;
  }

  try {
    const response = await axios.get<upbitCandle[]>(baseUrl, {
      params,
      signal,
      headers: { Accept: "application/json" },
    });

    return response.data;
  } catch (err) {
    if (axios.isCancel(err)) {
      return [];
    }

    console.error("Candle request error:", err);
    throw err;
  }
};