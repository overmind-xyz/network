import { Post, ProfilePage, User, UserInfo } from '@/lib/types';
import { BackLink } from '@/components/backLink';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Feed } from '@/components/feed';
import { getProfilePage } from '@/lib/storage';
import {
  getMe,
  onFollow,
  onLikePost,
  onUnfollow,
  onUnlikePost,
} from '@/lib/actions';
import Link from 'next/link';
import { stripUsername } from '@/lib/utils';
import { PostActionsProvider } from '@/contexts/postActions';
import { FollowButton } from '@/components/followButton';
import { ProfileActionsProvider } from '@/contexts/profileActions';
import { redirect } from 'next/navigation';
import { MeProvider } from '@/contexts/me';
import { href } from '@/lib/routes';
import { ProfileFeed } from '@/components/profileFeed';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const me = await getMe();

  if (!me) {
    redirect('/');
  }

  const profile = await getProfilePage(
    stripUsername(params.username),
    me.username
  );

  if (!profile || profile.user.username === '') {
    redirect('/');
  }

  const fetch = async (page: number) => {
    'use server';

    const data = await getProfilePage(profile.user.username, me.username, page);

    return data?.posts || [];
  };

  return (
    <MeProvider value={me}>
      <div className='relative flex w-full flex-col'>
        <BackLink>
          <div className='flex flex-col items-start'>
            <span>{profile.user?.name}</span>
            <span className='text-sm leading-none text-neutral-100'>
              @{profile.user.username}
            </span>
          </div>
        </BackLink>

        <div className='relative flex flex-col items-center justify-center'>
          <div className='flex w-full flex-row space-x-6 border-b border-neutral-300 bg-neutral-500 px-6 py-9'>
            <Link href={href('Profile', profile.user.username)}>
              <Avatar
                className='aspect-square h-auto w-24 max-w-[160px] md:w-[160px]'
                user={profile.user}
                size={160}
              />
            </Link>
            <div className='flex flex-col'>
              {me.username !== profile.user.username && (
                <ProfileActionsProvider
                  onFollow={onFollow}
                  onUnfollow={onUnfollow}
                >
                  <div className='absolute right-4 top-16 md:top-24'>
                    <FollowButton
                      isFollowed={profile.isFollowed}
                      username={profile.user.username}
                    />
                  </div>
                </ProfileActionsProvider>
              )}
              <div className='mb-2 mt-4'>
                <div className='text-2xl font-bold'>{profile.user.name}</div>
                <div className='font-sm text-neutral-100'>
                  @{profile.user.username}
                </div>
              </div>
              <div className='flex items-center gap-8 text-sm'>
                <Link
                  className='flex items-center gap-1 hover:underline'
                  href={href('Followers', profile.user.username)}
                >
                  <div className='text-base font-bold'>
                    {profile.user.followers}
                  </div>
                  <div className='text-sm text-neutral-100'>Followers</div>
                </Link>
                <Link
                  className='flex items-center gap-1 hover:underline'
                  href={href('Following', profile.user.username)}
                >
                  <div className='text-base font-bold'>
                    {profile.user.following}
                  </div>
                  <div className='text-sm text-neutral-100'>Following</div>
                </Link>
              </div>
            </div>
          </div>
          <PostActionsProvider
            onLikePost={onLikePost}
            onUnlikePost={onUnlikePost}
          >
            <ProfileFeed posts={profile.posts} fetch={fetch} />
          </PostActionsProvider>
        </div>
      </div>
    </MeProvider>
  );
}
