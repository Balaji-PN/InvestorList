import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/signin';
  const isAuthPath = path.startsWith('/api/auth');
  const isPublicFile = path.match(/(\.ico|\.svg|\.png|\.jpg|\.jpeg)$/);
  const isNextInternal = path.includes('/_next/');
  
  // Skip middleware for public paths
  if (isPublicPath || isAuthPath || isPublicFile || isNextInternal) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to signin if no token found
  if (!token) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
