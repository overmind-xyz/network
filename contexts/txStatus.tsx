'use client';

import { cn } from '@/lib/utils';
import { createContext, useContext, useState } from 'react';

type Value = {
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TxStatusContext = createContext<Value>({
  setIsPending: () => {},
} as unknown as Value);

export function TxStatusProvider({ children }: React.PropsWithChildren) {
  const [isPending, setIsPending] = useState(false);

  return (
    <TxStatusContext.Provider value={{ setIsPending }}>
      {children}
      {isPending && (
        <div
          className='fixed bottom-0 left-0 top-0 z-10 flex h-full w-full items-center justify-center transition-transform'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div className='z-50 flex items-center justify-center gap-4 bg-gray-900 p-6'>
            <div
              className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid !border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
              role='status'
              style={{
                borderColor: '#0ea5e9',
                borderRightColor: 'transparent',
              }}
            >
              <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                Loading...
              </span>
            </div>
            <div className='text-lg text-white'>Sending transaction...</div>
          </div>
        </div>
      )}
    </TxStatusContext.Provider>
  );
}

export const useTxStatus = () => useContext(TxStatusContext);
