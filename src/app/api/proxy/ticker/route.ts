import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const markets = request.nextUrl.searchParams.get("markets");

  if (!markets) {
    return NextResponse.json(
      { error: "Missing markets parameter." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get("https://api.upbit.com/v1/ticker", {
      params: { markets },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error (ticker):", error);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}