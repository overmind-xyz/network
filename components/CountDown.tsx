'use client';

import { useCountDown } from '@/hooks/useCountdown';
import { useMemo } from 'react';

const HOURS_24 = 86400000;

export const Countdown = ({
  lastDailyTaskCreatedAt,
}: {
  lastDailyTaskCreatedAt: string;
}) => {
  const countdownEnd = useMemo(
    () =>
      new Date(
        new Date(lastDailyTaskCreatedAt).getTime() + HOURS_24
      ).toISOString(),
    []
  );

  const countdown = useCountDown(countdownEnd);

  return (
    <div className='flex flex-row items-center justify-center'>
      {countdown.hours}:{countdown.minutes}:{countdown.seconds}
    </div>
  );
};
