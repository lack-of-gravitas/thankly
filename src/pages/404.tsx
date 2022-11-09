import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'
const SEO = dynamic(() => import('@/components/common/SEO'))
const Logo = dynamic(() => import('@/components/ui/Logo'))
const Layout = dynamic(() => import('@/components/common/Layout'))

export default function NotFound() {
  return (
    <>
      <NextSeo
        title="Using More of Config"
        description="This example uses more of the available config options."
        canonical="https://www.canonical.ie/"
        openGraph={{
          url: 'https://www.url.ie/a',
          title: 'Open Graph Title',
          description: 'Open Graph Description',
          images: [
            {
              url: 'https://www.example.ie/og-image-01.jpg',
              width: 800,
              height: 600,
              alt: 'Og Image Alt',
              type: 'image/jpeg',
            },
            {
              url: 'https://www.example.ie/og-image-02.jpg',
              width: 900,
              height: 800,
              alt: 'Og Image Alt Second',
              type: 'image/jpeg',
            },
            { url: 'https://www.example.ie/og-image-03.jpg' },
            { url: 'https://www.example.ie/og-image-04.jpg' },
          ],
          siteName: 'SiteName',
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      <main className="h-screen min-h-full bg-top bg-cover sm:bg-top">
        <div className="grid px-4 py-16 mx-auto text-center max-w-7xl justify-items-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
          <Logo
            className="w-auto h-8 mx-auto mt-2 mb-10 text-4xl font-extrabold tracking-tight font-title sm:text-5xl sm:tracking-tight"
            width={150}
            height={150}
          />

          {/* <p className='mt-2 mb-10 text-4xl font-extrabold tracking-tight font-title sm:text-5xl sm:tracking-tight'>
            {`:(`}
          </p> */}
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl sm:tracking-tight">
            {`Uh oh! We think you’re lost.`}
          </h1>
          <p className="mt-2 text-lg font-medium text-opacity-50">
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
