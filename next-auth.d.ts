import { DefaultUser } from 'next-auth';

export type { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User extends Omit<DefaultUser, 'id'> {
    id: PrismaUser['id'];
    username: PrismaUser['username'];
    name: PrismaUser['name'];
    image: PrismaUser['image'];
    created_at: PrismaUser['created_at'];
    hasCompletedReferral: PrismaUser['hasCompletedReferral'];
    privateKey: PrismaUser['privateKey'];
    is_created: PrismaUser['is_created'];
    is_banned: PrismaUser['is_banned'];
    withdrawAddress: PrismaUser['withdrawAddress'];
    hasClaimedFreeSpin: PrismaUser['hasClaimedFreeSpin'];
    hasClaimedFreeSpinJacob: PrismaUser['hasClaimedFreeSpinJacob'];
  }
}
