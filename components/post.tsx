'use client';

import { Comment, Post as PostType } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { UserActions } from './userActions';
import {
  STAFF_USERNAMES,
  cn,
  isParent,
  isStaff,
  tsToLocalDate,
} from '@/lib/utils';
import { Avatar } from './avatar';
import { TimeAgo } from './timeAgo';
import { CrownIcon } from 'lucide-react';
import { useMe } from '@/contexts/me';
import { Ban } from './ban';

export default function Post({
  className,
  post,
}: {
  className?: string;
  post: PostType | Comment;
}) {
  const me = useMe();
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/${post.author.username}/status/${post.id}`);
  }, [post.author.username, post.id, router]);

  const onClickUser = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation();
      router.push(`/@${post.author.username}`);
    },
    [post.author.username, router]
  );

  const date = tsToLocalDate(post.timestamp);

  console.log(STAFF_USERNAMES);
  console.log(me.username);
  console.log(isStaff(me.username));

  return (
    <div className='relative w-full cursor-pointer transition-colors hover:bg-white/5'>
      <div
        onClick={isParent(post) ? onClick : undefined}
        className={cn('w-full px-4 py-4', isParent(post) && 'pb-12', className)}
      >
        <div className='flex flex-row justify-start gap-3'>
          <div
            className='flex flex-col items-end justify-start gap-2'
            onClick={onClickUser}
          >
            <Avatar isInteractive user={post.author} />
          </div>
          <div className='items flex flex-1 flex-col'>
            <div className='flex w-full flex-1 flex-row items-center justify-start gap-1'>
              <div
                onClick={onClickUser}
                className='max-w-[30%] truncate font-bold hover:underline'
              >
                {post.author.name}
              </div>
              <div
                className='max-w-[30%] shrink truncate text-neutral-100 hover:underline md:max-w-none'
                onClick={onClickUser}
              >
                @{post.author.username}
              </div>{' '}
              <div className='text-neutral-100'>·</div>{' '}
              <div
                className='text-neutral-100'
                data-tooltip-id='tooltip'
                data-tooltip-content={`${format(date, 'MM/dd/yy h:mm a')}`}
                data-tooltip-delay-show={300}
              >
                <TimeAgo timestamp={post.timestamp} />
              </div>
              {isStaff(post.author.username) && (
                <div className='ml-3 flex flex-row items-center justify-center gap-1.5 rounded-full bg-blue-500 bg-opacity-10 px-3 py-1 font-matter text-xs text-blue-500'>
                  <CrownIcon className='h-4 w-4' />
                  <p>Staff</p>
                </div>
              )}
              {isStaff(me.username) && me.username !== post.author.username && (
                <Ban username={post.author.username} />
              )}
            </div>
            <p className='max-w-xl break-all'>{post.body}</p>
          </div>
        </div>
      </div>
      {isParent(post) && (
        <div className='absolute bottom-4 left-16'>
          <UserActions
            post={post}
            className='h-6 w-auto gap-2'
            onClickComment={onClick}
          />
        </div>
      )}
    </div>
  );
}
