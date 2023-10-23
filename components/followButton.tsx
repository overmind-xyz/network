'use client';
import {
  //@ts-ignore
  experimental_useFormState as useFormState,
} from 'react-dom';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useProfileActions } from '@/contexts/profileActions';
import { Button } from './ui/button';
import { TxStatusMonitor } from './txStatus';
import { ServerActionForm } from './serverActionForm';

export function FollowButton({
  className,
  username,
  isFollowed = false,
}: {
  username: string;
  isFollowed?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { onFollow, onUnfollow } = useProfileActions();

  const action = isFollowed ? onUnfollow : onFollow;

  return (
    <ServerActionForm action={action}>
      <input type='hidden' name='username' value={username} />
      <Button
        className={cn(
          'rounded-full border font-matter',
          isFollowed &&
            '!border-white bg-transparent text-white hover:bg-white/20',
          className
        )}
        type='submit'
      >
        {isFollowed ? 'Unfollow' : 'Follow'}
      </Button>
    </ServerActionForm>
  );
}
