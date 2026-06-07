import crypto from "node:crypto";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {prisma} from "./db";
import {z} from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const {handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const {email, password} = loginSchema.parse(credentials);

        const user = await prisma.user.findUnique({
          where: {email},
        });
        if (!user) return null;

        const hash = await crypto
          .createHash("sha256")
          .update(password + user.salts)
          .digest("hex");

        if (hash !== user.password) return null;

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({session, token}) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
