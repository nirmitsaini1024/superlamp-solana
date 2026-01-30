'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SessionProvider } from '@/components/providers/session-provider';
import { ViewTransition } from 'react';
import type { ExtendedSession } from '@/components/providers/session-provider';

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId || !user) {
      router.replace('/signin');
    }
  }, [isLoaded, userId, user, router]);

  if (!isLoaded || !userId || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const session: ExtendedSession = {
    user: {
      id: user.id,
      name: user.fullName || user.firstName || user.username || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      emailVerified: user.emailAddresses[0]?.verification?.status === 'verified',
      image: user.imageUrl,
      walletAddress: (user.publicMetadata?.walletAddress as string) || null,
      verifiedAt: (user.publicMetadata?.verifiedAt as string) || null,
    },
    session: {
      id: user.id,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(),
    },
  };

  return (
    <ViewTransition>
      <SessionProvider session={session}>
        <SidebarProvider>
          <AppSidebar user={session.user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </ViewTransition>
  );
}
