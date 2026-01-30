// Clerk handles auth routes automatically at /api/auth/*
// This file can be removed or kept as a placeholder
// Clerk's middleware handles all auth routes

export async function GET() {
  return new Response('Auth routes are handled by Clerk', { status: 404 });
}

export async function POST() {
  return new Response('Auth routes are handled by Clerk', { status: 404 });
}
