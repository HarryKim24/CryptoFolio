import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        const client = await clientPromise;
        const db = client.db("cryptofolio");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("가입되지 않은 이메일입니다.");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return {
          id: user._id.toString(),
          email: user.email || "",
          name: user.name || "",
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
        token.email = user.email || "";
        token.name = user.name || "";
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.email = (token.email || "") as string;
        session.user.name = (token.name || "") as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};