import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from 'better-auth/cookies'

export async function proxy(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/api'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding', '/verify'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // If user is not authenticated and trying to access protected routes
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  
  
  // If user is authenticated and trying to access root, redirect to dashboard
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
