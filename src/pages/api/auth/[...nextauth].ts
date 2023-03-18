import { LoginResponse } from "@/components/features/auth/register";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const baseUrl = process.env.WEB_API_URL;

export type SuccessResponse<T> = {
  data: T;
  status: number;
};

export type ErrorResponse = {
  status: number;
  error: { fields: Record<string, string>; code: string };
};

export type UserLocal = {
  id: string;
  email: string;
  token: string;
};

export type TokenLocal = {
  name: string | undefined;
  email: string;
  picture: string;
  sub: string;
  accessToken: string;
};

export type SessionLocal = {
  user: {
    name: string | undefined;
    email: string;
    image: string | undefined;
  };
  expires: string;
  accessToken: string;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials_register",
      credentials: {
        name: { type: "text" },
        email: { type: "text" },
        password: { type: "text" },
        confirmPassword: { type: "text" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${baseUrl}/users`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        let data = (await res.json()) as LoginResponse;

        if (!data.status) {
          let errData = data as unknown as ErrorResponse;
          throw new Error(JSON.stringify(errData.error));
        }

        if (res.ok && data && data.token && credentials) {
          return {
            id: credentials.email,
            email: credentials.email,
            token: data.token,
          };
        }

        return null;
      },
    }),

    CredentialsProvider({
      id: "credentials_login",
      credentials: {
        email: { type: "text" },
        password: { type: "text" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${baseUrl}/sessions`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        let data = (await res.json()) as LoginResponse;

        if (!data.status) {
          let errData = data as unknown as ErrorResponse;
          throw new Error(JSON.stringify(errData.error));
        }

        if (res.ok && data && data.token && credentials) {
          return {
            id: credentials.email,
            email: credentials.email,
            token: data.token,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn(args) {
      const { user, account, profile, email, credentials } = args;
      return true;
    },
    async redirect(args) {
      const { url, baseUrl } = args;
      return baseUrl;
    },

    async jwt(args) {
      const { token, user, account, profile, isNewUser } = args;

      let userWithToken = user as UserLocal;
      if (userWithToken && userWithToken.token) {
        token.accessToken = userWithToken.token;
      }

      return token;
    },

    async session(args) {
      const { session, user, token } = args;

      let tokenWithAccessToken = token as TokenLocal;
      if (tokenWithAccessToken.accessToken) {
        return {
          ...session,
          accessToken: tokenWithAccessToken.accessToken,
        };
      }

      return session;
    },
  },
};
export default NextAuth(authOptions);
