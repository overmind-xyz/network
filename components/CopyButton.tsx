'use client';

import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

export const CopyButton = ({ copyValue }: { copyValue: string }) => {
  const [hasRecentlyCopied, setHasRecentlyCopied] = useState(false);

  return (
    <button
      onClick={() => {
        setHasRecentlyCopied(true);
        navigator.clipboard.writeText(copyValue);

        setTimeout(() => {
          setHasRecentlyCopied(false);
        }, 2000);
      }}
      className='h-11 rounded-br rounded-tr border-b border-r border-t border-neutral-200 bg-neutral-200 bg-opacity-50 px-4 hover:bg-opacity-75'
    >
      {hasRecentlyCopied ? (
        <CheckIcon className='h-5 w-5 text-green-500' />
      ) : (
        <CopyIcon className='h-5 w-5' />
      )}
    </button>
  );
};

export const NewCopyButton = ({
  copyValue,
  children,
}: {
  copyValue: string;
  children: React.ReactNode;
}) => {
  const [hasRecentlyCopied, setHasRecentlyCopied] = useState(false);

  return (
    <button
      onClick={() => {
        setHasRecentlyCopied(true);
        navigator.clipboard.writeText(copyValue);

        setTimeout(() => {
          setHasRecentlyCopied(false);
        }, 2000);
      }}
      className='flex flex-row items-center justify-center space-x-2 rounded-full border border-neutral-100/50 bg-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-100/25'
    >
      {hasRecentlyCopied && <CheckIcon className={'h-5 w-5 text-green-500'} />}
      {!hasRecentlyCopied && children}
    </button>
  );
};
