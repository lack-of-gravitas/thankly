import dynamic from 'next/dynamic'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
// import { useAcceptCookies } from '@/lib/hooks/useAcceptCookies'
import { Button } from '@/components/ui'
import { useRouter } from 'next/router';

const Navbar = dynamic(() => import('@/components/common/Navbar'))
const Footer = dynamic(() => import('@/components/common/Footer'))
const Loading = dynamic(() => import('@/components/ui/Loading'))
const FeatureBar = dynamic(() => import('@/components/common/FeatureBar'))
import { SITE_NAME, SITE_URL, META_DESCRIPTION, TWITTER_USER_NAME } from '@/lib/constants';
import Head from 'next/head';
import {  } from '@/lib/constants';


type Meta = {
  title: string | null;
  description: string | null;
  image?: string | null;
  url?: string | null;
};


const Layout: React.FC = ({ children, brand, fullViewport = false }: any) => {
  // console.log('layout brand ->', children)
  const router = useRouter();

  const [hideCookieBar, setHideCookieBar] = useState(Cookies.get('accept_cookie') ? true : false)
  const meta = {
    title: 'Thankly',
    description: META_DESCRIPTION, image:  '/thankly_card.jpg',
    url: `${SITE_URL}${router.asPath}`
  };

  if (brand) {
    return (
      <>
        <Head>
          <title>{meta.title}</title>
          <meta property="og:title" content={meta.title} />
          <meta property="og:url" content={meta.url} />
          <meta name="description" content={meta.description} />
          <meta property="og:description" content={meta.description} />
          <meta name="twitter:site" content={`@${TWITTER_USER_NAME}`} />
          <meta name="twitter:card" content={meta.image ? 'summary_large_image' : 'summary'} />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="shortcut icon" href="/favicon.ico" />
          {/* <link
            rel="preload"
            href="https://assets.vercel.com/raw/upload/v1587415301/fonts/2/inter-var-latin.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          /> */}
          {meta.image && (
            <meta
              property="og:image"
              content={meta.image.startsWith('https://') ? meta.image : `${SITE_URL}${meta.image}`}
            />
          )}
        </Head>
        <div className="relative ">
          <Navbar data={brand ? brand : null} />
          <main>{children}</main>
          <Footer data={brand ? brand : null} />
        </div>

        {!hideCookieBar && (
          <FeatureBar
            className="fixed bottom-0 pb-2 sm:pb-5"
            icon={
              <span
                style={{
                  backgroundColor: brand.firstAccentColour
                    ? brand.firstAccentColour
                    : '#fff',
                }}
                className="flex p-2 rounded-md"
              >
                <span
                  className="w-6 h-6 text-white material-symbols-outlined"
                  aria-hidden="true"
                >
                  cookie
                </span>
              </span>
            }
            content={
              <span className="text-sm md:inline">
                This site uses cookies to improve your experience. By clicking
                accept, you agree to our{' '}
                <Link href="/privacy" passHref className="underline">
                  Privacy Policy.
                </Link>
              </span>
            }
            action={
              <Button
                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border border-transparent rounded-md shadow-sm text-slate-500 hover:bg-slate-500 hover:text-white"
                onClick={() => {
                  Cookies.set('accept_cookie', 'accepted', { expires: 365 })
                  setHideCookieBar(true)
                }}
              >
                Accept cookies
              </Button>
            }
            dismiss={
              <button
                type="button"
                onClick={() => {
                  Cookies.remove('accept_cookie')
                  setHideCookieBar(true)
                }}
                className="flex p-2 -mr-1 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Dismiss</span>
                <span
                  className="w-6 h-6 text-white material-symbols-outlined"
                  aria-hidden="true"
                >
                  close
                </span>
              </button>
            }
          />
        )}
      </>
    )
  }

  return (
    <>
      <Loading />
    </>
  )
}
export default Layout
