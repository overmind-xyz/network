'use client';

import { ServerActionForm } from '@/components/serverActionForm';
import { WinScreen } from '@/components/winScreen';
import { ServerAction } from '@/lib/types';
import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { api } from '@/trpc/react';
import { mainnet } from '@/lib/aptos';
import { useDebounce } from 'usehooks-ts';
import { AlertCircleIcon, CheckCircle, Star } from 'lucide-react';
import { Currency } from '@/components/currency';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type Value = {
  setAmount: Dispatch<SetStateAction<number>>;
};

const WinScreenContext = createContext<Value>({
  setAmount: () => {},
});

export function WinScreenProvider({
  amount: propsAmount,
  hasWithdrawAddress,
  children,
}: {
  amount: number;
  hasWithdrawAddress: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const [amount, setAmount] = useState(propsAmount);
  const [address, setAddress] = useState('');
  const dbAddress = useDebounce(address);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isError, setIsError] = useState(false);
  const isTouched = useRef(false);

  useEffect(() => {
    async function verify(a: string) {
      setIsVerifying(true);
      await mainnet.getAccount(a);
    }

    dbAddress.length > 0 &&
      verify(dbAddress)
        .then(() => setIsError(false))
        .catch(() => setIsError(true))
        .finally(() => setIsVerifying(false));
  }, [dbAddress]);

  return (
    <WinScreenContext.Provider value={{ setAmount }}>
      {amount > 0 && !hasWithdrawAddress && <WinScreen amount={amount} />}
      {children}
    </WinScreenContext.Provider>
  );
}

export const useWinScreen = () => useContext(WinScreenContext);
