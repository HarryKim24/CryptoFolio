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
        const db = (await client.connect()).db("cryptofolio");
        const user = await db.collection("users").findOne({ email: credentials?.email });

        if (!user) throw new Error("이메일이 존재하지 않습니다");

        const isValid = await verifyPassword(credentials!.password, user.password);
        if (!isValid) throw new Error("비밀번호가 틀렸습니다");

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
