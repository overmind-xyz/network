import { BackLink } from '@/components/backLink';
import { getFollowersPage } from '@/lib/storage';
import { Avatar } from '@/components/avatar';
import Link from 'next/link';
import { FollowPage } from '@/components/followPage';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/actions';
import { MeProvider } from '@/contexts/me';

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const me = await getMe();

  if (!me) {
    redirect('/');
  }

  const page = await getFollowersPage(username, 0);

  if (!page) {
    return null;
  }

  return (
    <MeProvider value={me}>
      <FollowPage data={page} mode='followers' />
    </MeProvider>
  );
}
