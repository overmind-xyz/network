'use client';
import {
  //@ts-ignore
  experimental_useFormStatus as useFormStatus,
  createPortal,
} from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircleIcon } from 'lucide-react';
import { FormState } from '@/lib/types';
import { Spinner } from './spinner';

export function TxStatusMonitor({ state }: { state?: FormState }) {
  const formStatus = useFormStatus();
  const stateRef = useRef(state);
  const [isVisible, setIsVisible] = useState(formStatus.pending);

  const content = useMemo(() => {
    if (formStatus.pending) {
      return (
        <>
          <Spinner />
          <div className='text-lg text-white'>Sending transaction...</div>
        </>
      );
    }

    if (!state) {
      return null;
    }

    if (state.isError) {
      return (
        <>
          <AlertCircleIcon className='h-6 w-6' />
          <div>{state.message || 'An unknown error occurred.'}</div>
        </>
      );
    }

    return null;
  }, [formStatus.pending, state]);

  useEffect(() => {
    if (!isVisible && state?.message && stateRef.current !== state) {
      setIsVisible(true);
      stateRef.current = state;
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  }, [isVisible, state]);

  if (formStatus.pending || isVisible) {
    return createPortal(
      <div
        className={cn(
          'fixed bottom-0 left-0 top-0 z-10 flex h-full w-full items-center justify-center transition-transform',
          state?.isError && 'text-red-600'
        )}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div className='z-50 flex items-center justify-center gap-4 rounded-2xl bg-[#222] p-6'>
          {content}
        </div>
      </div>,
      document.body
    );
  }

  return null;
}
