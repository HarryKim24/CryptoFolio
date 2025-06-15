/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { candleType, unit, market, count, to } = req.query;

    if (!market || !candleType) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const safeCandleType = Array.isArray(candleType) ? candleType[0] : candleType;
    const safeUnit = Array.isArray(unit) ? unit[0] : unit;
    const safeMarket = Array.isArray(market) ? market[0] : market;
    const safeCount = Array.isArray(count) ? count[0] : count;
    const safeTo = Array.isArray(to) ? to[0] : to;

    let url = `https://api.upbit.com/v1/candles/${safeCandleType}`;
    if (safeCandleType === "minutes" && safeUnit) {
      url += `/${safeUnit}`;
    }

    console.log("📡 요청 URL:", url);
    console.log("🧾 요청 파라미터:", { market: safeMarket, count: safeCount, to: safeTo });

    const { data } = await axios.get(url, {
      params: {
        market: safeMarket,
        count: safeCount,
        ...(safeTo && { to: safeTo }),
      },
      headers: { Accept: "application/json" },
    });

    res.status(200).json(data);
  } catch (error: any) {
    console.error("📛 Proxy error:", error.message);
    res.status(500).json({ error: "Proxy failed", detail: error.message });
  }
}