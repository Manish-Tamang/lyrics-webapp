import { NextResponse } from "next/server"
import getServerSession from "next-auth"
import { authOptions } from "@/lib/auth"

export async function middleware(request: Request) {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

  // Allow access to login page
  if (request.url.includes("/login")) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated or not admin
  if (!session || !isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Apply middleware to all admin routes except login
export const config = {
  matcher: [
    "/admin/:path*",
    "!/(admin)/login/:path*"
  ]
} 