import { useEffect, useMemo, useState } from 'react';

export const useCountDown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(0);

  const days = useMemo(
    () =>
      typeof countDown === 'number'
        ? Math.floor(countDown / (1000 * 60 * 60 * 24))
        : 0,
    [countDown]
  );
  const hours = useMemo(
    () =>
      typeof countDown === 'number'
        ? Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        : 0,
    [countDown]
  );
  const minutes = useMemo(
    () =>
      typeof countDown === 'number'
        ? Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
        : 0,
    [countDown]
  );
  const seconds = useMemo(
    () =>
      typeof countDown === 'number'
        ? Math.floor((countDown % (1000 * 60)) / 1000)
        : 0,
    [countDown]
  );

  useEffect(() => {
    setCountDown(
      countDownDate - new Date().getTime() > 0
        ? countDownDate - new Date().getTime()
        : 0
    );
  }, [countDownDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(
        countDownDate - new Date().getTime() > 0
          ? countDownDate - new Date().getTime()
          : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return {
    total: countDown,
    days,
    hours,
    minutes,
    seconds,
  };
};
