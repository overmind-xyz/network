import { generateFloats } from '@/lib/rng';
import { addressSchema } from '@/lib/zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import cuid2 from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const spinRouter = createTRPCRouter({
  demoSpin: protectedProcedure.mutation(async ({ ctx }) => {
    const newResult = generateFloats({
      serverSeed: cuid2.createId(),
      clientSeed: ctx.session.user.id,
      nonce: 0,
      roll: 0,
      count: 1,
    });

    const result = Math.floor(newResult[0]! * 10000001) / 10000000;

    let prize = 0;
    let roll = 1;

    if (result < 0.5) {
      prize = 0;

      const zeroPositions = [1, 3, 5, 7, 9, 11, 13];

      roll =
        zeroPositions[Math.floor(newResult[0]! * zeroPositions.length + 1)];
    } else if (result < 0.9449) {
      prize = 1;
      roll = 14;
    } else if (result < 0.9949) {
      prize = 10;
      roll = 2;
    } else if (result < 0.999) {
      prize = 100;
      roll = 6;
    } else if (result < 0.9999) {
      prize = 1000;
      roll = 10;
    } else if (result < 0.999999) {
      prize = 10000;
      roll = 8;
    } else if (result < 0.9999999) {
      prize = 100000;
      roll = 12;
    } else if (result < 0.99999999) {
      prize = 500000;
      roll = 4;
    } else {
      prize = 1000000;
      roll = 0;
    }

    return { roll, prize };
  }),
  spin: protectedProcedure.mutation(async ({ ctx }) => {
    const spin = await ctx.db.spin.findFirst({
      where: {
        user_id: ctx.session.user.id,
        has_spun: false,
        tx_hash: null,
      },
    });

    if (!spin) {
      throw new Error('No spin available');
    }

    const newResult = generateFloats({
      serverSeed: spin.id,
      clientSeed: ctx.session.user.id,
      nonce: 0,
      roll: 0,
      count: 1,
    });

    const result = Math.floor(newResult[0]! * 10000001) / 10000000;

    let prize = 0;
    let roll = 1;

    if (result < 0.5) {
      prize = 0;

      const zeroPositions = [1, 3, 5, 7, 9, 11, 13];

      roll =
        zeroPositions[Math.floor(newResult[0]! * zeroPositions.length + 1)];
    } else if (result < 0.9449) {
      prize = 1;
      roll = 14;
    } else if (result < 0.9949) {
      prize = 10;
      roll = 2;
    } else if (result < 0.999) {
      prize = 100;
      roll = 6;
    } else if (result < 0.9999) {
      prize = 1000;
      roll = 10;
    } else if (result < 0.999999) {
      prize = 10000;
      roll = 8;
    } else if (result < 0.9999999) {
      prize = 100000;
      roll = 12;
    } else if (result < 0.99999999) {
      prize = 500000;
      roll = 4;
    } else {
      prize = 1000000;
      roll = 0;
    }

    await ctx.db.spin.update({
      where: {
        id: spin.id,
      },
      data: {
        has_spun: true,
        spun_at: new Date(),
        prize,
      },
    });

    return {
      roll,
      prize,
      hasWithdrawAddress: !!ctx.session.user.withdrawAddress,
    };
  }),

  setWithdrawAddress: protectedProcedure
    .input(addressSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          username: ctx.session.user.username,
        },
        data: {
          withdrawAddress: input.address,
        },
      });

      return { isSuccess: true };
    }),

  exchange: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const spin = await ctx.db.spin.findUnique({
        where: {
          id: input.id,
          user_id: ctx.session.user.id,
          has_exchanged: false,
          prize: 1,
        },
      });

      if (!spin) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Spin not exchangeable',
        });
      }

      await ctx.db.$transaction([
        ctx.db.spin.update({
          where: {
            id: input.id,
          },
          data: {
            has_exchanged: true,
          },
        }),
        ctx.db.spin.create({
          data: {
            user_id: ctx.session.user.id,
          },
        }),
      ]);

      return { isSuccess: true };
    }),
});
