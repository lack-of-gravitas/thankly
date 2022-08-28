import dynamic from 'next/dynamic'
const Logo = dynamic(() => import('@/components/ui/Logo'))
const Layout = dynamic(() => import('@/components/common/Layout'))

export default function NotFound() {
  return (
    <>
      <main
        className='h-screen min-h-full bg-top bg-cover bg-pink-50 sm:bg-top'
        // style={{
        //   backgroundImage:
        //     'url('https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75')',
        // }}
      >
        <div className='grid px-4 py-16 mx-auto text-center justify-items-center max-w-7xl sm:px-6 sm:py-24 lg:px-8 lg:py-48'>
        <Logo className='w-auto h-8 mx-auto mt-2 mb-10 text-4xl font-extrabold tracking-tight font-title sm:text-5xl sm:tracking-tight' width={50} height={50} />

          {/* <p className='mt-2 mb-10 text-4xl font-extrabold tracking-tight font-title sm:text-5xl sm:tracking-tight'>
            {`:(`}
          </p> */}
          <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl sm:tracking-tight'>
            {`Uh oh! We think you’re lost.`}
          </h1>
          <p className='mt-2 text-lg font-medium text-opacity-50'>
            {` It looks like the page you’re looking for doesn't exist. Hit the back button or select an option from the Menu.`}
          </p>
          {/* <div className='mt-6'>
            
            <a
              href='/'
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-black text-opacity-75 bg-white bg-opacity-75 border border-transparent rounded-md sm:bg-opacity-25 sm:hover:bg-opacity-50'
            >
              Go back home
            </a>
          </div> */}
        </div>
      </main>

      
    </>
  )
}

NotFound.Layout = Layout
