import { createTRPCRouter, staffProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  ban: staffProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        where: { username: input.username },
        data: {
          is_banned: true,
        },
      });
    }),

  unban: staffProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        where: { username: input.username },
        data: {
          is_banned: false,
        },
      });
    }),
});
