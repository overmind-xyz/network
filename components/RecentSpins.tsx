import { Avatar } from './avatar';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { OvermindLogo } from './overmindLogo';
import Link from 'next/link';

export const RecentSpins = async () => {
  const winners = await prisma.spin.findMany({
    where: {
      has_spun: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    select: {
      id: true,
      prize: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    take: 10,
  });

  return (
    <div className='scrollbar-hide fixed left-0 right-0 top-0 z-10 hidden h-16 w-full flex-row items-center gap-6 overflow-x-auto overflow-y-hidden border-b border-neutral-300 bg-neutral-400 px-6 font-matter md:flex'>
      <p className='shrink-0 text-sm uppercase text-neutral-100'>
        Recent Spins
      </p>
      <div className='flex flex-1 items-center'>
        {winners.map((spin) => (
          <Spin
            key={spin.id}
            prize={spin.prize ?? 0}
            name={spin.user.name}
            imgSrc={spin.user.image ?? ''}
          />
        ))}
      </div>
    </div>
  );
};

const Spin = ({
  prize,
  name,
  imgSrc,
}: {
  prize: number;
  name: string;
  imgSrc: string;
}) => {
  return (
    <div className='flex shrink-0 flex-row space-x-2 border-l border-neutral-300 px-6 font-matter'>
      {imgSrc && (
        <Avatar className='h-10 w-10' user={{ imgSrc, username: name, name }} />
      )}
      <div className='flex flex-col items-start justify-center text-sm'>
        <p className={prize ? 'text-green-500' : 'text-white'}>
          ${prize / 100} USD
        </p>
        <p className='text-neutral-100'> {name}</p>
      </div>
    </div>
  );
};
