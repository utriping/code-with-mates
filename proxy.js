import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function proxy(request) {
  const refreshToken = request.cookies.get("refresh-token")?.value;
  const accessToken = request.cookies.get("access-token")?.value;

  const { pathname } = request.nextUrl;

  // 1️⃣ Public routes (no auth needed)
  const publicRoutes = ["/login", "/sign-up", "/refreshAcessToken"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2️⃣ No access token at all
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3️⃣ Verify access token
  try {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return NextResponse.next();
  } catch (err) {
    // 4️⃣ Access token expired
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      //access token expired but refresh token valid
      //here new access token needs to be issued
      await fetch(new URL("/api/refreshAccessToken", request.url), {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      });
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

// 6️⃣ Protect only specific routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/auth/:path*",
    "/chat/:path*",
  ],
};
