'use client';

import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export const SetReferralCookie = () => {
  const searchParams = useSearchParams();

  const r = searchParams.get('r');

  if (!r) return null;

  Cookies.set('r', r);

  return null;
};
