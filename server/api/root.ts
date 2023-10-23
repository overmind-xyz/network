import { spinRouter } from '@/server/api/routers/spin';
import { createTRPCRouter } from '@/server/api/trpc';
import { twitterRouter } from './routers/twitter';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spin: spinRouter,
  twitter: twitterRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
