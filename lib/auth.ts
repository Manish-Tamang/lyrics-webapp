import type { NextAuthOptions, User, Account, Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/admin/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }): Promise<boolean | string> {
      if (account?.provider === "google") {
        const userEmail = profile?.email || user?.email;
        if (userEmail === process.env.ADMIN_EMAIL) {
          console.log(`Admin login successful for: ${userEmail}`);
          return true;
        } else {
          console.warn(
            `Non-admin Google login attempt denied for: ${userEmail}`
          );
          return "/admin/error?error=AccessDenied";
        }
      }
      console.warn(`Sign-in attempt denied for provider: ${account?.provider}`);
      return "/admin/error?error=InvalidProvider";
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User | null;
    }): Promise<JWT> {
      if (user) {
        token.email = user.email;
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: any;
      token: JWT;
    }): Promise<any> {
      if (token) {
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
