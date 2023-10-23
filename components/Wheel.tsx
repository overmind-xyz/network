'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/trpc/react';
import toast from 'react-hot-toast';
import { useWinScreen } from '@/contexts/winScreen';
import { Currency } from './currency';

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function demoSpinRoll(value: number) {
  let result = value / 10000000;
  let roll = 1;

  if (result < 0.9) {
    const zeroPositions = [1, 3, 5, 7, 9, 11, 13];
    roll = zeroPositions[Math.floor(Math.random() * zeroPositions.length + 1)];
  } else if (result < 0.99) {
    roll = 14;
  } else if (result < 0.999) {
    roll = 2;
  } else if (result < 0.9999) {
    roll = 6;
  } else if (result < 0.99999) {
    roll = 10;
  } else if (result < 0.999999) {
    roll = 8;
  } else if (result < 0.9999999) {
    roll = 12;
  } else if (result < 0.999999999) {
    roll = 4;
  } else {
    roll = 0;
  }

  return roll;
}

export const Wheel = ({
  isDemo = false,
  availableSpins = 0,
}: {
  isDemo?: boolean;
  availableSpins?: number;
}) => {
  const { setAmount } = useWinScreen();
  const [spinsLeft, setSpinsLeft] = useState(availableSpins);
  const [spinner, setSpinner] = useState(null as HTMLElement | null);

  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerClassName, setSpinnerClassName] = useState('items');
  const [backgroundPositionX, setBackgroundPositionX] = useState(0);
  const [previousSpinPositionX, setPreviousSpinPositionX] = useState(0);

  const [hasSound, setHasSound] = useState(true);

  const clickAudio = useMemo(
    () => typeof Audio !== 'undefined' && new Audio('click.mp3'),
    []
  );
  const lossAudio = useMemo(
    () => typeof Audio !== 'undefined' && new Audio('loss.mp3'),
    []
  );
  const winAudio = useMemo(
    () => typeof Audio !== 'undefined' && new Audio('win.mp3'),
    []
  );

  const spinMutation = api.spin.spin.useMutation({
    onSuccess: (data) => {
      spin(data);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const demoSpinMutation = api.spin.demoSpin.useMutation({
    onSuccess: (data) => {
      spin(data);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleRecalculateSpinner = useCallback(() => {
    const spinnerElement = document.getElementById('spinner');
    if (spinnerElement)
      recalculateBackgroundPositionX(
        spinnerElement.getBoundingClientRect().width
      );
  }, [hasSpun, previousSpinPositionX]);

  function recalculateBackgroundPositionX(spinnerWidth: number) {
    if (!hasSpun) {
      const spinnerElement = document.getElementById('spinner');
      if (spinnerElement) {
        setBackgroundPositionX(
          spinnerElement.getBoundingClientRect().width / 2 - 45
        );
      }
    } else {
      setBackgroundPositionX(spinnerWidth / 2 - previousSpinPositionX);
    }
  }

  useEffect(() => {
    const spinnerElement = document.getElementById('spinner');
    if (spinnerElement) {
      setSpinner(spinnerElement);
      setBackgroundPositionX(
        spinnerElement.getBoundingClientRect().width / 2 - 45
      );
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleRecalculateSpinner);
  }, [hasSpun, previousSpinPositionX]);

  const spin = ({
    roll,
    prize,
    isDemo,
    hasWithdrawAddress,
  }: {
    roll: number;
    prize: number;
    isDemo?: boolean;
    hasWithdrawAddress?: boolean;
  }) => {
    if (!spinner) return;

    if (clickAudio && hasSound) {
      clickAudio.pause();
      clickAudio.currentTime = 0;
      clickAudio.play();
    }

    !isDemo && setSpinsLeft((n) => (n === 0 ? 0 : n - 1));
    setIsSpinning(true);
    setHasSpun(true);

    let cycles = Math.floor(getRandomArbitrary(3, 5));
    let dev = Math.floor(getRandomArbitrary(40, 60));
    let scroll_amount = roll * 90 + dev + 1377 * cycles;

    setSpinnerClassName('items');
    setBackgroundPositionX(spinner.getBoundingClientRect().width / 2);
    setPreviousSpinPositionX(scroll_amount);

    setTimeout(() => {
      setSpinnerClassName('items spin');
      setBackgroundPositionX(
        spinner.getBoundingClientRect().width / 2 - scroll_amount
      );
    }, 10);

    setTimeout(() => {
      if (
        roll === 1 ||
        roll === 3 ||
        roll === 5 ||
        roll === 7 ||
        roll === 9 ||
        roll === 11 ||
        roll === 13
      ) {
        if (lossAudio && hasSound) {
          lossAudio.pause();
          lossAudio.currentTime = 0;
          lossAudio.play();
        }
      } else {
        if (winAudio && hasSound) {
          winAudio.pause();
          winAudio.currentTime = 0;
          winAudio.play();

          if (!isDemo && prize > 0) {
            if (hasWithdrawAddress) {
              toast.success(
                <span className='whitespace-pre'>
                  You&apos;ve won <Currency amount={prize} />!
                </span>
              );
            } else {
              setAmount(prize);
            }
          }
        }
      }

      setIsSpinning(false);
      setSpinnerClassName('items');
    }, 6000);
  };

  if (isDemo) {
    return (
      <div className='flex w-full flex-col items-start space-y-3 px-6 py-9 font-matter sm:space-y-6 md:py-16'>
        <p className='font-cal text-4xl sm:text-7xl'>Free Spin</p>
        <p className='text-left text-base text-neutral-100 md:text-xl'>
          Claim your free spin after inviting 2 friends
        </p>

        <div className='w-full py-3'>
          <div
            id='spinner'
            className={cn(
              'relative flex w-full flex-row items-center rounded-xl border border-y-[2px] border-neutral-100/50 bg-neutral-200 py-4 shadow-[0_4px_6px_-1px_rgba(16,17,22,1)]',
              hasSpun === false && backgroundPositionX === 0 && 'animate-pulse'
            )}
          >
            <div className='absolute left-0 z-10 h-full w-3 rounded-bl-xl rounded-tl-xl bg-neutral-50/10' />
            <div className='absolute right-0 z-10 h-full w-3 rounded-br-xl rounded-tr-xl bg-neutral-50/10' />
            {hasSpun === false && backgroundPositionX === 0 ? (
              <div className='h-[90px] w-full'></div>
            ) : (
              <div
                id='items'
                className={spinnerClassName}
                style={{ backgroundPositionX: backgroundPositionX + 'px' }}
              >
                <div
                  className={cn(
                    'absolute -bottom-4 -top-4 left-1/2 w-[3px] -translate-x-1/2 transform bg-white'
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={() => demoSpinMutation.mutate()}
            className={cn(
              'flex h-10 w-full items-center justify-center rounded bg-blue-500 px-12 text-sm text-white hover:bg-blue-400',
              isSpinning && 'cursor-not-allowed opacity-50 hover:bg-blue-500'
            )}
            disabled={isSpinning}
          >
            {isSpinning ? 'Spinning...' : 'Demo Spin'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col items-center space-y-6 px-6 pt-6 font-matter sm:space-y-9'>
      <div className='flex flex-col items-center space-y-6'>
        <p className='font-cal text-5xl sm:text-6xl'>Free Spin</p>
        <p className='text-neutral-100'>
          There is a total of $20,000 left in the free spin treasury, rewards
          cannot exceed the treasury.
        </p>
      </div>

      <div
        id='spinner'
        className={cn(
          'relative flex w-full max-w-[1377px] flex-row items-center rounded-xl border border-y-[2px] border-neutral-100/50 bg-neutral-200 py-4 shadow-[0_4px_6px_-1px_rgba(16,17,22,1)]',
          hasSpun === false && backgroundPositionX === 0 && 'animate-pulse'
        )}
      >
        <div className='absolute left-0 z-10 h-full w-3 rounded-bl-xl rounded-tl-xl bg-neutral-50/10' />
        <div className='absolute right-0 z-10 h-full w-3 rounded-br-xl rounded-tr-xl bg-neutral-50/10' />
        {hasSpun === false && backgroundPositionX === 0 ? (
          <div className='h-[90px] w-full'></div>
        ) : (
          <div
            id='items'
            className={spinnerClassName}
            style={{ backgroundPositionX: backgroundPositionX + 'px' }}
          >
            <div
              className={cn(
                'absolute -bottom-4 -top-4 left-1/2 w-[3px] -translate-x-1/2 transform bg-white'
              )}
            />
          </div>
        )}
      </div>

      <div className='flex flex-col items-center space-y-6'>
        <button
          onClick={() => spinsLeft && spinMutation.mutate()}
          className={cn(
            'flex h-14 w-full items-center justify-center rounded bg-blue-500 px-16 text-white hover:bg-blue-400',
            isSpinning && 'cursor-not-allowed opacity-30',
            !spinsLeft && isSpinning && 'hover:bg-blue-500',
            spinsLeft && isSpinning && 'hover:bg-blue-500',
            !spinsLeft
              ? 'cursor-not-allowed bg-blue-500 !opacity-50 hover:bg-blue-500'
              : 'bg-blue-500 shadow-blue-500 hover:bg-blue-400'
          )}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Spin the wheel'}
        </button>
        <div className=''>
          You have <span className='text-green-500'>{spinsLeft}</span> free
          spins
        </div>
      </div>
    </div>
  );
};
