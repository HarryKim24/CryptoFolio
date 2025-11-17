import { hashPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { User } from "@/types/user";
import { validateUserPayload } from "@/utils/validateRegisterInputs";

export async function POST(req: Request) {
  try {
    const { email, password, name }: Pick<User, "email" | "password" | "name"> =
      await req.json();

    const validation = validateUserPayload(email, password, name);
    if (!validation.valid) {
      return new Response(validation.message ?? "유효하지 않은 입력입니다", {
        status: 400,
      });
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