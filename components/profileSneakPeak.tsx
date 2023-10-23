import Image from 'next/image';
import { Button } from './ui/button';
import { UserInfo } from '@/lib/types';

export default function ProfileSneakPeak(props: { user: UserInfo }) {
  return (
    <div className='flex w-64 flex-col items-center justify-start gap-2'>
      <div className='flex w-full flex-row items-start justify-between'>
        <Image
          className='rounded-full'
          src={
            props.user.imgSrc?.replace('_normal', '') ||
            'https://picsum.photos/50'
          }
          alt='demo profile pic'
          width='50'
          height='50'
        />
        <Button className='h-8 rounded-full'>Follow</Button>
      </div>
      <div className='flex w-full flex-col items-start justify-start'>
        <span>{props.user.name}</span>
        <div className='flex flex-row gap-1'>
          <span>@{props.user.username}</span>
          {/* <span className='rounded-xl bg-accent'>Follows you</span> */}
        </div>
      </div>
      <div className='flex flex-row items-center justify-start gap-6'>
        <div className='flex flex-row gap-1'>
          <span>{props.user.following}</span>
          <span>Following</span>
        </div>
        <div className='flex flex-row gap-1'>
          <span>{props.user.followers}</span>
          <span>Followers</span>
        </div>
      </div>
    </div>
  );
}
