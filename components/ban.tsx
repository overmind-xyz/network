'use client';
import { api } from '@/trpc/react';
import { toast } from 'react-hot-toast';

export function Ban({ username }: { username: string }) {
  const { mutate: ban } = api.user.ban.useMutation({
    onSuccess: () => {
      toast.success('User has been banned');
    },
    onError: (err) => {
      //
    },
  });

  return (
    <>
      <button
        className='ml-3 flex flex-row items-center justify-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 font-matter text-xs text-red-500 hover:bg-red-500/20'
        onClick={(e) => {
          e.stopPropagation();
          ban({ username });
        }}
      >
        Ban
      </button>
    </>
  );
}
