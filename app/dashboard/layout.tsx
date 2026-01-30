// Force dynamic rendering - required because this layout uses Clerk's auth()
// which calls headers() and cannot be statically generated
export const dynamic = "force-dynamic";

import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SessionProvider } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";
import { ViewTransition } from "react";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      redirect('/signin');
    }

    const user = await currentUser();
    
    if (!user) {
      redirect('/signin');
    }

  // Transform Clerk user to match your session format
  const session = {
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
    }
  };

  return (
    <ViewTransition>
      <SessionProvider session={session}>
        <SidebarProvider>
          <AppSidebar user={session.user as any} />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </ViewTransition>
  );
  } catch (error) {
    console.error("Error in dashboard layout:", error);
    redirect('/signin');
  }
}
