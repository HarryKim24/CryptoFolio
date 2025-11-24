import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";

const isDevelopment = process.env.NODE_ENV !== "production";
const INVALID_CREDENTIALS_MESSAGE = "이메일 또는 비밀번호가 올바르지 않습니다";

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

        if (isDevelopment) {
          console.log("로그인 요청 도착:", {
            email,
            hasPassword: Boolean(password),
          });
        }

        if (!email || !password) {
          if (isDevelopment) {
            console.log("이메일 또는 비밀번호 없음");
          }
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        const mongoClient = await client;
        const database = mongoClient.db("cryptofolio");
        const usersCollection = database.collection("users");
        const user = await usersCollection.findOne({ email });

        if (isDevelopment) {
          console.log("DB 조회 결과:", user ? "유저 찾음" : "유저 없음");
        }

        if (!user) {
          if (isDevelopment) {
            console.log("유저 없음");
          }
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        const passwordMatch = await verifyPassword(password, user.password);

        if (isDevelopment) {
          console.log("비밀번호 검증 결과:", passwordMatch);
        }

        if (!passwordMatch) {
          if (isDevelopment) {
            console.log("비밀번호 불일치");
          }
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        if (isDevelopment) {
          console.log("로그인 성공");
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
  session: {
    strategy: "jwt",
  },
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
      const sessionUser = session.user;

      sessionUser.id = token.id as string;
      sessionUser.email = token.email as string;
      sessionUser.name = token.name as string;
      sessionUser.createdAt = token.createdAt as string;
      sessionUser.updatedAt = token.updatedAt as string;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };