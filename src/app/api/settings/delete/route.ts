import { getServerSession } from "next-auth";
import { verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return new NextResponse("인증되지 않은 요청입니다", { status: 401 });
    }

    const { password } = await request.json();
    if (!password) {
      return new NextResponse("비밀번호를 입력하세요", { status: 400 });
    }

    const mongoClient = await client;
    const db = mongoClient.db("cryptofolio");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
      return new NextResponse("사용자를 찾을 수 없습니다", { status: 404 });
    }

    const isPasswordMatch = await verifyPassword(password, user.password);
    if (!isPasswordMatch) {
      return new NextResponse("비밀번호가 일치하지 않습니다", { status: 401 });
    }

    await usersCollection.deleteOne({ email: userEmail });

    return new NextResponse("회원 탈퇴가 완료되었습니다", { status: 200 });
  } catch (error) {
    console.error("회원 탈퇴 오류:", error);
    return new NextResponse("서버 오류", { status: 500 });
  }
}