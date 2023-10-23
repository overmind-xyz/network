'use client';

import { TxnBuilderTypes } from 'aptos';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { AlertCircleIcon, CheckCircle, Star } from 'lucide-react';
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';
import { mainnet } from '@/lib/aptos';
import { useDebounce } from 'usehooks-ts';
import { Currency } from './currency';
import { api } from '@/trpc/react';
import { useWinScreen } from '@/contexts/winScreen';
import { toast } from 'react-hot-toast';

export function WinScreen({ amount }: { amount: number }) {
  const { setAmount } = useWinScreen();
  const [address, setAddress] = useState('');
  const dbAddress = useDebounce(address);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isError, setIsError] = useState(false);
  const isTouched = useRef(false);

  const { isLoading, mutate } = api.spin.setWithdrawAddress.useMutation({
    onSuccess: (data) => {
      setAmount(0);
      toast.success('Your withdrawal address has been saved.');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div
      className='fixed bottom-0 left-0 right-0 top-0 z-50 flex h-full w-full items-center justify-center'
      style={{
        backgroundColor: 'rgba(0,0,0,0.80)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className='relative m-4 w-full rounded-3xl bg-[#222] p-12 md:-top-32 md:m-0 md:h-auto md:w-[750px]'>
        <div className='flex w-full flex-col font-matter'>
          <h1 className='flex items-center justify-center gap-5 text-center font-cal text-3xl md:text-6xl'>
            <Star className='h-5 w-5 fill-gold-500 text-gold-500 md:h-7 md:w-7' />
            <div className=''>
              You won{' '}
              <span className='text-gold-500'>
                <Currency amount={amount} />
              </span>
            </div>
            <Star className='h-5 w-5 fill-gold-500 text-gold-500 md:h-7 md:w-7' />
          </h1>
          <div className='pb-3 pt-9 text-neutral-100'>
            Enter your Aptos address below to receive your reward:
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate({ address });
            }}
            className='relative flex h-12 items-center'
          >
            <input
              name='address'
              placeholder='0x...'
              className={cn(
                'font-mono h-full flex-1 cursor-pointer bg-black/50 px-3 !outline-none',
                isError && 'bg-red-500/10'
              )}
              value={address}
              onChange={(e) => {
                isTouched.current = true;
                setAddress(e.target.value);
              }}
            />
            <Button
              variant='ghost'
              className='h-full w-20 bg-blue-500/10'
              disabled={
                isLoading || isVerifying || isError || address.length === 0
              }
              type='submit'
            >
              {isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </form>
          <div className='mt-2 h-8 w-full'>
            {isError && isTouched.current && (
              <div className='flex w-full items-center justify-start gap-2 text-red-500'>
                <AlertCircleIcon className='h-4 w-4' />
                Not a valid Aptos address
              </div>
            )}
            {!isError && isTouched.current && (
              <div className='flex w-full items-center justify-start gap-2 text-green-500'>
                <CheckCircle className='h-4 w-4' />
                Valid Aptos address
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
