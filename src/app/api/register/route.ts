import { hashPassword } from "@/lib/auth";
import client from "@/lib/mongodb";
import { validateUserPayload } from "@/utils/validateRegisterInputs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const validationResult = validateUserPayload(email, password, name);
    if (!validationResult.valid) {
      return new Response(
        validationResult.message ?? "유효하지 않은 입력입니다",
        { status: 400 }
      );
    }

    const mongoClient = await client;
    const db = mongoClient.db("cryptofolio");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response("이미 존재하는 이메일입니다", { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const timestamp = new Date().toISOString();

    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return new Response("회원가입 성공", { status: 201 });
  } catch (error) {
    console.error("회원가입 오류:", error);
    return new Response("서버 오류", { status: 500 });
  }
}