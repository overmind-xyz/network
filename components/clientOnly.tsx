'use client';

import { Tooltip } from 'react-tooltip';

export function ClientOnly() {
  return (
    <>
      <Tooltip
        className='!z-50 !bg-white !px-2 !py-2 !text-sm !text-black !duration-100'
        id='tooltip'
        noArrow
      />
    </>
  );
}
