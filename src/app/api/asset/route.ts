import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import client from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다" }, { status: 401 });
    }

    const body = await req.json();
    const { symbol, name, quantity, averagePrice, currentPrice, date, type } = body;

    if (!symbol || !name || !quantity || !averagePrice || !currentPrice || !date || !type) {
      return NextResponse.json({ message: "필수 항목 누락" }, { status: 400 });
    }

    const db = (await client).db("cryptofolio");

    const doc = {
      userEmail: session.user.email,
      symbol,
      name,
      quantity,
      averagePrice,
      currentPrice,
      date,
      type,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("assets").insertOne(doc);

    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (err) {
    console.error("자산 저장 오류:", err);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}