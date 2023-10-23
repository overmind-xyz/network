import { CopyButton, NewCopyButton } from '@/components/CopyButton';
import { Countdown } from '@/components/CountDown';
import { Wheel } from '@/components/Wheel';
import { authOptions } from '@/server/auth';
import { CheckIcon, TwitterIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Protected } from '@/components/Protected';

export const HOURS_24 = 86400000;

export default async function Spin() {
  const session = await getServerSession(authOptions);

  const availableSpins = await prisma.spin.count({
    where: {
      user_id: session?.user.id,
      has_spun: false,
      tx_hash: null,
    },
  });

  const lastDailyTaskCreatedAt = await prisma.daily_task.findFirst({
    where: {
      user_id: session?.user.id,
      created_at: {
        gte: new Date(new Date().getTime() - HOURS_24),
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

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

  return (
    <Protected>
      <div className='flex h-full w-full flex-col space-y-12'>
        <Wheel availableSpins={availableSpins} />

        <div className='flex grow flex-col items-center space-y-9 border-t border-neutral-300 bg-neutral-400 p-9 font-matter'>
          <div className='flex flex-col space-y-2'>
            <p className='font-cal text-4xl'>How can I get more free spins?</p>
          </div>

          <div className='flex w-full flex-col gap-6 lg:flex-row'>
            <div className='flex w-full items-start justify-center'>
              <div className='flex w-full max-w-sm flex-col items-center justify-center space-y-3 rounded border border-neutral-200 bg-neutral-300 p-6'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white'>
                  1
                </div>
                <div className='flex flex-col items-center justify-center space-y-2 text-center'>
                  <p className='text-3xl'>Daily tasks</p>
                  <p className='text-neutral-100'>
                    Every time you complete your daily task you will earn 1 free
                    spin
                  </p>
                </div>

                {lastDailyTaskCreatedAt && (
                  <div className='py-3'>
                    <div className='flex flex-row items-center justify-center space-x-2 rounded-full bg-red-500/25 px-4 py-2 text-red-500'>
                      <p>Daily tasks reset in</p>
                      <Countdown
                        lastDailyTaskCreatedAt={lastDailyTaskCreatedAt.created_at.toISOString()}
                      />
                    </div>
                  </div>
                )}

                {lastDailyTaskCreatedAt ? (
                  <div className='flex w-full flex-col items-start space-y-4'>
                    <div className='flex flex-row items-center space-x-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700'>
                        <CheckIcon className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p>Post 10 times</p>
                        <p className='text-sm text-neutral-100'>
                          You&apos;ve completed this task today
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-row items-center space-x-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700'>
                        <CheckIcon className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p>Like 10 posts</p>
                        <p className='text-sm text-neutral-100'>
                          You&apos;ve completed this task today
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-row items-center space-x-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700'>
                        <CheckIcon className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p>Receive 10 likes</p>
                        <p className='text-sm text-neutral-100'>
                          You&apos;ve completed this task today
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='flex w-full flex-col items-start space-y-4 pt-3'>
                    <div className='flex flex-row items-center space-x-3'>
                      {todayPostCount >= 10 ? (
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700'>
                          <CheckIcon className='h-4 w-4 text-white' />
                        </div>
                      ) : (
                        <div className='h-6 w-6 rounded-full border-2 border-neutral-100/50'></div>
                      )}

                      <div>
                        <p>Post 10 times</p>
                        <p className='text-sm text-neutral-100'>
                          {todayPostCount >= 10
                            ? `You've completed this task today`
                            : `You've made ${todayPostCount} posts today`}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-row items-center space-x-3'>
                      {todayLikeCount >= 10 ? (
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700'>
                          <CheckIcon className='h-4 w-4 text-white' />
                        </div>
                      ) : (
                        <div className='h-6 w-6 rounded-full border-2 border-neutral-100/50'></div>
                      )}

                      <div>
                        <p>Like 10 posts</p>
                        <p className='text-sm text-neutral-100'>
                          {todayLikeCount >= 10
                            ? `You've completed this task today`
                            : `You've liked ${todayLikeCount} posts today`}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-row items-center space-x-3'>
                      {todayReceivedLikeCount >= 10 ? (
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-700'>
                          <CheckIcon className='h-4 w-4 text-white' />
                        </div>
                      ) : (
                        <div className='h-6 w-6 rounded-full border-2 border-neutral-100/50'></div>
                      )}

                      <div>
                        <p>Receive 10 likes</p>
                        <p className='text-sm text-neutral-100'>
                          {todayReceivedLikeCount >= 10
                            ? `You've completed this task today`
                            : `You've received ${todayReceivedLikeCount} likes
                        today`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='flex w-full items-start justify-center'>
              <div className='flex w-full max-w-sm flex-col items-center justify-center space-y-3 rounded border border-neutral-200 bg-neutral-300 p-6'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white'>
                  2
                </div>
                <div className='flex flex-col items-center justify-center space-y-2 pb-3 text-center'>
                  <p className='text-3xl'>Invite a friend</p>
                  <p className='text-neutral-100'>
                    Every friend that joins with your invite code you will earn
                    1 free spin
                  </p>
                </div>

                <div className='flex w-full flex-col space-y-2 text-left'>
                  <p className='text-sm text-neutral-100'>Invitation code</p>
                  <div className='flex w-full flex-row items-center justify-center'>
                    <input
                      className='h-11 w-full truncate rounded-bl rounded-tl border border-neutral-200 bg-neutral-300 px-4 lowercase outline-0 focus:border-neutral-100'
                      value={session?.user.username}
                      readOnly
                    />
                    <CopyButton copyValue={session?.user.username} />
                  </div>
                </div>

                <div className='flex flex-row items-center justify-center space-x-3 pt-1.5'>
                  <a
                    href={`https://twitter.com/intent/tweet?text=I'm%20trying%20to%20get%20into%20the%20%40overmind_xyz%20network%20--%20sign%20up%20with%20my%20invite%20code%20to%20help%20get%20me%20in!%0A%0Ahttps%3A//network.overmind.xyz/?r=${session?.user.username}`}
                    target='_blank'
                    className='flex flex-row items-center justify-center space-x-2 rounded-full border border-neutral-100/50 bg-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-100/25'
                  >
                    <TwitterIcon className='h-5 w-5' />
                    <p>Post</p>
                  </a>

                  <NewCopyButton
                    copyValue={`https://network.overmind.xyz/?r=${session?.user.username}`}
                  >
                    Copy Link
                  </NewCopyButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}
