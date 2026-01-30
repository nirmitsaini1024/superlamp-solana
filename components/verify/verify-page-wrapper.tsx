'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import VerifyWalletPage from '@/components/verify-client-component';

export function VerifyPageWrapper() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId || !user) {
      router.replace('/signin');
      return;
    }
    const walletAddress = user.publicMetadata?.walletAddress as string | undefined;
    if (walletAddress) {
      router.replace('/onboarding');
    }
  }, [isLoaded, userId, user, router]);

  if (!isLoaded || !userId || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const walletAddress = user.publicMetadata?.walletAddress as string | undefined;
  if (walletAddress) {
    return null; // Redirecting to onboarding
  }

  return <VerifyWalletPage />;
}
