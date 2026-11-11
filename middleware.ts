import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

async function readAdminToken(request: NextRequest) {
  // Auth.js sets `__Secure-authjs.session-token` when the public URL is HTTPS.
  // On Vercel, request.nextUrl.protocol can be http behind the proxy, so do not
  // rely on it alone — otherwise getToken looks for the wrong cookie name.
  const secureCookie =
    process.env.AUTH_URL?.startsWith("https://") === true ||
    process.env.NODE_ENV === "production";

  return getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname.startsWith("/admin/login")) {
    const token = await readAdminToken(request);
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const token = await readAdminToken(request);

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
