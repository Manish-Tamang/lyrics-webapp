import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const middleware = auth;

export const config = {
    matcher: ["/admin/:path*"],
}; 