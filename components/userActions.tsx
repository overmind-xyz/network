'use client';
import { Heart, MessageSquare } from 'lucide-react';
import { Post as PostType, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { usePostActions } from '@/contexts/postActions';
import { ServerActionForm } from './serverActionForm';

export function UserActions({
  className,
  post,
  onClickComment,
}: {
  post: PostType;
  onClickComment?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLFormElement | null>(null);
  const { onLikePost, onUnlikePost } = usePostActions();
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);

  const action = isLiked ? onUnlikePost : onLikePost;

  useEffect(() => {
    setLikeCount(post.likes);
    setIsLiked(post.isLiked);
  }, [post.likes, post.isLiked]);

  return (
    <div className={cn('mt-2 flex flex-row items-center gap-4', className)}>
      <button
        onClick={onClickComment || undefined}
        className='flex flex-row items-center gap-1 rounded-full px-2 py-1.5 text-neutral-100 hover:bg-cyan-900/25 hover:text-cyan-600'
      >
        <MessageSquare className='h-5 w-5' />
        <span className='text-sm'>{post.commentCount}</span>
      </button>
      <ServerActionForm
        action={action}
        onSubmit={() => {
          const isLikedNow = isLiked;
          setIsLiked((isLiked) => !isLiked);
          setLikeCount((likeCount) => likeCount + (isLikedNow ? -1 : 1));
        }}
      >
        <input type='hidden' name='postId' value={post.id} />
        <input type='hidden' name='postUsername' value={post.author.username} />
        <button
          className={cn(
            'flex flex-row items-center gap-1 rounded-full px-2 py-1.5 text-neutral-100 hover:bg-pink-900/25 hover:text-pink-600',
            isLiked && 'text-pink-600'
          )}
          onClick={(e) => {
            e.stopPropagation();
            ref.current && ref.current.submit();
          }}
          type='submit'
        >
          <Heart className={cn('h-5 w-5', isLiked && 'fill-pink-600')} />
          <span className='text-sm'>{likeCount}</span>
        </button>
      </ServerActionForm>
    </div>
  );
}
