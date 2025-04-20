import type { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { AdminUser } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
    } & DefaultSession["user"]
  }
}

async function ensureAdminUserExists(
  email: string,
  name?: string | null,
  image?: string | null
) {
  if (email !== process.env.ADMIN_EMAIL) {
    return;
  }

  const userDocRef = doc(db, "users", email);

  try {
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const newUser: Omit<AdminUser, "id"> = {
        email: email,
        name: name ?? undefined,
        image: image ?? undefined,
        isAdmin: true,
        contributions: [],
        lastLogin: serverTimestamp(),
      };
      await setDoc(userDocRef, newUser);
    } else {
      await setDoc(
        userDocRef,
        {
          lastLogin: serverTimestamp(),
          name: name ?? userDocSnap.data()?.name ?? undefined,
          image: image ?? userDocSnap.data()?.image ?? undefined,
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error ensuring admin user exists in Firestore:", error);
  }
}

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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const userEmail = profile?.email || user?.email;

        if (!userEmail) {
          return "/admin/error?error=EmailNotFound";
        }

        if (userEmail === process.env.ADMIN_EMAIL) {
          await ensureAdminUserExists(
            userEmail,
            profile?.name,
            profile?.image
          );
          return true;
        } else {
          return "/admin/error?error=AccessDenied";
        }
      }

      return "/admin/error?error=InvalidProvider";
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
