import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import client from "@/lib/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
      
        if (!email || !password) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
        }
      
        const mongoClient = await client;
        const db = mongoClient.db("cryptofolio");
        const user = await db.collection("users").findOne({ email });
      
        if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
      
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
      
        return {
          id: user._id.toString(),
          email: user.email ?? "",
          name: user.name ?? "",
          createdAt: user.createdAt ?? "",
          updatedAt: user.updatedAt ?? "",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.createdAt = user.createdAt ?? "";
        token.updatedAt = user.updatedAt ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.createdAt = token.createdAt ?? "";
        session.user.updatedAt = token.updatedAt ?? "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };