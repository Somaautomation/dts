import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { verifyOtp } from './otp';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/auth/login', error: '/auth/login' },
  providers: [
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;
        const phone = credentials.phone.trim();
        const valid = await verifyOtp(phone, credentials.otp, 'login');
        if (!valid) return null;
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return null;
        await prisma.user.update({
          where: { id: user.id },
          data: { phoneVerified: new Date(), lastLogin: new Date() },
        });
        return { id: user.id, name: user.name, email: user.email ?? undefined, image: user.image ?? undefined };
      },
    }),
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        if (!['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'OFFICE_STAFF'].includes(user.role)) return null;
        await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
        return { id: user.id, name: user.name, email: user.email ?? undefined, image: user.image ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id as string } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.language = dbUser.language;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).language = token.language;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
