'use client';

import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackLink({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  return (
    <button
      className={cn(
        'flex h-16 w-full items-center gap-8 border-b border-b-gray-800/50 px-4 text-lg text-white',
        className
      )}
      onClick={() => router.back()}
    >
      <ArrowLeftIcon />
      {children}
    </button>
  );
}
