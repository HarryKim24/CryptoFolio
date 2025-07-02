import { getServerSession } from "next-auth";
import { verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("인증되지 않은 요청입니다", { status: 401 });
    }

    const { password } = await req.json();
    if (!password) {
      return new NextResponse("비밀번호를 입력하세요", { status: 400 });
    }

    const db = (await (await client).connect()).db("cryptofolio");
    const users = db.collection("users");

    const user = await users.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("사용자를 찾을 수 없습니다", { status: 404 });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return new NextResponse("비밀번호가 일치하지 않습니다", { status: 401 });
    }

    await users.deleteOne({ email: session.user.email });

    return new NextResponse("회원 탈퇴가 완료되었습니다", { status: 200 });
  } catch (err) {
    console.error("회원 탈퇴 오류:", err);
    return new NextResponse("서버 오류", { status: 500 });
  }
}