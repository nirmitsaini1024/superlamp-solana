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
  try {
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
  } catch (error) {
    console.error("Clerk middleware error:", error);
    // For static files or routes that don't need auth, just continue
    const { pathname } = request.nextUrl;
    if (pathname === '/' || pathname.startsWith('/_next') || pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)) {
      return NextResponse.next();
    }
    // For other errors, return a 500 response
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
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

