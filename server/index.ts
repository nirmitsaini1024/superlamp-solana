// server/_app.ts
import { projectRouter } from './router/project';
import { webhookRouter } from './router/webhook';
import { userRouter } from './router/user';
import { router, publicProcedure} from './trpc';
import { apiTokenRouter } from './router/apiToken';
import { eventRouter } from './router/event';
import { analyticsRouter } from './router/analytics';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "ok"),
  webhook: webhookRouter,
  project: projectRouter,
  user: userRouter,
  apiToken:apiTokenRouter,
  event:eventRouter,
  analytics: analyticsRouter
});

export type AppRouter = typeof appRouter;
