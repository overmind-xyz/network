'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { tsToLocalDate } from '@/lib/utils';
import { useCurrentTime } from '@/contexts/currentTime';
import pluralize from 'pluralize';

export function TimeAgo({
  timestamp,
  className,
  verbose = false,
}: {
  timestamp: string | number | Date;
  now?: number;
  verbose?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const now = useCurrentTime();

  const timeAgo = useMemo(() => {
    const ts =
      timestamp instanceof Date
        ? Math.floor(timestamp.getTime() / 1000)
        : timestamp;

    const diff = Math.round(now / 1000) - parseInt(`${ts}`, 10);
    let num;

    if (diff < 60) {
      return 'just now';
    } else if (diff < 3600) {
      num = Math.floor(diff / 60);
      return `${num}${verbose ? ` ${pluralize('minute', num)} ago` : 'm'}`;
    } else if (diff < 86400) {
      num = Math.floor(diff / 3600);
      return `${num}${verbose ? ` ${pluralize('hour', num)} ago` : 'h'}`;
    } else {
      return format(tsToLocalDate(ts), 'MMM d');
    }
  }, [now, timestamp, verbose]);

  return <span className={className}>{timeAgo}</span>;
}
