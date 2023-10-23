import { HOURS_24 } from '@/app/spin/page';
import { prisma } from '@/lib/prisma';
import { AptosAccount } from 'aptos';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { authOptions } from '../server/auth';
import { createUser as createContractUser } from './contract';
import { createUser, follow, likePost, unfollow, unlikePost } from './storage';
import { ServerAction, User } from './types';
import {
  addressSchema,
  followSchema,
  newLikeSchema,
  newUserSchema,
} from './zod';
import { isStaff, stripUsername } from './utils';

export function extractError(e: unknown): string {
  console.error(e);

  const typed = e as unknown as { message: string };
  let message = 'An unknown error occurred';

  if (typed.message.includes('EUsernameAlreadyRegistered')) {
    message = 'Username is already registered.';
  }

  if (typed.message.includes('EUserFollowsUser')) {
    message = 'You already follow this user.';
  }

  if (typed.message.includes('ETooFast')) {
    message =
      'You are posting too frequently. Please wait a few minutes before posting again.';
  }

  return message;
}

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getMe(): Promise<User | undefined> {
  const session = await getServerSession(authOptions);

  return session
    ? {
        username: session.user.username,
        name: session.user.name,
        imgSrc: session.user.image.replace('_normal', ''),
        privateKey: session.user.privateKey,
      }
    : undefined;
}

export const onFollow: ServerAction = async (prevState, formData) => {
  'use server';

  const me = await getMe();
  const username = formData.get('username');

  if (!username || !me) {
    return;
  }

  const newFollow = followSchema.parse({
    username: formData.get('username'),
  });

  try {
    await follow(me, newFollow.username);

    revalidatePath('/');
    revalidatePath(`/@${newFollow.username}`);

    return { isSuccess: true };
  } catch (e) {
    return { isError: true, message: extractError(e), errors: [e] };
  }
};

export const onUnfollow: ServerAction = async (prevState, formData) => {
  'use server';

  const me = await getMe();
  const username = formData.get('username');

  if (!username || !me) {
    return;
  }

  const newUnfollow = followSchema.parse({
    username: formData.get('username'),
  });

  try {
    await unfollow(me, newUnfollow.username);

    revalidatePath('/');
    revalidatePath(`/@${newUnfollow.username}`);
    return { isSuccess: true };
  } catch (e) {
    return { isError: true, message: extractError(e), errors: [e] };
  }
};

export const onLikePost: ServerAction = async (prevState, formData) => {
  'use server';

  const me = await getMe();
  const postId = formData.get('postId');

  if (!postId || !me) {
    return;
  }

  const newLike = newLikeSchema.parse({
    postId: parseInt(postId as string, 10),
    postUsername: formData.get('postUsername'),
  });

  try {
    await likePost(me, newLike.postId, newLike.postUsername);

    revalidatePath('/');
    revalidatePath(`/@${newLike.postUsername}`);
    revalidatePath(`/@${newLike.postUsername}/status/${newLike.postId}`);
    return { isSuccess: true };
  } catch (e) {
    return { isError: true, message: extractError(e), errors: [] };
  }
};

export const onUnlikePost: ServerAction = async (prevState, formData) => {
  'use server';

  const me = await getMe();
  const postId = formData.get('postId');

  if (!postId || !me) {
    return;
  }

  const newUnLike = newLikeSchema.parse({
    postId: parseInt(postId as string, 10),
    postUsername: formData.get('postUsername'),
  });

  try {
    await unlikePost(me, newUnLike.postId, newUnLike.postUsername);

    revalidatePath('/');
    revalidatePath(`/@${newUnLike.postUsername}`);
    revalidatePath(`/@${newUnLike.postUsername}/status/${newUnLike.postId}`);
    return { isSuccess: true };
  } catch (e) {
    console.error(e);
    return { isError: true, message: extractError(e), errors: [] };
  }
};

export const logout = async () => {
  'use server';

  cookies().delete('user');
};

export const onCreateUser: ServerAction = async (prevState, formData) => {
  'use server';

  const validated = newUserSchema.parse({
    username: formData.get('username'),
    name: formData.get('name'),
  });

  try {
    const wallet = new AptosAccount();
    const privateKey = wallet.toPrivateKeyObject().privateKeyHex;

    const newUser = {
      ...validated,
      privateKey,
    };

    await createUser(newUser);

    cookies().set('user', JSON.stringify(newUser));
    return { isSuccess: true };
  } catch (e) {
    console.error(e);
    return { isError: true, message: extractError(e), errors: [e] };
  }

  // if (
  //   process.env.NEXT_PUBLIC_APTOS_NODE_URL &&
  //   process.env.NEXT_PUBLIC_APTOS_FAUCET_URL
  // ) {
  //   const faucet = new FaucetClient(
  //     process.env.NEXT_PUBLIC_APTOS_NODE_URL,
  //     process.env.NEXT_PUBLIC_APTOS_FAUCET_URL
  //   );
  //   await faucet.fundAccount(wallet.address(), 100000000);
  // }
};

