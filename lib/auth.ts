import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";
import { User } from "next-auth";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }: { user: User }) {
            if (!user.email) return false;
            return user.email === process.env.ADMIN_EMAIL;
        },
        async session({ session }: { session: Session }) {
            return session;
        },
        async authorized({ request, auth }: { request: any; auth: any }) {
            const path = request.nextUrl.pathname;
            if (path === "/admin/login" || path === "/admin/error") return true;
            return auth?.user?.email === process.env.ADMIN_EMAIL;
        },
    },
    pages: {
        signIn: "/admin/login",
        error: "/admin/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies Parameters<typeof NextAuth>[0]; 