import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import localFont from 'next/font/local';
import { Navigation } from '@/components/Navigation';
import { Avatar } from '@/components/avatar';
import { getMe, getSession, onSubmitAddress } from '@/lib/actions';
import { prisma } from '@/lib/prisma';
import { logout } from '@/lib/actions';
import { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { cookies } from 'next/headers';
import { SetReferralCookie } from '@/components/SetReferralCookie';
import { LogOutIcon } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { signOut } from 'next-auth/react';
import { LogoutButton } from '@/components/logoutButton';
import { ClientOnly } from '@/components/clientOnly';
import { href } from '@/lib/routes';
import { RecentSpins } from '@/components/RecentSpins';
import { Protected } from '@/components/Protected';
import Homepage from '@/components/Homepage';
import { OvermindLogo } from '@/components/overmindLogo';
import { OvermindIcon } from '@/components/overmindIcon';
import { MetaData } from './meta';
import { TRPCReactProvider } from '@/trpc/react';
import { headers } from 'next/headers';
import { WinScreen } from '@/components/winScreen';
import { ServerActionForm } from '@/components/serverActionForm';
import { cn } from '@/lib/utils';
import { WinScreenProvider } from '@/contexts/winScreen';

const inter = Inter({ subsets: ['latin'] });

const cal = localFont({
  src: './cal.woff2',
  display: 'swap',
  variable: '--font-cal',
});

const matter = localFont({
  src: [
    {
      path: './Matter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Matter-Medium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Matter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-matter',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();
  const session = await getSession();

  if (!me || !session || !session.user.hasCompletedReferral) {
    return (
      <>
        <SetReferralCookie />
        <html lang='en'>
          <head>
            <MetaData />
            <title>Network</title>
          </head>
          <body
            className={`${cal.variable} ${matter.variable} ${inter.className}`}
          >
            <TRPCReactProvider headers={headers()}>
              {children}
            </TRPCReactProvider>
          </body>
        </html>
      </>
    );
  }

  const spinCount = await prisma?.spin.count({
    where: { has_spun: false, user: { username: me.username } },
  });

  const winnings = await prisma.spin.findMany({
    where: {
      user: { username: me.username },
      has_spun: true,
      prize: { gt: 0 },
      tx_hash: null,
    },
  });
  const amount = winnings.reduce((amt, { prize }) => amt + (prize || 0), 0);

  console.log(session.user);

  return (
    <html lang='en'>
      <head>
        <MetaData />
        <title>Network</title>
      </head>
      <body className={`${cal.variable} ${matter.variable} ${inter.className}`}>
        {session.user.is_banned ? (
          <div className='flex h-screen w-screen items-center justify-center'>
            <h1 className='font-matter text-3xl'>You are banned</h1>
          </div>
        ) : (
          <>
            <RecentSpins />

            <Toaster position='top-right' reverseOrder={false} />

            <div className='flex w-full items-center justify-center bg-black'>
              <div className='fixed left-0 top-0 flex h-screen w-16 shrink-0 flex-col items-center justify-between border-r border-neutral-300 bg-neutral-400 md:bottom-0 md:top-16 md:h-auto md:w-72'>
                <div className='w-full flex-1 flex-col justify-between space-y-6 overflow-y-auto pb-24'>
                  <div className='flex flex-col'>
                    <Link
                      href='/'
                      className='hidden w-full  border-b border-neutral-300 bg-neutral-400 p-6 font-cal text-2xl font-bold uppercase hover:bg-neutral-300 md:block'
                    >
                      Network
                    </Link>
                    <Navigation me={me} spinCount={spinCount} />
                  </div>

                  <div className='flex flex-col'>
                    <Link
                      href='https://overmind.xyz/?utm_source=network'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hidden w-full items-center justify-center gap-2 pb-6 text-neutral-50 opacity-75 transition-opacity hover:opacity-100 md:flex'
                    >
                      <div className='text-right font-matter text-xs uppercase tracking-widest'>
                        Built by
                      </div>
                      <OvermindLogo className='w-24' />
                    </Link>
                    <Link
                      href='https://overmind.xyz/quests/over-network?utm_source=network'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hidden w-full items-center justify-center gap-2 pb-6 text-neutral-50 underline opacity-75 transition-opacity hover:opacity-100 md:flex'
                    >
                      <div className='text-right font-matter text-xs uppercase tracking-widest'>
                        Build Network&apos;s Smart Contract
                      </div>
                    </Link>
                    <Link
                      href='https://overmind.xyz/quests/over-network-pt-2?utm_source=network'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hidden w-full items-center justify-center gap-2 pb-6 text-neutral-50 underline opacity-75 transition-opacity hover:opacity-100 md:flex'
                    >
                      <div className='text-right font-matter text-xs uppercase tracking-widest'>
                        Build Network&apos;s Frontend
                      </div>
                    </Link>
                  </div>
                </div>

                <div className='absolute bottom-0 left-0 right-0 flex w-full flex-col items-center'>
                  <div className='flex w-full flex-col items-center justify-start gap-5 border-t border-neutral-300 bg-neutral-400 p-6 md:flex-row md:gap-2'>
                    <Link
                      href='https://overmind.xyz/quests?utm_source=network'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex h-11 w-11 items-center justify-center text-[0px] text-gray-300 md:hidden'
                    >
                      <OvermindIcon className='h-[90%] w-[90%]' />
                      Built by Overmind
                    </Link>
                    <Link
                      className='flex flex-1 items-center justify-center gap-2 truncate'
                      href={href('Profile', me.username)}
                    >
                      <Avatar className='h-11 w-11' user={me} />
                      <div className='hidden flex-grow flex-col items-start truncate md:block'>
                        <div className='font-medium capitalize'>{me.name}</div>
                        <div className='truncate text-sm text-neutral-100'>
                          @{me.username}
                        </div>
                      </div>
                    </Link>

                    <LogoutButton />
                  </div>
                </div>
              </div>

              <div className='absolute left-16 right-0 top-0 flex-1 break-words border-x border-l-gray-900/25 border-r-gray-900/25 md:left-72 md:top-16'>
                <TRPCReactProvider headers={headers()}>
                  {session.user.hasCompletedReferral &&
                    !session.user.is_banned &&
                    me && <Homepage />}
                  <WinScreenProvider
                    amount={amount}
                    hasWithdrawAddress={session.user.withdrawAddress}
                  >
                    {children}
                  </WinScreenProvider>
                </TRPCReactProvider>
              </div>
            </div>
            <ClientOnly />
          </>
        )}
      </body>
    </html>
  );
}
