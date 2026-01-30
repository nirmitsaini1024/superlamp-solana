import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/signin(.*)',
  '/api/auth(.*)',
  '/api/v1(.*)', // API routes - adjust if you need auth on these
  '/api/helius(.*)', // Helius webhook endpoint
  '/api/uploadthing(.*)', // UploadThing routes
  '/api/trpc(.*)', // tRPC routes
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // Public routes - allow access
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protected routes - redirect to signin if not authenticated
  if (!userId && (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding') || pathname.startsWith('/verify'))) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users from root to dashboard
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }

  return NextResponse.next();
});

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

