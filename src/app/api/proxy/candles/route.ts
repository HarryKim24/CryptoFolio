import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const candleType = searchParams.get("candleType");
  const unit = searchParams.get("unit");
  const market = searchParams.get("market");
  const count = searchParams.get("count");
  const to = searchParams.get("to");

  if (!market || !candleType) {
    return NextResponse.json(
      { error: "Missing required parameters." },
      { status: 400 }
    );
  }

  let apiUrl = `https://api.upbit.com/v1/candles/${candleType}`;
  if (candleType === "minutes" && unit) {
    apiUrl += `/${unit}`;
  }

  try {
    const response = await axios.get(apiUrl, {
      params: {
        market,
        count,
        ...(to && { to }),
      },
      headers: {
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}