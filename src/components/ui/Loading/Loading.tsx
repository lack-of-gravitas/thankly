import dynamic from 'next/dynamic'
const Logo = dynamic(() => import('@/components/ui/Logo'))

export default function Loading() {
  return (
    <>
      <div className='flex items-center justify-center mt-4 animate-pulse text-slate-700 md:mt-0'>
        <span className='flex items-center text-slate-500'>
          <Logo
            className='flex items-center justify-center flex-shrink-0 text-center align-middle material-symbols-outlined animate-pulse'
            
            width={50}
            height={50}
          />

          <h2 className='ml-3 text-2xl font-extrabold font-title'>Thankly</h2>
        </span>
      </div>
    </>
  )
}
