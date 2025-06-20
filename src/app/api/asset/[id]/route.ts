import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  const condition = { _id: new ObjectId(id), userEmail };

  try {
    const db = (await client).db("cryptofolio");

    const result = await db.collection("assets").deleteOne(condition);

    if (result.deletedCount === 0) {
      console.warn("⚠️ 삭제 대상 없음 (조건 불일치)");
      return NextResponse.json({ error: "해당 거래를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "삭제 완료" }, { status: 200 });
  } catch (err) {
    console.error("삭제 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}