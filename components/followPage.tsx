import { BackLink } from '@/components/backLink';
import { getFollowersPage } from '@/lib/storage';
import { Avatar } from '@/components/avatar';
import Link from 'next/link';
import { FollowPage } from '@/lib/types';
import { RadioGroup } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { Page, href } from '@/lib/routes';

export function FollowPage({
  data: { user, accounts },
  mode,
}: {
  data: FollowPage;
  mode: 'followers' | 'following';
}) {
  return (
    <div className='flex w-full flex-col'>
      <BackLink>
        <div className='flex flex-col items-start'>
          <span>{user.name}</span>
          <span className='text-sm leading-none text-neutral-100'>
            @{user.username}
          </span>
        </div>
      </BackLink>
      <div className='flex h-12 w-full'>
        {(
          [
            ['followers', 'Followers'],
            ['following', 'Following'],
          ] as [string, Page][]
        ).map(([slug, title]) => {
          return (
            <Link
              key={slug}
              href={href(title, user.username)}
              className='flex flex-1 items-center justify-center text-sm font-bold text-neutral-100 hover:bg-white/5'
            >
              <div
                className={cn(
                  'flex h-full flex-col justify-center border-y-4 border-t-transparent',
                  mode === slug
                    ? 'border-b-blue-500 text-white'
                    : 'border-b-transparent'
                )}
              >
                {title}
              </div>
            </Link>
          );
        })}
      </div>
      <div className='w-full'>
        {accounts.map((account) => {
          return (
            <Link
              className='flex flex-row items-center justify-start space-x-3 rounded-xl px-4 py-2 hover:bg-white/5'
              key={account.username}
              href={href('Profile', account.username)}
            >
              <Avatar className='h-11 w-11' user={account} />
              <div className='flex flex-col items-start -space-y-0.5'>
                <p className='font-medium capitalize'>{account.name}</p>
                <p className='text-sm text-neutral-100'>@{account.username}</p>
              </div>
            </Link>
          );
        })}
        {accounts.length === 0 && (
          <div className='pl-4 pt-6 font-light'>
            {mode === 'followers' ? 'No followers' : 'No followed accounts'}
          </div>
        )}
      </div>
    </div>
  );
}
