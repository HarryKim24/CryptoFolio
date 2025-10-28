import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;

  const candleType = search.get('candleType');
  const unit = search.get('unit');
  const market = search.get('market');
  const count = search.get('count');
  const to = search.get('to');

  if (!market || !candleType) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
  }

  let url = `https://api.upbit.com/v1/candles/${candleType}`;
  if (candleType === 'minutes' && unit) {
    url += `/${unit}`;
  }

  try {
    const { data } = await axios.get(url, {
      params: {
        market,
        count,
        ...(to && { to }),
      },
      headers: { Accept: 'application/json' },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("📛 Proxy error:", error);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}