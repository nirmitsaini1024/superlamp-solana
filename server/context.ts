import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function createTRPCContext(req: NextRequest) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

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
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export type ProtectedContext = {
  session: NonNullable<Context['session']>
}
