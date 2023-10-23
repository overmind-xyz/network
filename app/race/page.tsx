export default function Race() {
  return (
    <div className='flex w-full flex-row'>
      {/* <div className="flex h-16 flex-row items-center border-b border-neutral-300 bg-neutral-400 px-6">
          <Link href="/" className="mr-2">
            <Image src="/logo.svg" className="hidden sm:block" alt="Overmind Logo" width={139} height={24} />
            <Image
              src="/icon-light.svg"
              className="block sm:hidden"
              alt="Overmind Logo"
              width={32}
              height={32}
            />
          </Link>
        </div> */}

      <div className='fixed h-screen w-16 bg-blue-500'>
        <div className='rotate-90 text-5xl font-extrabold'>
          <marquee>Race for the Keys.</marquee>
        </div>
      </div>
      <div className='flex flex-1 flex-col pl-16'>
        <div className='flex flex-col space-y-12 border-b border-neutral-300 bg-neutral-400 p-9 font-matter'>
          <div className='flex flex-col items-center justify-center space-y-6 font-cal text-8xl font-bold uppercase'>
            <p
              className='text-6xl text-transparent'
              style={{ WebkitTextStroke: 1, WebkitTextStrokeColor: 'white' }}
            >
              Welcome to
            </p>
            <p className='border-b-4 border-blue-500 px-12 pb-6'>
              Race for the Keys
            </p>
          </div>
          <p className='text-neutral-100'>
            You will have a chance to win the fastest growing projects on Aptos
          </p>
        </div>
      </div>
    </div>
  );
}
