/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import client from "@/lib/mongodb";
import { authOptions } from "@/lib/authOptions";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다" }, { status: 401 });
    }

    const db = (await client).db("cryptofolio");
    const assets = await db
      .collection("assets")
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(assets, { status: 200 });
  } catch (err) {
    console.error("자산 조회 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다" }, { status: 401 });
    }

    const body = await req.json();
    const { symbol, name, quantity, averagePrice, date, type } = body;

    if (
      !symbol ||
      !name ||
      quantity === undefined ||
      averagePrice === undefined ||
      !date ||
      !type
    ) {
      return NextResponse.json({ message: "필수 항목 누락" }, { status: 400 });
    }

    const db = (await client).db("cryptofolio");

    const doc = {
      userEmail: session.user.email,
      symbol,
      name,
      quantity,
      averagePrice,
      date,
      type,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("assets").insertOne(doc);

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...doc },
      { status: 201 }
    );
  } catch (err) {
    console.error("자산 저장 오류:", err);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다" }, { status: 401 });
    }

    const db = (await client).db("cryptofolio");

    const result = await db
      .collection("assets")
      .deleteMany({ userEmail: session.user.email });

    return NextResponse.json(
      { message: `${result.deletedCount}개의 거래가 삭제되었습니다.` },
      { status: 200 }
    );
  } catch (err) {
    console.error("전체 삭제 실패:", err);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}