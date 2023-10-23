import { Avatar } from '@/components/avatar';
import { UserActions } from '@/components/userActions';
import { useMe } from '@/contexts/me';
import { href } from '@/lib/routes';
import { Post as PostType } from '@/lib/types';
import { isStaff, tsToLocalDate } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { Ban } from './ban';
import { getMe } from '@/lib/actions';

export async function HeroPost({ post }: { post: PostType }) {
  const me = await getMe();

  return (
    <div className='flex w-full flex-col'>
      <div className='flex items-center justify-start'>
        <Link
          href={href('Profile', post.author.username)}
          className='mb-4 flex items-center gap-3'
        >
          <Avatar user={post.author} />
          <div>
            <div className='text-base font-bold text-white'>
              {post.author.name}
            </div>
            <div className='text-sm text-neutral-100'>
              @{post.author.username}
            </div>
          </div>
        </Link>
        {me && isStaff(me.username) && <Ban username={post.author.username} />}
      </div>
      <div className='mb-1 max-w-xl break-all text-xl font-light text-white'>
        {post.body}
      </div>
      <Link href='#' className='text-sm text-neutral-100 hover:underline'>
        {format(tsToLocalDate(post.timestamp), 'h:mm a · MMM d, yyyy')}
      </Link>
      <UserActions
        post={post}
        className='my-6 flex w-full border-y border-y-gray-900/50 py-1'
      />
    </div>
  );
}
