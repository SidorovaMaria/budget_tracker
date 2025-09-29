import NextAuth from "next-auth";

import Google from "next-auth/providers/google";
import { authApi } from "./lib/authapi";
import Credentials from "next-auth/providers/credentials";

import { SignInSchema } from "./lib/validation/validation-auth";
import { IAccountDoc } from "./database/models/account.model";
import { IUserDoc } from "./database/models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const validated = SignInSchema.safeParse(credentials);
        if (validated.success) {
          const { email, password } = validated.data;
          const { data: existingAccount } = (await authApi.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;
          if (!existingAccount) return null;
          const { data: existingUser } = (await authApi.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;

          if (!existingUser) return null;
          const isValidPassword = await bcrypt.compare(password, existingAccount.password!);
          if (isValidPassword) {
            return {
              _id: existingUser._id,
              name: existingUser.username,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } = (await authApi.accounts.getByProvider(
          account.type === "credentials" ? token.email! : account.providerAccountId
        )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },

    async signIn({ user, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;
      const userInfo = {
        username: user.name!.toLowerCase() || "",
        email: user.email! || "",
        image: user.image || "",
      };
      const result = await authApi.oauth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "google",
        providerAccountId: account.providerAccountId!,
      });
      if (!result.ok) return false;
      return result.ok;
    },
  },
});
