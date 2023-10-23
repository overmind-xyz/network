'use client';

import Post from '@/components/post';
import { PAGE_SIZE, cn } from '@/lib/utils';
import { Comment, Post as PostType, User } from '@/lib/types';
import { useInView } from 'react-intersection-observer';
import {
  HTMLAttributes,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Spinner } from './spinner';
import { useMe } from '@/contexts/me';
import { byNewest, byOldest } from '@/lib/utils';
import cookie from 'js-cookie';
import { add } from 'date-fns';
import { UseFeed, useFeed } from '@/hooks/useFeed';
import { CurrentTimeProvider } from '@/contexts/currentTime';

export function Feed<T extends PostType | Comment>({
  className,
  isComment = false,
  items,
  isAtEnd,
  isFetching,
  page,
  onFetch,
} // bottomRef,
: {
  isComment?: boolean;
  sortBy?: (_: T, __: T) => number;
} & UseFeed<T> &
  HTMLAttributes<HTMLDivElement>) {
  return (
    <CurrentTimeProvider>
      <div
        className={cn(
          'flex w-full flex-col items-start justify-start',
          className
        )}
      >
        {items.map((post, index) => {
          if (post.body.includes('0xmint.art')) return;
          return (
            <Post
              post={post}
              key={`${post.id}-${post.author.username}`}
              className={index < items.length ? 'border-b-gray-900/50' : ''}
            />
          );
        })}
        {items.length === 0 && (
          <div className='w-full p-6'>
            <div className='flex w-full items-center justify-center rounded bg-neutral-400 px-12 py-16 text-lg font-light'>
              {!isFetching ? (
                isComment ? (
                  'No comments'
                ) : (
                  'No posts'
                )
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        )}
        {items.length >= PAGE_SIZE && !isAtEnd && (
          <button
            // ref={isFetching ? undefined : bottomRef}
            className='flex h-16 w-full items-center justify-center text-base text-white hover:bg-gray-900/10'
            onClick={() => onFetch(page + 1)}
          >
            {isFetching ? <Spinner /> : 'Load More'}
          </button>
        )}
      </div>
    </CurrentTimeProvider>
  );
}