export const onSubmitAddress: ServerAction = async (_, formData: FormData) => {
  'use server';

  const me = await getMe();

  const validated = addressSchema.parse({
    address: formData.get('address'),
  });

  if (!me) {
    return { isError: true };
  }

  await prisma.user.update({
    where: {
      username: me.username,
    },
    data: {
      withdrawAddress: validated.address,
    },
  });

  return { isSuccess: true };
};

const setInviteCodeSchema = z.object({
  inviteCode: z.string(),
});

export const setInviteCode: ServerAction = async (_, formData: FormData) => {
  'use server';

  const inviteCode = setInviteCodeSchema.parse({
    inviteCode: formData.get('inviteCode'),
  });

  return setInviteCodeExecute(inviteCode.inviteCode);
};

export const setInviteCodeExecute = async (inviteCode: string) => {
  'use server';

  try {
    const session = await getSession();

    if (!session) return { errorMessage: 'Invalid session' };

    if (inviteCode === session.user.username)
      return { errorMessage: 'You cannot invite yourself' };

    const referrer = await prisma.user.findUnique({
      where: {
        username: inviteCode,
      },
      select: {
        id: true,
        hasCompletedReferral: true,
      },
    });

    if (!referrer) return { errorMessage: 'Invalid code' };

    let transactions: any = [];

    transactions.push(
      prisma.referral.create({
        data: {
          referrer_id: session.user.id,
          referred_by_id: referrer.id,
        },
      })
    );

    const referrerReferralCount = await prisma.referral.count({
      where: {
        referred_by_id: referrer.id,
      },
    });

    if (!referrer.hasCompletedReferral && referrerReferralCount + 1 >= 2) {
      transactions.push(
        prisma.user.update({
          where: {
            username: inviteCode,
          },
          data: {
            hasCompletedReferral: true,
          },
        })
      );

      transactions.push(
        prisma.spin.create({
          data: {
            user_id: referrer.id,
          },
        })
      );
    }

    if (referrer.hasCompletedReferral) {
      transactions.push(
        prisma.spin.create({
          data: {
            user_id: referrer.id,
          },
        })
      );
    }

    await prisma.$transaction(transactions);

    revalidatePath('/');

    return { isSuccess: true };
  } catch (e) {
    return { isError: true };
  }
};

export const createOnChainUserIfTheyDoNotExist = async () => {
  'use server';

  try {
    const session = await getSession();

    if (!session) return { errorMessage: 'Invalid session' };

    const user = await prisma.user.findUnique({
      where: {
        username: session.user.username,
      },
    });

    if (!user) return { errorMessage: 'Invalid user' };

    if (!user.is_created && user.hasCompletedReferral) {
      await createContractUser({
        username: user.username,
        name: user.name,
        privateKey: user.privateKey,
        imgSrc: user.image?.replace('_normal', ''),
      });

      await prisma.user.update({
        where: {
          username: session.user.username,
        },
        data: {
          is_created: true,
        },
      });
    }

    return { isSuccess: true };
  } catch (e) {
    return { isError: true, message: extractError(e), errors: [e] };
  }
};

export const rewardSpinIfDailyTaskComplete = async () => {
  'use server';

  try {
    const session = await getSession();

    if (!session) return { errorMessage: 'Invalid session' };

    const lastDailyTaskCreatedAt = await prisma.daily_task.findFirst({
      where: {
        user_id: session?.user.id,
        created_at: {
          gte: new Date(new Date().getTime() - HOURS_24),
        },
      },
    });

    if (lastDailyTaskCreatedAt) return;

    const todayPostCount = await prisma.post.count({
      where: {
        user_id: session?.user.id,
        created_at: {
          gte: new Date(new Date().getTime() - HOURS_24),
        },
      },
    });

    const todayLikeCount = await prisma.like.count({
      where: {
        sender_id: session?.user.id,
        created_at: {
          gte: new Date(new Date().getTime() - HOURS_24),
        },
      },
    });

    const todayReceivedLikeCount = await prisma.like.count({
      where: {
        recipient_id: session?.user.id,
        created_at: {
          gte: new Date(new Date().getTime() - HOURS_24),
        },
      },
    });

    if (
      todayPostCount < 10 ||
      todayLikeCount < 10 ||
      todayReceivedLikeCount < 10
    )
      return;

    await prisma.$transaction([
      prisma.daily_task.create({
        data: {
          user_id: session.user.id,
        },
      }),
      prisma.spin.create({
        data: {
          user_id: session.user.id,
        },
      }),
    ]);

    return { isSuccess: true };
  } catch (e) {
    return;
  }
};
