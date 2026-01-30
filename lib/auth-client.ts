'use client';

import { useAuth, useUser, useClerk } from '@clerk/nextjs';

// Re-export Clerk hooks for compatibility
export { useAuth, useUser, useClerk };

// Compatibility exports
export const useSession = useAuth;

// Sign in helper
export const signIn = {
  social: ({ provider, callbackURL, newUserCallbackURL }: {
    provider: string;
    callbackURL?: string;
    newUserCallbackURL?: string;
  }) => {
    // This will be handled by the component using useClerk hook
    // Return a function that can be called
    return {
      provider,
      callbackURL: callbackURL || '/dashboard/overview',
      newUserCallbackURL: newUserCallbackURL || '/verify',
    };
  }
};

// Sign out helper
export const signOut = async () => {
  // This will be handled by the component using useClerk hook
  return Promise.resolve();
};
