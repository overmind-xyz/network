import { LoginWithXButton } from '@/components/LoginWithXButton';
import Image from 'next/image';

export function LoginPage() {
  return (
    <div className='flex w-full flex-col items-center space-y-6 p-6 font-matter sm:pt-16'>
      <div className='mb-10 hidden w-full items-center justify-center rounded-2xl bg-neutral-900 px-6 text-center sm:flex'>
        <Image src='/login.gif' alt='loading...' width={400} height={300} />
      </div>

      <div className='rounded bg-red-500 px-3 py-1 text-sm font-bold uppercase'>
        Invite only
      </div>
      <p className='px-6 font-cal text-5xl md:text-8xl'>Join Network</p>

      <p className='max-w-xl px-6 text-center text-xl text-neutral-100 md:text-3xl'>
        The first decentralized social network that pays you to post.
      </p>

      <div className='w-full max-w-lg pt-6'>
        <LoginWithXButton />
      </div>
    </div>
  );
}
