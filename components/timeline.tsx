'use client';

import { BackLink } from '@/components/backLink';
import { getFollowersPage } from '@/lib/storage';
import { Avatar } from '@/components/avatar';
import Link from 'next/link';
import { FollowPage, Post, ServerAction } from '@/lib/types';
import { RadioGroup, Tab } from '@headlessui/react';
import { cn, feedReconciler } from '@/lib/utils';
import { Feed } from './feed';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ServerActionForm } from './serverActionForm';
import Compose from './compose';
import { usePathname } from 'next/navigation';
import { useFeed, useReconcilePosts } from '@/hooks/useFeed';
import { Button } from './ui/button';

const GLOBAL = 0;
const FOLLOWING = 1;

type GetTimeline = (_?: number) => Promise<Post[]>;

export function Timeline({
  getGlobalTimeline,
  getFollowingTimeline,
  onCreatePost,
  onRefresh,
  initialGlobal,
  initialFollowing,
}: {
  getGlobalTimeline: GetTimeline;
  getFollowingTimeline: GetTimeline;
  initialGlobal: Post[];
  initialFollowing: Post[];
  onCreatePost: ServerAction;
  onRefresh: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [tab, setTab] = useState(GLOBAL);

  const reconcile = useReconcilePosts();

  const globalFeed = useFeed(initialGlobal, getGlobalTimeline, reconcile);
  const followingFeed = useFeed(
    initialFollowing,
    getFollowingTimeline,
    reconcile
  );

  // const [isReloading, setIsReloading] = useState(false);

  // useEffect(() => {
  //   if (
  //     (tab === GLOBAL && initialGlobal.length > 0) ||
  //     initialFollowing.length > 0
  //   ) {
  //     setIsReloading(false);
  //   }
  // }, [initialFollowing.length, initialGlobal.length, tab]);

  return (
    <div className={cn('w-full', pathname !== '/' ? 'hidden' : 'flex')}>
      <Tab.Group selectedIndex={tab} onChange={setTab}>
        <div
          className={cn(
            'fixed left-16 right-0 top-0 z-10 flex h-32 flex-col bg-neutral-600/60 backdrop-blur-md md:left-72 md:top-16'
          )}
        >
          <div className='flex items-center justify-center border-b border-b-gray-900/50 px-4'>
            <ServerActionForm
              className='flex h-20 w-full items-center'
              action={onCreatePost}
            >
              <Compose placeholder="What's happening?" />
            </ServerActionForm>
          </div>
          <Tab.List className='flex w-full flex-1'>
            <Tab className='flex min-w-[150px] flex-1 items-center justify-center text-sm font-bold text-neutral-100 !outline-none transition-colors hover:bg-white/5'>
              <div
                className={cn(
                  'flex h-full w-full flex-col justify-center border-b-2',
                  tab === GLOBAL
                    ? 'border-b-blue-500 text-white'
                    : 'border-b-transparent'
                )}
              >
                All
              </div>
            </Tab>
            <Tab className='flex min-w-[150px] flex-1 items-center justify-center text-sm font-bold text-neutral-100 !outline-none transition-colors hover:bg-white/5'>
              <div
                className={cn(
                  'flex h-full w-full flex-col justify-center border-b-2',
                  tab === FOLLOWING
                    ? 'border-b-blue-500 text-white'
                    : 'border-b-transparent'
                )}
              >
                Following
              </div>
            </Tab>
            <div className='flex flex-1 basis-1/2 items-center justify-end pr-6'>
              <Button
                onClick={() => {
                  (tab === GLOBAL ? globalFeed : followingFeed).onReload();
                }}
                className='h-8 rounded border border-transparent bg-neutral-200 font-matter text-sm text-white hover:bg-neutral-100/50'
              >
                Refresh Posts
              </Button>
            </div>
          </Tab.List>
        </div>

        <Tab.Panels className='mt-32 w-full'>
          <Tab.Panel unmount={false}>
            <Feed {...globalFeed} />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <Feed {...followingFeed} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
