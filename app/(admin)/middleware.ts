import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/login";
  const isAdminErrorPath = pathname.startsWith("/admin/error");

  const session = request.cookies.get("next-auth.session-token")?.value;

  if (isLoginPath || isAdminErrorPath) {
    return NextResponse.next();
  }

  if (isAdminPath) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
