import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Comment, Post } from './types';
import {
  add,
  formatISO,
  formatISO9075,
  fromUnixTime,
  isAfter,
  isBefore,
  sub,
} from 'date-fns';
import { format } from 'date-fns/esm';

export const STAFF_USERNAMES = ['jacobadevore', 'keithingra2872', 'adam_tehc'];

export const PAGE_SIZE = 20;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripUsername(username: string): string {
  return username.replace(/^(%40|@)/, '');
}

export function isParent(post: Post | Comment): post is Post {
  try {
    return typeof (post as Post).commentCount === 'number';
  } catch (e) {
    return false;
  }
}

export function randomNumber(max: number, isZeroable = false) {
  return Math.max(isZeroable ? 0 : 1, Math.round(Math.random() * max));
}

export function randomDate(
  end: Date = new Date(),
  start: Date = sub(end, { weeks: 1 })
) {
  return formatISO(
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    )
  );
}

export function arrayOfSize(size: number): number[] {
  return new Array(size).fill(null).map((_, i) => i);
}

export function tsToLocalDate(timestamp: number | string): Date {
  const date = fromUnixTime(parseInt(`${timestamp}`, 10));

  return date;
}

export function byNewest<T extends Post | Comment>(a: T, b: T): number {
  return isBefore(fromUnixTime(a.timestamp), fromUnixTime(b.timestamp))
    ? 1
    : -1;
}

export function byOldest<T extends Post | Comment>(a: T, b: T): number {
  return isAfter(fromUnixTime(a.timestamp), fromUnixTime(b.timestamp)) ? 1 : -1;
}

function feedKey<T extends Comment | Post>(obj: T): string {
  return `${obj.id}-${obj.author.username}`;
}

function toObject<T extends Comment | Post>(arr: T[]): Record<string, T> {
  return arr.reduce(
    (res, p) => ({
      ...res,
      [feedKey(p)]: p,
    }),
    {}
  );
}

export const feedReconciler =
  (isComment?: boolean) =>
  <T extends Comment | Post>(a: T[], b: T[]): T[] => {
    const oldDict = toObject(a);
    const newDict = toObject(b);

    return Object.values(Object.assign({}, oldDict, newDict)).sort(
      isComment ? byOldest : byNewest
    );
  };

export function isStaff(username: string): boolean {
  return STAFF_USERNAMES.includes(stripUsername(username).toLowerCase());
}