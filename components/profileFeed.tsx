'use client';

import { Post } from '@/lib/types';
import { Feed } from './feed';
import { useFeed, useReconcilePosts } from '@/hooks/useFeed';

export function ProfileFeed({
  posts,
  fetch,
}: {
  posts: Post[];
  fetch: (_: number) => Promise<Post[]>;
}) {
  const reconcile = useReconcilePosts();

  const feed = useFeed(posts, fetch, reconcile);

  return <Feed {...feed} />;
}
