import { Spinner } from './spinner';

export function LoadMore({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className='flex h-16 w-full items-center justify-center text-base text-white hover:bg-gray-900/10'
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : 'Load More'}
    </button>
  );
}
