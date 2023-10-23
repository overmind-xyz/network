import { cn } from '@/lib/utils';

export function Modal({
  children,
  isOpen,
  onClose,
}: { isOpen?: boolean; onClose?: () => void } & React.PropsWithChildren) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 top-0 z-40 flex h-full w-full items-center justify-center transition-transform',
        isOpen ? 'flex' : 'hidden'
      )}
    >
      <div
        className='fixed h-full w-full'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose || undefined}
      />
      <div className='z-50 flex h-[600px] w-[400px] items-center justify-center gap-4 rounded-md bg-[#222] p-6'>
        {children}
      </div>
    </div>
  );
}
