'use client';

import { User } from '@/lib/types';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { TxStatusMonitor } from './txStatus';
import { FormStateContext } from './serverActionForm';
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { useMe } from '@/contexts/me';

export default function Compose({
  className,
  placeholder, // inputRef,
}: {
  placeholder: string;
  // inputRef: React.MutableRefObject<HTMLTextAreaElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  const me = useMe();
  const { pending } = useFormStatus();
  const formState = useContext(FormStateContext);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!pending && formState?.isSuccess) {
      setText('');
    }
  }, [pending, formState?.isSuccess]);

  if (!me) {
    return null;
  }

  return (
    <div className='flex w-full flex-row justify-start gap-3 font-matter'>
      <Avatar user={me} />
      <input
        className='w-full grow break-normal bg-transparent text-lg text-white outline-none'
        style={{ resize: 'none' }}
        placeholder={placeholder}
        name='body'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        className='h-10 rounded bg-blue-500 text-sm text-white hover:bg-blue-400'
        disabled={text.length === 0 || text.length > 280}
        type='submit'
      >
        Post
      </Button>
    </div>
  );
}
