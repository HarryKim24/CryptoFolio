import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.FREE_CURRENCY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API 키 누락" });
  }

  try {
    const response = await axios.get("https://api.freecurrencyapi.com/v1/latest", {
      params: {
        apikey: apiKey,
        base_currency: "USD",
        currencies: "KRW,JPY,CNY,EUR",
      },
    });

    const data = response.data?.data;
    const usdToKrw = data?.KRW;

    if (!data || !usdToKrw) {
      return res.status(500).json({ error: "환율 데이터 부족" });
    }

    const results = [
      { country: "미국", pair: "USD/KRW", rate: usdToKrw.toFixed(1) },
      { country: "일본", pair: "JPY/KRW", rate: ((usdToKrw / data.JPY) * 100).toFixed(1) },
      { country: "중국", pair: "CNY/KRW", rate: (usdToKrw / data.CNY).toFixed(1) },
      { country: "유로", pair: "EUR/KRW", rate: (usdToKrw / data.EUR).toFixed(1) },
    ];

    res.status(200).json(results);
  } catch (err) {
    console.error("환율 API 실패:", err);
    res.status(500).json({ error: "API 요청 실패" });
  }
}