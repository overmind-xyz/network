import Compose from '@/components/compose';
import { BackLink } from '@/components/backLink';
import { Feed } from '@/components/feed';
import { extractError, getMe, onLikePost, onUnlikePost } from '@/lib/actions';
import { createComment, getComments, getPostPage } from '@/lib/storage';
import { newCommentSchema } from '@/lib/zod';
import { revalidatePath } from 'next/cache';
import { PostActionsProvider } from '@/contexts/postActions';
import { ServerActionForm } from '@/components/serverActionForm';
import { ServerAction } from '@/lib/types';
import { redirect } from 'next/navigation';
import { MeProvider } from '@/contexts/me';
import { HeroPost } from '@/components/heroPost';
import { byNewest, byOldest } from '@/lib/utils';
import { CommentFeed } from '@/components/commentFeed';
import { getSession } from 'next-auth/react';

export default async function Page({
  params: { username, id },
}: {
  params: { username: string; id: string };
}) {
  const me = await getMe();
  const session = await getSession();

  if (!me) {
    redirect('/');
    return null;
  }

  const page = await getPostPage(parseInt(id, 10), username);

  const onCreateComment: ServerAction = async (_, formData) => {
    'use server';

    if (!page?.post || !me || session?.user.is_banned) {
      return;
    }

    const newComment = newCommentSchema.parse({
      body: formData.get('body'),
    });

    try {
      await createComment(
        me,
        page.post.id,
        page.post.author.username,
        newComment.body
      );

      revalidatePath('/');
      revalidatePath(`/@${me.username}`);
      revalidatePath(`/@${me.username}/status/${page.post.id}`);
      return { isSuccess: true };
    } catch (e) {
      return { isError: true, message: extractError(e), errors: [e] };
    }
  };

  if (!page?.post || !me) {
    return 'Not found';
  }

  const fetch = async (pageNo: number) => {
    'use server';

    const data = await getPostPage(
      page.post.id,
      page.post.author.username,
      pageNo
    );

    return data.comments;
  };

  return (
    <MeProvider value={me}>
      <PostActionsProvider onLikePost={onLikePost} onUnlikePost={onUnlikePost}>
        <div className='flex w-full flex-col'>
          <BackLink>Post</BackLink>
          <div className='w-full border-b border-b-gray-900/50 px-4 py-4'>
            <HeroPost post={page.post} />
            <ServerActionForm action={onCreateComment}>
              <Compose placeholder='Send a reply' className='mt-0' />
            </ServerActionForm>
          </div>
          <CommentFeed comments={page.comments} fetch={fetch} />
        </div>
      </PostActionsProvider>
    </MeProvider>
  );
}
