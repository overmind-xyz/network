import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const twitterRouter = createTRPCRouter({
  validateFreeSpinTweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        type: z.enum(['overmind', 'jacob']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.type === 'overmind' && ctx.session.user.hasClaimedFreeSpin) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You have already claimed your free spin',
          });
        }

        if (
          input.type === 'jacob' &&
          ctx.session.user.hasClaimedFreeSpinJacob
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You have already claimed your free spin',
          });
        }

        const tw = await ctx.db.account.findFirst({
          where: { provider: 'twitter', userId: ctx.session.user.id },
          select: {
            id: true,
            refresh_token: true,
            access_token: true,
          },
        });

        if (!tw || !tw?.access_token || !tw?.refresh_token) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Twitter credentials',
          });
        }

        // console.log(tw.refresh_token);

        // Get new tokens
        const data = await (
          await fetch('https://api.twitter.com/2/oauth2/token', {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization:
                'Basic ' +
                Buffer.from(
                  `${process.env.TWITTER_ID}:${process.env.TWITTER_SECRET}`
                ).toString('base64'),
            },
            body: new URLSearchParams({
              client_id: process.env.TWITTER_ID!,
              grant_type: 'refresh_token',
              refresh_token: tw.refresh_token,
            }),
            method: 'POST',
          })
        ).json();

        // console.log(data);

        if (!data.access_token || !data.refresh_token) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Failed to refresh token.',
          });
        }

        await ctx.db.account.update({
          where: { id: tw.id },
          data: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          },
        });

        // Look up passed tweet ID
        const tweet = await (
          await fetch(
            `https://api.twitter.com/2/tweets/${input.tweetId}?expansions=author_id`,
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
              method: 'GET',
            }
          )
        ).json();

        // console.log(tweet.includes.users[0].username);

        if (
          !tweet ||
          !tweet.data ||
          !tweet.data.text ||
          !tweet.includes ||
          !tweet.includes.users ||
          !tweet.includes.users[0] ||
          !tweet.includes.users[0].username
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Failed to fetch tweet, rate limit by Twitter',
          });
        }

        if (tweet.includes.users[0].username !== ctx.session.user.username) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Tweet not posted by logged in account',
          });
        }

        if (input.type === 'overmind') {
          if (
            !tweet.data.text.includes('#NetworkFreeSpin') ||
            !tweet.data.text.includes('@overmind_xyz')
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Incorrect post, you must include all items provided',
            });
          }

          await ctx.db.$transaction([
            ctx.db.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                hasClaimedFreeSpin: true,
              },
            }),
            ctx.db.spin.create({
              data: {
                user_id: ctx.session.user.id,
              },
            }),
          ]);
        }

        if (input.type === 'jacob') {
          if (
            !tweet.data.text.includes('#NetworkFreeSpin') ||
            !tweet.data.text.includes('@JacobADevore')
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Incorrect post, you must include all items provided',
            });
          }

          await ctx.db.$transaction([
            ctx.db.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                hasClaimedFreeSpinJacob: true,
              },
            }),
            ctx.db.spin.create({
              data: {
                user_id: ctx.session.user.id,
              },
            }),
          ]);
        }
      } catch (e: any) {
        console.log(e);
        if (JSON.stringify(e).includes('TRPCError') && e.message) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: e?.message,
          });
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Error validating tweet, please try again later',
        });
      }
    }),
});
