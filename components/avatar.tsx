import { UserInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Avatar({
  className,
  user,
  size = 44,
  isInteractive,
}: {
  user: UserInfo;
  className?: string;
  size?: number;
  isInteractive?: boolean;
}) {
  return (
    <Image
      className={cn(
        'aspect-square h-11 w-11 max-w-none shrink-0 rounded-full bg-blue-500',
        isInteractive && 'transition-opacity hover:bg-black hover:opacity-80',
        className
      )}
      src={
        user.imgSrc?.replace('_normal', '') ||
        `https://i.pravatar.cc/${size * 2}?u=${user.username}`
      }
      alt='profile pic'
      width={size}
      height={size}
    />
  );
}
