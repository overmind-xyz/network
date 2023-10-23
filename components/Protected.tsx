import { authOptions } from '@/server/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import { prisma } from '@/lib/prisma';
import { Referral } from './Referral';
import { redirect } from 'next/navigation';
import { ServerActionForm } from './serverActionForm';
import {
  getMe,
  onCreateUser,
  setInviteCode,
  setInviteCodeExecute,
} from '@/lib/actions';
import Accounts from './Accounts';
import { LoginPage } from './LoginPage';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createUser } from '@/lib/contract';

export const Protected = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);

  if (!session) return <LoginPage />;

  const r = cookies().get('r');

  let referral = await prisma.referral.findUnique({
    where: {
      referrer_id: session.user.id,
    },
    select: {
      referred_by: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
    },
  });

  if (!referral && r && r.value && r.value !== session.user.username) {
    const referred_by = await prisma.user.findUnique({
      where: {
        username: r.value,
      },
      select: {
        id: true,
        image: true,
        name: true,
        username: true,
      },
    });

    if (referred_by) {
      await setInviteCodeExecute(r.value);
      referral = {
        referred_by: {
          image: referred_by.image,
          name: referred_by.name,
          username: referred_by.username,
        },
      };
    }
  }

  const referrals = await prisma.referral.findMany({
    where: {
      referred_by_id: session.user.id,
    },
    select: {
      referrer: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
    },
  });

  if (
    !session.user.hasCompletedReferral &&
    (!referrals || referrals.length < 2)
  )
    return (
      <Referral
        referral={referral ? referral.referred_by : null}
        referrals={referrals.map((referral) => referral.referrer)}
        id={session.user.id}
        username={session.user.username}
      />
    );

  const me = await getMe();

  if (!me) {
    return (
      <div className='w-full max-w-xs space-y-6 rounded-xl border border-neutral-300 bg-neutral-400 px-6 py-4'>
        <p className='text-2xl font-bold'>Log in to Network</p>

        <ServerActionForm action={onCreateUser}>
          <div className='flex flex-col space-y-3'>
            <p className='text-xs font-bold uppercase text-neutral-100'>
              Create Account
            </p>
            <input
              id='username'
              type='text'
              name='username'
              className='rounded border border-neutral-200 bg-neutral-300 px-3 py-2 text-sm'
              placeholder='Username'
              required
              // placeholder={faker.internet.userName()}
            />
            <input
              id='name'
              type='text'
              name='name'
              className='rounded border border-neutral-200 bg-neutral-300 px-3 py-2 text-sm'
              placeholder='Name'
              required
              // placeholder={faker.person.fullName()}
            />
            <button
              type='submit'
              className='rounded bg-blue-500 py-2.5 text-sm font-medium hover:bg-blue-400'
            >
              Create
            </button>
          </div>
        </ServerActionForm>

        <Accounts />
      </div>
    );
  }

  return <>{children}</>;
};
