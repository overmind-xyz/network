import { CopyIcon, TwitterIcon, UserPlus, XIcon } from 'lucide-react';
import Image from 'next/image';
import { ServerActionForm } from './serverActionForm';
import { setInviteCode } from '@/lib/actions';
import { CopyButton, NewCopyButton } from './CopyButton';
import { Wheel } from './Wheel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ReferredUserType = {
  image: string | null;
  name: string;
  username: string;
};

export const Referral = ({
  id,
  username,
  referral,
  referrals,
}: {
  id: string;
  username: string;
  referral: ReferredUserType | null;
  referrals: ReferredUserType[];
}) => {
  return (
    <div className='flex flex-col-reverse md:flex-row md:space-x-6'>
      <div className='flex w-full items-start justify-center px-6 py-9 md:min-h-screen md:max-w-xl md:border-r md:border-neutral-300 md:bg-neutral-400 md:py-16'>
        <div className='w-full max-w-md rounded border border-neutral-200 bg-neutral-300 px-6 py-6'>
          <div className='flex w-full flex-col items-center space-y-6 text-center'>
            <div className='flex flex-col space-y-4 font-cal text-2xl sm:text-5xl'>
              <p>Network is</p>
              <p className='bg-red-500 px-6 font-matter italic'>invite only</p>
              <div className='pt-2 font-matter text-base text-neutral-100 sm:text-lg'>
                <p>To gain access to Network you</p>
                <p>must invite 2 friends.</p>
              </div>
            </div>

            <div className='flex flex-col space-y-6 pt-3 sm:flex-row sm:space-x-16 sm:space-y-0'>
              {referrals?.map((referral) => (
                <ReferredUser key={referral.username} referral={referral} />
              ))}
              {new Array(2 - referrals.length)
                .fill(undefined)
                ?.map((_, index) => <ReferredUser key={index} />)}
            </div>

            <div className='pt-3'>
              <Dialog>
                <DialogTrigger asChild>
                  <p className='font-matter text-sm text-blue-500 hover:cursor-pointer hover:underline'>
                    Why 2 friends?
                  </p>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Network only works with friends</DialogTitle>
                    <DialogDescription>
                      Invite 2 friends and get access first. Space is limited
                      whilst Network is in early access.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className='flex w-full flex-col space-y-2 text-left'>
              <p className='text-sm text-neutral-100'>Invitation code</p>
              <div className='flex w-full flex-row items-center justify-center'>
                <input
                  className='h-11 w-full truncate rounded-bl rounded-tl border border-neutral-200 bg-neutral-300 px-4 lowercase outline-0 focus:border-neutral-100'
                  value={username}
                  readOnly
                />
                <CopyButton copyValue={username} />
              </div>
            </div>

            <div className='flex flex-row items-center justify-center space-x-3'>
              <a
                href={`https://twitter.com/intent/tweet?text=I'm%20trying%20to%20get%20into%20the%20%40overmind_xyz%20network%20--%20sign%20up%20with%20my%20invite%20code%20to%20help%20get%20me%20in!%0A%0Ahttps%3A//network.overmind.xyz/?r=${username}`}
                target='_blank'
                className='flex flex-row items-center justify-center space-x-2 rounded-full border border-neutral-100/50 bg-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-100/25'
              >
                <TwitterIcon className='h-5 w-5' />
                <p>Post</p>
              </a>

              <NewCopyButton
                copyValue={`https://network.overmind.xyz/?r=${username}`}
              >
                Copy Link
              </NewCopyButton>
            </div>

            <div className='flex w-full max-w-sm flex-col space-y-6 border-t border-neutral-200 font-matter'>
              {referral && (
                <div className='flex w-full flex-col items-center space-y-3 pt-3 font-matter'>
                  <p className='text-sm text-neutral-100'>Invited by</p>
                  <div className='flex w-full flex-row items-center space-x-3 rounded-xl bg-neutral-200 p-4 text-left'>
                    <Image
                      src={referral.image?.replace('_normal', '') ?? ''}
                      alt={`${referral.username}'s profile picture`}
                      width={48}
                      height={48}
                      className='h-12 w-12 rounded-full bg-neutral-100'
                    />
                    <div className='flex flex-col'>
                      <p className='text-lg text-white'>{referral.name}</p>
                      <p className='text-sm font-normal text-neutral-100'>
                        @{referral.username}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!referral && (
                <div className='flex flex-col space-y-4 rounded-xl bg-neutral-300 p-4 text-left'>
                  <div className='flex w-full flex-col text-center'>
                    <p className='font-matter text-xl'>
                      Were you invited by a friend?
                    </p>

                    <ServerActionForm
                      action={setInviteCode}
                      className='flex w-full flex-col space-y-4'
                    >
                      <input
                        className='h-11 truncate rounded border border-neutral-100 border-opacity-50 bg-neutral-200 px-4 lowercase outline-0 focus:border-neutral-100'
                        placeholder='Invitation code'
                        name='inviteCode'
                      />

                      <button
                        type='submit'
                        className='h-11 rounded bg-blue-500 text-sm hover:bg-blue-400'
                      >
                        Set code
                      </button>
                    </ServerActionForm>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Wheel isDemo={true} />
    </div>
  );
};

const ReferredUser = ({ referral }: { referral?: ReferredUserType }) => {
  if (!referral) {
    return (
      <div className='flex flex-col items-center space-y-3 font-matter text-neutral-100'>
        <div className='flex h-24 w-24 items-center justify-center rounded-full border border-neutral-300 bg-neutral-400'>
          <UserPlus className='h-9 w-9 text-neutral-100' />
        </div>
        <div className='flex flex-col text-center'>
          <p>No friend</p>
          <p>invited yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center space-y-3 font-matter text-neutral-100'>
      <Image
        src={referral.image?.replace('_normal', '') ?? ''}
        alt={`${referral.username}'s profile picture`}
        width={96}
        height={96}
        className='h-24 w-24 rounded-full bg-neutral-100'
      />
      <div className='flex flex-col'>
        <p className='text-lg text-white'>{referral.name}</p>
        <p className='text-sm font-normal'>@{referral.username}</p>
      </div>
    </div>
  );
};
