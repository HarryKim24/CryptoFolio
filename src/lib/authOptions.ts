import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/auth';
import client from '@/lib/mongodb';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
        }

        const mongoClient = await client;
        const db = mongoClient.db('cryptofolio');
        const user = await db.collection('users').findOne({ email });

        if (!user || !(await verifyPassword(password, user.password))) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? '',
          createdAt: user.createdAt?.toString(),
          updatedAt: user.updatedAt?.toString(),
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? '';
        token.name = user.name ?? '';
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
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