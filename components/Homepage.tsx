import { Feed } from '@/components/feed';
import Compose from '@/components/compose';
import { extractError, getMe, onLikePost, onUnlikePost } from '@/lib/actions';
import {
  createPost,
  getFollowingTimeline,
  getGlobalTimeline,
} from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { newPostSchema } from '@/lib/zod';
import { PostActionsProvider } from '@/contexts/postActions';
import { ServerActionForm } from '@/components/serverActionForm';
import { ServerAction } from '@/lib/types';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { Tab } from '@headlessui/react';
import { MeProvider } from '@/contexts/me';
import { Timeline } from './timeline';
import { cookies } from 'next/headers';
import { useCallback } from 'react';

export default async function Homepage() {
  const me = await getMe();

  if (!me) {
    redirect('/');
  }

  const initialGlobal = await getGlobalTimeline(0);
  const initialFollowing = await getFollowingTimeline(0);

  const onCreatePost: ServerAction = async (_, formData) => {
    'use server';

    const session = await getServerSession(authOptions);

    if (!session) {
      return { isError: true, message: 'Not logged in' };
    }

    if (session.user.is_banned) {
      return { isError: true, message: 'You are banned' };
    }

    const newPost = newPostSchema.parse({
      body: formData.get('body'),
    });

    try {
      await createPost(
        {
          username: session.user.username,
          name: session.user.name,
          imgSrc: session.user.image,
          privateKey: session.user.privateKey,
        },
        newPost.body
      );

      revalidatePath('/');
      revalidatePath(`/@${me.username}`);

      return { isSuccess: true };
    } catch (e) {
      return { isError: true, message: extractError(e), errors: [e] };
    }
  };

  const onRefresh = async () => {
    'use server';
    revalidatePath('/');
  };

  return (
    <MeProvider value={me}>
      <PostActionsProvider onLikePost={onLikePost} onUnlikePost={onUnlikePost}>
        <Timeline
          getGlobalTimeline={getGlobalTimeline}
          getFollowingTimeline={getFollowingTimeline}
          initialGlobal={initialGlobal}
          initialFollowing={initialFollowing}
          onCreatePost={onCreatePost}
          onRefresh={onRefresh}
        />
      </PostActionsProvider>
    </MeProvider>
  );
}
