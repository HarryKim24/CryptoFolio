import { hashPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { User } from "@/types/user";

export async function POST(req: Request) {
  try {
    const { email, password, name }: Pick<User, "email" | "password" | "name"> = await req.json();

    if (!email || !password || !name) {
      return new Response("모든 필드를 입력하세요", { status: 400 });
    }

    const nameRegex = /^[가-힣a-zA-Z]{1,8}$/;
    if (!nameRegex.test(name)) {
      return new Response("이름은 한글 또는 영문만 사용 가능하며 8자 이내여야 합니다.", {
        status: 400,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response("유효한 이메일 형식이 아닙니다", { status: 400 });
    }

    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if (!pwRegex.test(password)) {
      return new Response("비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다", { status: 400 });
    }

    const mongoClient = await client;
    const db = mongoClient.db("cryptofolio");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response("이미 존재하는 이메일입니다", { status: 409 });
    }

    const hashed = await hashPassword(password);
    const now = new Date().toISOString();

    await users.insertOne({
      email,
      password: hashed,
      name,
      createdAt: now,
      updatedAt: now,
    });

    return new Response("회원가입 성공", { status: 201 });
  } catch (err) {
    console.error("회원가입 오류:", err);
    return new Response("서버 오류", { status: 500 });
  }
}