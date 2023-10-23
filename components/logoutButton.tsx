'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function LogoutButton() {
  'use client';
  return (
    <button
      className='flex aspect-square h-9 w-9 items-center justify-center rounded border border-neutral-300 text-neutral-100 hover:text-red-500'
      onClick={() => signOut({ callbackUrl: '/' })}
      type='submit'
      data-tooltip-id='tooltip'
      data-tooltip-content='Log Out'
      data-tooltip-place='top'
    >
      <LogOutIcon className='h-4 w-4' />
    </button>
  );
}
