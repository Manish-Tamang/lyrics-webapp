// middleware.ts
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const { auth } = NextAuth(authOptions);

export default auth;

// Apply middleware to ALL routes starting with /admin/
export const config = {
    matcher: ["/admin/:path*"],
};