import Logo from '~/components/logo'

export default function Loading() {
  return (
    <>
      <div className='absolute blur-sm h-full w-full'>
        <div className='bg-cover bg-[url(/img/chemistry-background.jpg)] h-dvh' />
      </div>
      <div className='grid h-dvh place-items-center relative'>
        <div className='card bg-base-100 flex flex-col items-center p-18 shadow-2xl/60'>
          <Logo className='h-60 mb-4' />
          <h1 className='italic text-4xl text-primary'>
            Loading <span className='loading loading-dots loading-xl'></span>
          </h1>
        </div>
      </div>
    </>
  )
}
