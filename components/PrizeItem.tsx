'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const PrizeItem = (spin: {
  id: string;
  user_id: string;
  created_at: Date;
  prize: number | null;
  has_spun: boolean;
  spun_at: Date | null;
  tx_hash: string | null;
  has_exchanged: boolean;
}) => {
  const [currentHasExchanged, setCurrentHasExchanged] = useState(
    spin.has_exchanged
  );

  const exchangeSpinMutation = api.spin.exchange.useMutation({
    onSuccess: () => {
      setCurrentHasExchanged(true);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Couldn't exchange spin. Please try again.");
    },
  });

  return (
    <TableRow key={spin.id}>
      <TableCell>
        {spin.spun_at ? dayjs(spin.spun_at).fromNow() : 'n/a'}
      </TableCell>
      <TableCell className='text-center'>
        {currentHasExchanged && <p className='text-green-500'>Free spin</p>}
        {!currentHasExchanged && spin.tx_hash && (
          <p className='text-green-500'>Paid</p>
        )}
        {!currentHasExchanged && !spin.tx_hash && (
          <p className='text-yellow-500'>Pending payout</p>
        )}
      </TableCell>
      <TableCell
        className={cn(
          'text-center',
          spin.prize ? 'text-green-500' : 'text-white'
        )}
      >
        ${spin.prize ? (spin.prize / 100).toFixed(2) : '0.00'}
      </TableCell>
      <TableCell className='text-right'>
        {!currentHasExchanged && spin.prize === 1 && !spin.tx_hash && (
          <button
            className='rounded bg-blue-600 px-3 py-1.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600'
            onClick={() => exchangeSpinMutation.mutate({ id: spin.id })}
            disabled={exchangeSpinMutation.isLoading}
          >
            {exchangeSpinMutation.isLoading
              ? 'Loading...'
              : 'Exchange for Free Spin'}
          </button>
        )}
        {currentHasExchanged && <p className='text-green-500'>Exchanged</p>}
        {spin.tx_hash && <a>View Transaction</a>}
      </TableCell>
    </TableRow>
  );
};
