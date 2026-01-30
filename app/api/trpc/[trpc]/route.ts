// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/index';
import { createTRPCContext } from '@/server/context';
import { NextRequest } from 'next/server';

// Create a standard Request with plain Headers - fixes "init.headers is a symbol"
// error when NextRequest internals conflict with Clerk/tRPC in Turbopack
function toStandardRequest(req: NextRequest): Request {
  const headers = new Headers();
  req.headers.forEach((value, key) => headers.set(key, value));
  return new Request(req.url, {
    method: req.method,
    headers,
    body: req.body,
    duplex: 'half',
  } as RequestInit & { duplex?: 'half' });
}

const handler = (req: NextRequest) => {
  const standardReq = toStandardRequest(req);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: standardReq,
    router: appRouter,
    createContext: () => createTRPCContext(),
    onError: ({ error, path }) => {
      console.error(`[tRPC] Error on ${path}:`, error);
    },
  });
};

// Support both GET and POST requests
export { handler as GET, handler as POST };
