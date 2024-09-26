// @ts-nocheck
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@lib/passwordUtils";
import { exclude } from "@lib/filterUser";
import prisma from "@lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const _user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!_user) {
          throw new Error("User not found");
        }

        const correctPassword = await comparePassword(
          credentials.password,
          _user.passwordHash
        );
        if (!correctPassword) {
          throw new Error("Incorrect password");
        }

        const user = exclude(_user, ["passwordHash"]);

        if (user && correctPassword) {
          return {
            ...user,
            id: String(user.id),
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      const { user } = token as { user?: any };

      if (user) {
        session.user = user;

        const _user = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (!_user) {
          return null;
        }

        session.user = token.user;
        return session;
      }

      return null;
    },
  },
  cors: {
    origin: process.env.NEXTAUTH_URL,
  },
};

export default NextAuth(authOptions);
