// Clerk handles auth routes automatically at /api/auth/*
// Use Clerk's handleAuth helper to properly handle all auth routes
import { handleAuth } from '@clerk/nextjs/server';

export const { GET, POST } = handleAuth();
