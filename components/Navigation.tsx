'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gift,
  GiftIcon,
  Home,
  KeyIcon,
  LucideIcon,
  Star,
  TicketIcon,
  User2,
  DollarSign,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';
import { UserInfo } from '@/lib/types';
import { href } from '@/lib/routes';

function NavigationLink({
  href,
  icon: Icon,
  title,
  isActive,
  className,
  isNew = false,
}: {
  href: string;
  icon: LucideIcon;
  title: ReactNode;
  isActive: boolean;
  isNew?: boolean;
} & HTMLAttributes<HTMLLinkElement>) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'flex aspect-square h-12 shrink-0 flex-row items-center justify-center gap-3 rounded-xl bg-neutral-400 text-lg text-white hover:bg-neutral-300 md:m-0 md:aspect-auto md:h-12 md:w-full md:justify-start md:px-6',
        isActive && 'bg-neutral-200 hover:bg-neutral-200',
        className
      )}
    >
      <Icon className='h-5 w-5 shrink-0' />
      <div className='hidden md:block'>{title}</div>
      {isNew && (
        <div className='hidden rounded bg-blue-500 px-2 py-0.5 text-xs md:block'>
          New
        </div>
      )}
    </Link>
  );
}

export const Navigation = ({
  me,
  spinCount = 0,
}: {
  me: UserInfo;
  spinCount?: number;
}) => {
  const pathname = usePathname();

  return (
    <div className='flex w-full flex-col items-center gap-3 py-4 font-matter md:items-start md:justify-start md:p-6'>
      <NavigationLink
        href={href('Home')}
        icon={Home}
        isActive={pathname === '/'}
        title='Home'
      />
      <NavigationLink
        href='/prizes'
        icon={DollarSign}
        isActive={pathname === '/prizes'}
        title='Prizes'
      />
      <NavigationLink
        href={href('Profile', me.username)}
        icon={User2}
        isActive={pathname.startsWith(`/@${me.username}`)}
        title='Profile'
      />
      <Link
        href='/spin'
        className={cn(
          'flex aspect-square h-12 shrink-0 flex-row items-center justify-center gap-3 rounded-xl bg-green-500/10 text-lg text-green-500 hover:bg-green-500/25 md:m-0 md:aspect-auto md:h-12 md:w-full md:justify-start md:px-6',
          pathname === '/spin' && 'bg-green-500/25'
        )}
      >
        <GiftIcon className='h-5 w-5 shrink-0' />
        <p className='hidden md:inline'>Free Spin</p>
        {spinCount > 0 && (
          <div className='hidden h-5 items-center justify-center rounded bg-green-500 px-1.5 text-xs font-bold text-green-950 md:flex'>
            {spinCount}
          </div>
        )}
      </Link>
      <NavigationLink
        href='/leaderboard'
        icon={Users}
        isActive={pathname.startsWith('/leaderboard')}
        title='Leaderboards'
      />

      <div
        className={cn(
          'flex aspect-square h-12 shrink-0 flex-row items-center justify-center gap-4 rounded-xl bg-gold-500/10 text-lg text-gold-500 hover:cursor-not-allowed md:m-0 md:aspect-auto md:h-16 md:w-full md:justify-start md:px-6'
        )}
      >
        <KeyIcon className='h-5 w-5 shrink-0' />
        <div className='hidden flex-col space-y-0.5 md:flex'>
          <p className='hidden md:inline'>Buy / Sell Keys</p>
          <p className='text-xs'>Coming soon...</p>
        </div>
      </div>

      <div className='flex w-full items-center justify-center pt-3'>
        <Link
          href='free'
          className='flex h-12 w-12 items-center justify-center space-x-2 rounded-full bg-green-700 text-center hover:bg-green-600 md:w-full md:px-3'
        >
          <GiftIcon className='h-5 w-5 shrink-0 md:hidden' />
          <p className='hidden md:inline'>Earn a Free Spin</p>
          <div className='rounded bg-red-500 px-2 text-sm'>New</div>
        </Link>
      </div>
    </div>
  );
};
