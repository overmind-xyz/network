import { CopyButton, NewCopyButton } from '@/components/CopyButton';
import { Countdown } from '@/components/CountDown';
import { Wheel } from '@/components/Wheel';
import { authOptions } from '@/server/auth';
import { CheckIcon, ExternalLinkIcon, Gift, TwitterIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma, spin } from '@/lib/prisma';
import { getMe } from '@/lib/actions';
import { TimeAgo } from '@/components/timeAgo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CurrentTimeProvider } from '@/contexts/currentTime';
import { format } from 'date-fns';
import { Currency } from '@/components/currency';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import dayjs from 'dayjs';
import { api } from '@/trpc/server';
import { PrizeItem } from '@/components/PrizeItem';

export default async function Prizes() {
  const me = await getMe();
  const session = await getServerSession(authOptions);

  if (!me || !session) {
    redirect('/');
  }

  const history = await prisma.spin.findMany({
    where: {
      user: { username: me.username },
      has_spun: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 500,
  });

  return (
    <div className='flex h-full w-full flex-col gap-6 p-6 font-matter'>
      <div className='flex flex-col space-y-3'>
        <h3 className='font-cal text-xl md:text-4xl'>Prizes</h3>
        <p className='text-neutral-100'>
          History of free spin prizes.{' '}
          <b className='text-neutral-50'>
            Exchange your $0.01 prizes for another Free Spin!
          </b>
        </p>
      </div>

      <div className='rounded border border-neutral-300 bg-neutral-400 px-3 pb-3'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-64'>Date</TableHead>
              <TableHead className='text-center'>Status</TableHead>
              <TableHead className='text-center'>Prize Amount</TableHead>
              <TableHead className='text-right'>Exchange / View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((spin) => (
              <PrizeItem key={spin.id} {...spin} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
