import '@/styles/tailwind.css'
import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'

import { SWRConfig } from 'swr'
import { SwrBrand } from '@/lib/swr-helpers'

import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { MyUserContextProvider } from '@/lib/hooks/useUser'
import { StoreProvider } from '@/lib/Store'

import { DefaultSeo } from 'next-seo'
import { DefaultSeoProps } from 'next-seo'
const config: DefaultSeoProps = {
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://www.url.ie/',
    siteName: 'SiteName',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
const Noop: FC = ({ children }: any) => <>{children}</>
declare global {
  interface Window {
    gtag: any
  }
}

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const Layout = (Component as any).Layout || Noop
  const brand: any = SwrBrand()
  // console.log('_app brand->', brand)

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  // https://www.codedisciples.in/next-ga4.html
  // alternative for fucking typescript - https://stackoverflow.com/questions/68136888/types-gtag-js-error-argument-of-type-config-is-not-assignable-to-parameter
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
          page_path: url,
        })
      }
    }

    // Subscribe to the change event
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  const storeUrl =
    process.env.NEXT_PUBLIC_STORE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
  const storeBaseUrl = storeUrl ? `https://${storeUrl}` : null
  return (
    <>
      <UserProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider supabaseClient={supabaseClient}>
          <SWRConfig
            value={{
              revalidateIfStale: false,
              revalidateOnFocus: false,
              dedupingInterval: 15000,
            }}
          >
            <StoreProvider>
              <DefaultSeo
                openGraph={{
                  type: 'website',
                  locale: 'en_AU',
                  url: storeUrl,
                  siteName: brand?.name ?? 'Thankly',
                  title: brand?.seo?.title ?? 'Thankly',
                  description:
                    brand?.seo?.description ?? 'Handwritten Cards & Gifts',
                  images: [
                    {
                      url: 'https://thankly.fly.dev/assets/files/52537484-80bc-4f21-af50-39fc2ec05baa',
                      width: 800,
                      height: 600,
                      alt: 'Og Image Alt',
                    },
                    {
                      url: 'https://thankly.fly.dev/assets/files/db898710-0551-4f96-9c49-62202e524faf',
                      width: 800,
                      height: 600,
                      alt: 'Og Image Alt 2',
                    },
                  ],
                }}
                twitter={{
                  handle: '@thanklyaus',
                  site: '@thanklyaus',
                  cardType: 'summary_large_image',
                }}
              />
              <Layout pageProps={pageProps} brand={brand}>
                <Component {...pageProps} />
              </Layout>
            </StoreProvider>
          </SWRConfig>
        </MyUserContextProvider>
      </UserProvider>
    </>
  )
}
