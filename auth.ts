import NextAuth from "next-auth";

import Google from "next-auth/providers/google";
import { authApi } from "./lib/authapi";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
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
