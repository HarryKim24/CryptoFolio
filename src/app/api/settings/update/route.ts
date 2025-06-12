import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hashPassword, verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("인증되지 않은 요청입니다", { status: 401 });
    }

    const { name, currentPassword, newPassword } = await req.json();
    const db = (await client.connect()).db("cryptofolio");
    const users = db.collection("users");

    const user = await users.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse("사용자를 찾을 수 없습니다", { status: 404 });
    }

    const updates: Partial<{ name: string; password: string; updatedAt: string }> = {};
    const now = new Date();

    const isNameChanged = name && name !== user.name;
    const isPasswordChanged = !!newPassword;

    if (isNameChanged) {
      const nameRegex = /^[가-힣a-zA-Z]{1,8}$/;
      if (!nameRegex.test(name)) {
        return new NextResponse("이름은 한글 또는 영문만 사용 가능하며 8자 이내여야 합니다", { status: 400 });
      }

      if (!isPasswordChanged) {
        const lastUpdated = new Date(user.updatedAt);
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        if (now.getTime() - lastUpdated.getTime() < oneMonth) {
          return new NextResponse("이름은 최근 수정일로부터 1개월 후에만 변경할 수 있습니다", { status: 403 });
        }
      }

      updates.name = name;
    }

    if (isPasswordChanged) {
      if (!currentPassword) {
        return new NextResponse("현재 비밀번호를 입력하세요", { status: 400 });
      }

      const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
      if (!pwRegex.test(newPassword)) {
        return new NextResponse("비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다", { status: 400 });
      }

      const isMatch = await verifyPassword(currentPassword, user.password);
      if (!isMatch) {
        return new NextResponse("현재 비밀번호가 일치하지 않습니다", { status: 400 });
      }

      updates.password = await hashPassword(newPassword);
    }

    if (!updates.name && !updates.password) {
      return new NextResponse("변경할 내용이 없습니다", { status: 400 });
    }

    updates.updatedAt = now.toISOString();
    await users.updateOne({ email: session.user.email }, { $set: updates });

    return new NextResponse("프로필이 수정되었습니다", { status: 200 });
  } catch (err) {
    console.error("프로필 수정 오류:", err);
    return new NextResponse("서버 오류", { status: 500 });
  }
}