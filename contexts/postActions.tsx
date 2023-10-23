'use client';

import { ServerAction } from '@/lib/types';
import { createContext, useContext } from 'react';

type Value = {
  onLikePost: ServerAction;
  onUnlikePost: ServerAction;
};

export const PostActionsContext = createContext<Value>({
  onLikePost: () => {},
  onUnlikePost: () => {},
} as unknown as Value);

export function PostActionsProvider({
  children,
  onLikePost,
  onUnlikePost,
}: React.PropsWithChildren<Value>) {
  return (
    <PostActionsContext.Provider value={{ onLikePost, onUnlikePost }}>
      {children}
    </PostActionsContext.Provider>
  );
}

export const usePostActions = () => useContext(PostActionsContext);
