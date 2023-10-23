'use client';

import { createContext, useContext } from 'react';
import { User } from '@/lib/types';

type Value = User;

export const MeContext = createContext<Value>(null as unknown as Value);

export function MeProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: Value }>) {
  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

export const useMe = () => useContext(MeContext);
