import '@/styles/tailwind.css'
import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'

import { SWRConfig } from 'swr'
import { SwrBrand } from '@/lib/swr-helpers'

import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { MyUserContextProvider } from '@/lib/hooks/useUser'
import { StoreProvider } from '@/lib/Store'


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
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      if (typeof window.gtag !== 'undefined') {
        
        window.gtag("config", process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
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
