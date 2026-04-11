import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  // Match next-auth's secureCookie logic: based on NEXTAUTH_URL, not VERCEL env var
  const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, secureCookie });

  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/profile/:path*"],
};
