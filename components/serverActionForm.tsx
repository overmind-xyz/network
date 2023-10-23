'use client';
import {
  //@ts-ignore
  experimental_useFormState as useFormState,
} from 'react-dom';
import { FormState, ServerAction, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useProfileActions } from '@/contexts/profileActions';
import { Button } from './ui/button';
import { TxStatusMonitor } from './txStatus';
import { createContext } from 'react';

const INITIAL_STATE = {};

export const FormStateContext = createContext<FormState | undefined>(
  INITIAL_STATE
);

export function ServerActionForm({
  action,
  children,
  className,
  ...props
}: {
  action: ServerAction;
} & React.HTMLAttributes<HTMLFormElement>) {
  const [state, dispatch] = useFormState(action, INITIAL_STATE);

  return (
    <form action={dispatch} className={className} {...props}>
      <TxStatusMonitor state={state} />
      <FormStateContext.Provider value={state}>
        {children}
        {state?.errorMessage && (
          <p className='font-matter font-normal text-red-500'>
            {state.errorMessage}
          </p>
        )}
      </FormStateContext.Provider>
    </form>
  );
}
