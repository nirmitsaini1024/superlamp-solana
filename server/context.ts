import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/db';

export async function createTRPCContext() {
  try {
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    if (user) {
      // Sync Clerk user to Prisma (required for project.create, etc.)
      await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          name: user.fullName || user.firstName || user.username || 'User',
          email: user.emailAddresses[0]?.emailAddress || `${user.id}@clerk.user`,
          emailVerified: user.emailAddresses[0]?.verification?.status === 'verified',
          image: user.imageUrl,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(),
          walletAddress: (user.publicMetadata?.walletAddress as string) || null,
          verifiedAt: null, // Updated via confirmWallet
        },
        update: { updatedAt: new Date() },
      });
    }

    // Transform Clerk user to match your expected session format
    const session = user ? {
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
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(),
      }
    } : null;

    return { session };
  } catch (error) {
    console.error("[tRPC] Context auth error:", error);
    // Return null session on error
    return { session: null };
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export type ProtectedContext = {
  session: NonNullable<Context['session']>
}
