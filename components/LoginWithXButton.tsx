'use client';

import { TwitterIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export const LoginWithXButton = () => {
  return (
    <button
      className='flex w-full flex-row items-center justify-center space-x-3 rounded-xl bg-[#26a7de] px-9 py-3 font-matter text-white hover:bg-[#51b9e5]'
      onClick={() => signIn('twitter')}
    >
      <Image
        src='/twitter.svg'
        alt='Twitter'
        className='h-6 w-6'
        height={24}
        width={24}
      />
      <p className='text-lg'>Sign in with Twitter</p>
    </button>
  );
};
