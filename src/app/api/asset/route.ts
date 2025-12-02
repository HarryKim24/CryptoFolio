import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("cryptofolio");
    const collection = db.collection("assets");

    const assets = await collection
      .find({ userId: session.user.email })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(assets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.symbol || !body.name || !body.date || !body.type) {
      return NextResponse.json({ message: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cryptofolio");
    const collection = db.collection("assets");

    const newAsset = {
      ...body,
      userId: session.user.email,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newAsset);

    return NextResponse.json(
      { ...newAsset, _id: result.insertedId }, 
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "자산 추가 실패" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("cryptofolio");
    const collection = db.collection("assets");

    await collection.deleteMany({ userId: session.user.email });

    return NextResponse.json({ message: "초기화 완료" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}