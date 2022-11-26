import '@/styles/tailwind.css'
import { FC, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'

import { SWRConfig } from 'swr'
import { SwrBrand } from '@/lib/swr-helpers'

import { StoreProvider } from '@/lib/Store'
import { Auth } from '@supabase/auth-ui-react'
// import { supabase } from '@/lib/initSupabase'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'


const Noop: FC = ({ children }: any) => <>{children}</>
declare global {
  interface Window {
    gtag: any
  }
}

export default function MyApp({ Component, pageProps, router }: AppProps<{

  initialSession: Session

}>) {
  const Layout = (Component as any).Layout || Noop
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
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
        window.gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
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

      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <SWRConfig
          value={{
            revalidateIfStale: false,
            revalidateOnFocus: false,
            dedupingInterval: 15000,
          }}
        >
          <StoreProvider>

            <Layout pageProps={pageProps} brand={brand}>
              <Component {...pageProps} />
            </Layout>
          </StoreProvider>
        </SWRConfig>
      </SessionContextProvider>

    </>
  )
}
