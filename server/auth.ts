// src/server/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { sendVerificationRequest } from "@/server/verfiy";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      emailVerified?: Date | null;
      collegeName?: string | null;
      rollNumber?: string | null;
      phone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;

    collegeName?: string | null;
    rollNumber?: string | null;
    phone?: string | null;
    emailVerified?: Date | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            emailVerified: true,
            collegeName: true,
            rollNumber: true,
            phone: true,
          },
        });

        if (!user?.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          return null;
        }

        // Check if user is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          collegeName: user.collegeName,
          rollNumber: user.rollNumber,
          phone: user.phone,
        };
      },
    }),
    EmailProvider({
      server: "", // Not needed with Resend, but required by NextAuth
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.collegeName = user.collegeName;
        token.rollNumber = user.rollNumber;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        emailVerified: token.emailVerified as Date | null,
        collegeName: token.collegeName as string | null,
        rollNumber: token.rollNumber as string | null,
        phone: token.phone as string | null,
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
};