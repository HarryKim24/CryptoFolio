import { getServerSession } from "next-auth";
import { hashPassword, verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return new NextResponse("인증되지 않은 요청입니다", { status: 401 });
    }

    const { name, currentPassword, newPassword } = await request.json();

    const mongoClient = await client;
    const db = mongoClient.db("cryptofolio");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
      return new NextResponse("사용자를 찾을 수 없습니다", { status: 404 });
    }

    const updates: { name?: string; password?: string; updatedAt?: string } = {};
    const currentTime = new Date();

    const isNameChanged = !!name && name !== user.name;
    const isPasswordChanged = !!newPassword;

    if (isNameChanged) {
      const nameRegex = /^[가-힣a-zA-Z]{1,8}$/;
      if (!nameRegex.test(name)) {
        return new NextResponse(
          "이름은 한글 또는 영문만 사용 가능하며 8자 이내여야 합니다",
          { status: 400 }
        );
      }

      if (!isPasswordChanged) {
        const lastUpdated = new Date(user.updatedAt);
        const oneMonthMs = 30 * 24 * 60 * 60 * 1000;

        if (currentTime.getTime() - lastUpdated.getTime() < oneMonthMs) {
          return new NextResponse(
            "이름은 최근 수정일로부터 1개월 후에만 변경할 수 있습니다",
            { status: 403 }
          );
        }
      }

      updates.name = name;
    }

    if (isPasswordChanged) {
      if (!currentPassword) {
        return new NextResponse("현재 비밀번호를 입력하세요", { status: 400 });
      }

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return new NextResponse(
          "비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다",
          { status: 400 }
        );
      }

      const isPasswordMatch = await verifyPassword(
        currentPassword,
        user.password
      );
      if (!isPasswordMatch) {
        return new NextResponse(
          "현재 비밀번호가 일치하지 않습니다",
          { status: 400 }
        );
      }

      updates.password = await hashPassword(newPassword);
    }

    if (!updates.name && !updates.password) {
      return new NextResponse("변경할 내용이 없습니다", { status: 400 });
    }

    updates.updatedAt = currentTime.toISOString();

    await usersCollection.updateOne(
      { email: userEmail },
      { $set: updates }
    );

    return new NextResponse("프로필이 수정되었습니다", { status: 200 });
  } catch (error) {
    console.error("프로필 수정 오류:", error);
    return new NextResponse("서버 오류", { status: 500 });
  }
}