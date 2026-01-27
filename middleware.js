import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function middleware(request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access-token")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;

  const { pathname } = request.nextUrl;

  // 1️⃣ Public routes (no auth needed)
  const publicRoutes = ["/login", "/sign-up", "/refreshAcessToken"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2️⃣ No access token at all
  if (!accessToken) {
    // refresh token exists → client will call refresh
    if (refreshToken) {
      return NextResponse.next();
    }

    // no tokens → redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3️⃣ Verify access token
  try {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return NextResponse.next();
  } catch (err) {
    // 4️⃣ Access token expired
    if (err.name === "TokenExpiredError" && refreshToken) {
      return NextResponse.next();
    }

    // 5️⃣ Invalid token → force login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// 6️⃣ Protect only specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/auth/:path*", "/chat/:path*"],
};
