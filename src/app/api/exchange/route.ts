/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(_request: NextRequest) {
  const apiKey = process.env.FREE_CURRENCY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API 키 누락" }, { status: 500 });
  }

  try {
    const response = await axios.get(
      "https://api.freecurrencyapi.com/v1/latest",
      {
        params: {
          apikey: apiKey,
          base_currency: "USD",
          currencies: "KRW,JPY,CNY,EUR",
        },
      }
    );

    const currencyData = response.data?.data;
    const usdToKrw = currencyData?.KRW;

    if (!currencyData || !usdToKrw) {
      return NextResponse.json(
        { error: "환율 데이터 부족" },
        { status: 500 }
      );
    }

    const result = [
      { country: "미국", pair: "USD/KRW", rate: usdToKrw.toFixed(1) },
      {
        country: "일본",
        pair: "JPY/KRW",
        rate: ((usdToKrw / currencyData.JPY) * 100).toFixed(1),
      },
      {
        country: "중국",
        pair: "CNY/KRW",
        rate: (usdToKrw / currencyData.CNY).toFixed(1),
      },
      {
        country: "유로",
        pair: "EUR/KRW",
        rate: (usdToKrw / currencyData.EUR).toFixed(1),
      },
    ];

    return NextResponse.json(result);
  } catch (error) {
    console.error("환율 API 실패:", error);
    return NextResponse.json({ error: "API 요청 실패" }, { status: 500 });
  }
}