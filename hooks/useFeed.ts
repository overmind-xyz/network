import { Comment, Post } from '@/lib/types';
import { PAGE_SIZE, feedReconciler } from '@/lib/utils';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InViewHookResponse, useInView } from 'react-intersection-observer';

export type UseFeed<T> = {
  page: number;
  items: T[];
  bottomRef: InViewHookResponse[0];
  isAtBottom: boolean;
  isAtEnd: boolean;
  isFetching: boolean;
  onFetch: (_: number) => Promise<void>;
  onReload: () => Promise<void>;
};

type Reconcile<T> = (_: T[], __: T[]) => T[];

export function useFeed<T>(
  propItems: T[],
  fetch: (_: number) => Promise<T[]>,
  reconcile: Reconcile<T>
): UseFeed<T> {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(propItems);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [bottomRef, isAtBottom] = useInView({ threshold: 0 });

  // const initialRef = useRef(false);
  // const pageRef = useRef(page);

  // useEffect(() => {
  //   async function loadInitial() {
  //     if (items.length === 0 && !initialRef.current) {
  //       setIsFetching(true);
  //       const initial = await fetch(0);

  //       setIsFetching(false);
  //       setItems(initial);
  //       initialRef.current = true;
  //     }
  //   }

  //   loadInitial().then().catch();
  // }, [items.length, fetch]);

  const onFetch = useCallback(
    async (page: number) => {
      setIsFetching(true);
      const more = await fetch(page);

      setIsFetching(false);
      setPage(page);
      setItems((items) => [...items, ...more]);

      if (more.length < PAGE_SIZE) {
        setIsAtEnd(true);
      }
    },
    [fetch]
  );

  const onReload = useCallback(async () => {
    setIsFetching(true);
    setItems([]);
    setPage(0);
    setIsAtEnd(false);

    const revalidated = await fetch(0);

    setItems(revalidated);
    setIsFetching(false);
  }, [fetch]);

  // useEffect(() => {
  //   if (isAtBottom && !isAtEnd) {
  //     console.log('onFetch', page + 1);
  //     onFetch(page + 1);
  //   }
  // }, [isAtEnd, isAtBottom, onFetch, page]);

  useEffect(() => {
    setItems((oldItems) =>
      oldItems.length > 0 ? reconcile(oldItems, propItems) : propItems
    );
  }, [propItems, reconcile]);

  return {
    page,
    items,
    bottomRef,
    isAtBottom,
    isAtEnd,
    isFetching,
    onFetch,
    onReload,
  };
}

export const useReconcilePosts = <T extends Post | Comment>(
  isComment?: boolean
): Reconcile<T> => {
  return useMemo(() => {
    return feedReconciler(isComment);
  }, [isComment]);
};
