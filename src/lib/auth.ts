import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from './prisma';
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only add OAuth providers if environment variables are defined
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
    
    // Email provider is optional as well
    ...(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER ? [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT || 587),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD || '',
          },
        },
        from: process.env.EMAIL_FROM || 'noreply@oncode.dev',
      })
    ] : []),
    
    // Always include credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          // If user exists but signed up with OAuth, they won't have a passwordHash
          // You might want to prompt them to sign in with their OAuth provider
          // or allow them to set a password.
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string; // Add user ID to the session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Persist user ID in the JWT
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};