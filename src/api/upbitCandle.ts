import axios from "axios";
import type { GetCandlesOptions, upbitCandle } from "@/types/upbitCandle";

export const getUpbitCandles = async ({
  market,
  candleType,
  unit,
  to,
  count = 100,
}: GetCandlesOptions): Promise<upbitCandle[]> => {
  const baseUrl = "/api/proxy/candles";

  const params: Record<string, string | number> = {
    market,
    candleType,
    count,
  };
  if (unit) params.unit = unit;
  if (to) params.to = to;

  try {
    const response = await axios.get<upbitCandle[]>(baseUrl, {
      params,
      headers: { Accept: "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("🛑 캔들 데이터 요청 실패:", error);
    throw error;
  }
};