import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const isDetails = request.nextUrl.searchParams.get("isDetails") ?? "true";

  try {
    const response = await axios.get(
      "https://api.upbit.com/v1/market/all",
      {
        params: { isDetails },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error (market):", error);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}