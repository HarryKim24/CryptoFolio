import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, props: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const params = await props.params;
    const assetId = params.id;

    if (!assetId) {
      return NextResponse.json({ message: "ID가 없습니다." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cryptofolio");
    const collection = db.collection("assets");

    const result = await collection.deleteOne({
      _id: new ObjectId(assetId),
      userId: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "삭제할 항목을 찾지 못했습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "삭제 성공" });
  } catch (error) {
    console.error("개별 삭제 실패:", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}