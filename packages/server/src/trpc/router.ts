import { router } from './trpc';
import { authRouter } from './routers/auth';
import { schedulesRouter } from './routers/schedules';
import { quickLinksRouter } from './routers/quicklinks';

export const appRouter = router({
  auth: authRouter,
  schedules: schedulesRouter,
  quicklinks: quickLinksRouter,
});

export type AppRouter = typeof appRouter;

