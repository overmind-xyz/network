'use client';

import { Comment } from '@/lib/types';
import { Feed } from './feed';
import { useFeed, useReconcilePosts } from '@/hooks/useFeed';

export function CommentFeed({
  comments,
  fetch,
}: {
  comments: Comment[];
  fetch: (_: number) => Promise<Comment[]>;
}) {
  const reconcile = useReconcilePosts(true);

  const feed = useFeed(comments, fetch, reconcile);

  return <Feed isComment {...feed} />;
}
