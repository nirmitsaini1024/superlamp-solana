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
  const { pathname } = request.nextUrl;
  
  // Skip auth() call for static files to avoid headers() errors
  const isStaticFile = pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/i) || 
                       pathname.startsWith('/_next/static') || 
                       pathname.startsWith('/_next/image');
  
  if (isStaticFile) {
    return NextResponse.next();
  }

  try {
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
  } catch (error) {
    console.error("Clerk middleware error:", error);
    // For errors, allow static files and root to continue
    if (pathname === '/' || pathname.startsWith('/_next') || pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)) {
      return NextResponse.next();
    }
    // For other errors, return a 500 response
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
});

export const config = {
  matcher: [
    // Clerk's recommended pattern for Next.js 16
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

