import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect multiple routes including homepage
  if (
    (req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/orders") ||
      req.nextUrl.pathname.startsWith("/earnings") ||
      req.nextUrl.pathname.startsWith("/notifications")) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/orders/:path*",
    "/earnings/:path*",
    "/notifications/:path*",
  ],
};
