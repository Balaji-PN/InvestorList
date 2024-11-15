import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require subscription
const PROTECTED_ROUTES = ["/investors", "/dashboard"];

// Routes that require authentication but not subscription
const AUTH_REQUIRED_ROUTES = [...PROTECTED_ROUTES, "/subscription"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/signin" || path === "/" || path === "/api/check-subscription";
  const isAuthPath = path.startsWith("/api/auth");
  const isPaymentPath =
    path.startsWith("/api/create-order") ||
    path.startsWith("/api/verify-payment") ||
    path.startsWith("/api/check-subscription");
  const isPublicFile = path.match(/(\.ico|\.svg|\.png|\.jpg|\.jpeg)$/);
  const isNextInternal = path.includes("/_next/");

  // Skip middleware for public paths
  if (
    isPublicPath ||
    isAuthPath ||
    isPaymentPath ||
    isPublicFile ||
    isNextInternal
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to signin if no token found
  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check subscription for protected routes
  if (PROTECTED_ROUTES.includes(path)) {
    try {
      const baseUrl = request.nextUrl.origin;
      const subscriptionCheck = await fetch(
        `${baseUrl}/api/check-subscription`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await subscriptionCheck.json();
      console.log("Middleware subscription check:", data);

      if (!data.isValid) {
        return NextResponse.redirect(new URL("/subscription", request.url));
      }
    } catch (error) {
      console.error("Middleware subscription check error:", error);
      return NextResponse.redirect(new URL("/subscription", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
