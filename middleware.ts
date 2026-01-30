import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/signin(.*)',
  '/api/auth(.*)',
  '/api/v1(.*)',
  '/api/helius(.*)',
  '/api/uploadthing(.*)',
  '/api/trpc(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  
  const { userId } = await auth();

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
    // Clerk's recommended pattern for App Router
    '/((?!.*\\..*|_next).*)',
    '/(api|trpc)(.*)',
  ],
};

