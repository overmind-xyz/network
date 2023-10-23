import { ClaimFreeSpin } from '@/components/ClaimFreeSpin';
import { Protected } from '@/components/Protected';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getMe } from '@/lib/actions';
import { authOptions } from '@/server/auth';
import { GiftIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';

export default async function Free() {
  const session = await getServerSession(authOptions);

  return (
    <Protected>
      <div className='flex flex-col gap-6 p-6 font-matter'>
        <div className='flex w-full flex-col items-center justify-center space-y-6'>
          <div className='flex flex-col items-center space-y-9 text-center'>
            <p className='border-b border-blue-500 px-12 pb-6 font-cal text-6xl'>
              Earn a Free Spin
            </p>

            <div className='flex w-full max-w-sm flex-col gap-3 rounded border border-neutral-200 bg-neutral-300 p-3'>
              <a
                href='https://twitter.com/intent/follow?screen_name=overmind_xyz'
                target='_blank'
                className='flex flex-row items-center justify-start gap-6 rounded bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-400'
              >
                <>
                  <div className='flex'>1</div>
                  <div className='h-6 w-px rounded bg-white' />
                  <p>Follow Twitter</p>
                </>
              </a>
              <div className='h-px w-full bg-neutral-200' />
              <a
                href={`https://twitter.com/intent/tweet?text=Join%20me%20for%20%23NetworkFreeSpin%20on%20the%20%40overmind_xyz%20Network%20and%20earn%20a%20free%20spin%20for%20a%20chance%20to%20win%20$10,000%20https%3A//network.overmind.xyz/?r=${session?.user.username}`}
                target='_blank'
                className='flex flex-row items-center justify-start gap-6 rounded bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-400'
              >
                <>
                  <div className='flex'>2</div>
                  <div className='h-6 w-px rounded bg-white' />
                  <p>Post this Tweet</p>
                </>
              </a>
              <div className='h-px w-full bg-neutral-200' />
              <ClaimFreeSpin
                passedHasClaimedFreeSpin={session?.user.hasClaimedFreeSpin}
                type='overmind'
              />
            </div>
          </div>

          <div className='flex w-full flex-col items-center space-y-6 text-center'>
            <div className='rounded bg-red-500 px-3 uppercase'>new</div>
            <div className='flex w-full max-w-sm flex-col gap-3 rounded border border-neutral-200 bg-neutral-300 p-3'>
              <a
                href='https://twitter.com/intent/follow?screen_name=jacobadevore'
                target='_blank'
                className='flex flex-row items-center justify-start gap-6 rounded bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-400'
              >
                <>
                  <div className='flex'>1</div>
                  <div className='h-6 w-px rounded bg-white' />
                  <p>Follow Twitter</p>
                </>
              </a>
              <div className='h-px w-full bg-neutral-200' />
              <a
                href='https://twitter.com/jacobadevore'
                target='_blank'
                className='flex flex-row items-center justify-start gap-6 rounded bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-400'
              >
                <>
                  <div className='flex'>2</div>
                  <div className='h-6 w-px rounded bg-white' />
                  <p>Turn notifications on</p>
                </>
              </a>
              <div className='h-px w-full bg-neutral-200' />
              <a
                href={`https://twitter.com/intent/tweet?text=I'm%20OBSESSED%20with%20%23NetworkFreeSpin...%20Thanks%20%40JacobADevore%20for%20another%20free%20spin.%20https%3A//network.overmind.xyz/?r=${session?.user.username}`}
                target='_blank'
                className='flex flex-row items-center justify-start gap-6 rounded bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-400'
              >
                <>
                  <div className='flex'>3</div>
                  <div className='h-6 w-px rounded bg-white' />
                  <p>Post this Tweet</p>
                </>
              </a>
              <div className='h-px w-full bg-neutral-200' />
              <ClaimFreeSpin
                passedHasClaimedFreeSpin={session?.user.hasClaimedFreeSpinJacob}
                type='jacob'
              />
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}
