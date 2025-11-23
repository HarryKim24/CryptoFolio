/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const { path } = context.params;
  const pathSegments = path ?? [];
  const targetUrl = `https://api.upbit.com/${pathSegments.join("/")}`;

  const searchParams = request.nextUrl.searchParams;
  const queryParams = Object.fromEntries(searchParams.entries());

  try {
    const response = await axios.get(targetUrl, {
      params: queryParams,
      headers: {
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Proxy Error:", error.message);
    return NextResponse.json(
      { error: "Proxy request failed", details: error.message },
      { status: 500 }
    );
  }
}