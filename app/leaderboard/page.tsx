import { Protected } from '@/components/Protected';
import { prisma } from '@/lib/prisma';
import { GiftIcon } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 60; // revalidate every 60 seconds

type LeaderboardUserType = {
  amount: number;
  user: { id: string; name: string; username: string; image: string | null };
};

export default async function LeaderBoard() {
  const groupByReferredById = await prisma.referral.groupBy({
    by: ['referred_by_id'],
    where: {
      created_at: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    _count: {
      referred_by_id: true,
    },
    orderBy: {
      _count: {
        referred_by_id: 'desc',
      },
    },
    take: 25,
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: groupByReferredById.map((groupUser) => groupUser.referred_by_id),
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  });

  let data: LeaderboardUserType[] = [];

  for (let i = 0; i < groupByReferredById.length; i++) {
    const user = users.find(
      (user) => user.id === groupByReferredById[i].referred_by_id
    );

    if (!user) continue;

    data.push({
      amount: groupByReferredById[i]._count.referred_by_id,
      user,
    });
  }

  return (
    <Protected>
      <div className='flex flex-col gap-6 p-6'>
        <div className='flex w-full flex-row items-center space-x-6 rounded-xl border border-green-500/20 bg-green-500/10 px-6 py-4 text-green-500'>
          <GiftIcon className='h-9 w-9 shrink-0' />
          <div className='flex flex-col space-y-0.5'>
            <p className='text-lg font-medium'>
              Free spins will be randomly <b>airdropped</b> to users on the
              daily leaderboards!
            </p>
            <p className='text-green-500'>
              Invite friends to get on the daily leaderboard!
            </p>
          </div>
        </div>

        <div className='flex w-full flex-col items-center justify-center space-y-6'>
          <div className='flex flex-col items-center space-y-3 text-center'>
            <p className='font-cal text-5xl'>Daily Leaderboards</p>
            <div className='text-neutral-100'>
              <p>Updated every 60 seconds</p>
              <p>Only invites within the past 24 hours are counted</p>
            </div>
          </div>
          <div className='flex w-full max-w-lg flex-col gap-3'>
            {data.map((data) => (
              <LeaderboardUser
                key={data.user.id}
                amount={data.amount}
                user={data.user}
              />
            ))}
          </div>
        </div>
      </div>
    </Protected>
  );
}

function LeaderboardUser({ amount, user }: LeaderboardUserType) {
  return (
    <div className='flex w-full flex-row items-center justify-between rounded border border-neutral-200 bg-neutral-300 px-3 py-3'>
      <a
        target='_blank'
        href={`https://network.overmind.xyz/@${user.username}`}
        className='flex flex-row items-center justify-center gap-3'
      >
        <Image
          className='rounded-full'
          src={user.image?.replace('_normal', '') || 'https://picsum.photos/50'}
          alt='demo profile pic'
          width='50'
          height='50'
        />

        <div className='flex flex-col'>
          <div className='flex w-full flex-col items-start justify-start'>
            <span>{user.name}</span>
            <div className='flex flex-row gap-1 text-sm text-neutral-100'>
              <span>@{user.username}</span>
            </div>
          </div>
        </div>
      </a>

      <p className='text-sm text-neutral-100'>
        Invited{' '}
        <span className='px-1 text-xl font-bold text-white'>{amount}</span>{' '}
        users
      </p>
    </div>
  );
}
