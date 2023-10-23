import { Protected } from '@/components/Protected';
import Homepage from '@/components/Homepage';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  // revalidatePath('/');

  return <Protected>{null}</Protected>;
}
