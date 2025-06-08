import { hashPassword } from "@/lib/auth";
import client from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response("이메일과 비밀번호를 모두 입력하세요", { status: 400 });
    }

    const db = (await client.connect()).db("cryptofolio");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response("이미 존재하는 이메일입니다", { status: 409 });
    }

    const hashed = await hashPassword(password);
    await users.insertOne({ email, password: hashed });

    return new Response("회원가입 성공", { status: 201 });
  } catch (err) {
    console.error("회원가입 오류:", err);
    return new Response("서버 오류", { status: 500 });
  }
}