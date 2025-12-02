import { GetCandlesOptions, upbitCandle } from "@/types/upbitTypes";
import axios from "axios";

export const getUpbitCandles = async ({
  market,
  candleType,
  unit,
  to,
  count = 100,
}: GetCandlesOptions): Promise<upbitCandle[]> => {
  const baseUrl = "/api/proxy/candles";

  const params: { [key: string]: string | number | undefined } = {
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
      headers: { Accept: "application/json" },
    });

    return response.data;
  } catch (err) {
    console.error("캔들 데이터 요청 실패:", err);
    throw err;
  }
};