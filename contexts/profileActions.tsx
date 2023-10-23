'use client';

import { ServerAction } from '@/lib/types';
import { createContext, useContext } from 'react';

type Value = {
  onFollow: ServerAction;
  onUnfollow: ServerAction;
};

export const ProfileActionsContext = createContext<Value>({
  onFollow: () => {},
  onUnfollow: () => {},
} as unknown as Value);

export function ProfileActionsProvider({
  children,
  onFollow,
  onUnfollow,
}: React.PropsWithChildren<Value>) {
  return (
    <ProfileActionsContext.Provider value={{ onFollow, onUnfollow }}>
      {children}
    </ProfileActionsContext.Provider>
  );
}

export const useProfileActions = () => useContext(ProfileActionsContext);
