'use client';
import { api } from '@/trpc/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  tweetURL: string;
};

export const ClaimFreeSpin = ({
  passedHasClaimedFreeSpin,
  type,
}: {
  passedHasClaimedFreeSpin: boolean;
  type: 'overmind' | 'jacob';
}) => {
  const [hasClaimedFreeSpin, setHasClaimedFreeSpin] = useState(
    passedHasClaimedFreeSpin
  );

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const tweetId = data.tweetURL.split('/status/')[1]?.toString();

    if (!tweetId) return setError('tweetURL', { message: 'Invalid Tweet URL' });

    tweetValidationMutation.mutate({
      tweetId,
      type,
    });
  };

  const tweetValidationMutation = api.twitter.validateFreeSpinTweet.useMutation(
    {
      onSuccess: () => {
        setHasClaimedFreeSpin(true);
      },
      onError: (err) => {
        console.log(err.message);
        if (err.message.includes('refresh token')) {
          return signIn('twitter');
        }
        setError('tweetURL', { message: err.message });
      },
    }
  );

  if (hasClaimedFreeSpin)
    return (
      <div className='w-full bg-green-500/10 py-2 text-green-500'>
        Free Spin Claimed
      </div>
    );

  return (
    <>
      <div className='text-left font-matter text-sm text-neutral-100'>
        <p>Posted Tweet URL</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        {/* register your input into the hook by invoking the "register" function */}
        <input
          {...register('tweetURL', { required: true })}
          className='rounded border border-neutral-200 bg-neutral-400 px-3 py-1'
        />

        {errors.tweetURL && errors.tweetURL.message && (
          <span className='pb-1 text-left font-matter text-sm text-red-500'>
            {errors.tweetURL.message}
          </span>
        )}

        <input
          type='submit'
          className='rounded bg-white px-3 py-1.5 text-neutral-950 hover:cursor-pointer hover:bg-neutral-50'
        />
      </form>
    </>
  );
};
