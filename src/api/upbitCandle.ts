import axios from "axios";
import type { GetCandlesOptions, upbitCandle } from "@/types/upbitCandle";

export const getUpbitCandles = async ({
  market,
  candleType,
  unit,
  to,
  count = 100,
}: GetCandlesOptions): Promise<upbitCandle[]> => {
  const baseUrl = "https://api.upbit.com/v1/candles";

  let url = `${baseUrl}/${candleType}`;
  if (candleType === "minutes") {
    if (!unit) throw new Error("단위가 지정되지 않았습니다: minutes 캔들은 unit이 필요합니다.");
    url += `/${unit}`;
  }

  const params: Record<string, string | number> = {
    market,
    count,
  };

  if (to) params.to = to;

  try {
    console.log("📡 요청 URL:", url);
    console.log("🧾 요청 파라미터:", params);

    const response = await axios.get<upbitCandle[]>(url, {
      params,
      headers: { Accept: "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("🛑 캔들 데이터 요청 실패:", error);
    throw error;
  }
};