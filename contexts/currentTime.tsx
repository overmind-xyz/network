'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const CurrentTimeContext = createContext<number>(Date.now());

export function CurrentTimeProvider({ children }: React.PropsWithChildren) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CurrentTimeContext.Provider value={now}>
      {children}
    </CurrentTimeContext.Provider>
  );
}

export const useCurrentTime = () => useContext(CurrentTimeContext);
