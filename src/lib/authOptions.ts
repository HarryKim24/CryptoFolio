import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";

const isDev = process.env.NODE_ENV !== "production";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (isDev) {
          console.log("🔍 로그인 요청 도착:", {
            email,
            hasPassword: Boolean(password),
          });
        }

        if (!email || !password) {
          if (isDev) {
            console.log("❌ 이메일 또는 비밀번호 없음");
          }
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
        }

        const mongoClient = await client;
        const db = mongoClient.db("cryptofolio");
        const user = await db.collection("users").findOne({ email });

        if (isDev) {
          console.log("🔍 DB 조회 결과:", user ? "유저 찾음" : "유저 없음");
        }

        if (!user) {
          if (isDev) {
            console.log("❌ 유저 없음");
          }
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
        }

        const passwordMatch = await verifyPassword(password, user.password);

        if (isDev) {
          console.log("🔍 비밀번호 검증 결과:", passwordMatch);
        }

        if (!passwordMatch) {
          if (isDev) {
            console.log("❌ 비밀번호 불일치");
          }
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
        }

        if (isDev) {
          console.log("✅ 로그인 성공");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? "",
          createdAt: user.createdAt?.toString(),
          updatedAt: user.updatedAt?.toString(),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.createdAt = token.createdAt as string;
      session.user.updatedAt = token.updatedAt as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };