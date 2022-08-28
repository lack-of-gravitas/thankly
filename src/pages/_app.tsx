import '@/styles/tailwind.css'
import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'

import { SWRConfig } from 'swr'
import { SwrBrand } from '@/lib/swr-helpers'

import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { MyUserContextProvider } from '@/lib/hooks/useUser'

const Noop: FC = ({ children }: any) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop
  const brand: any = SwrBrand()
  // console.log('_app brand->', brand)

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

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
            <Layout pageProps={pageProps} brand={brand}>
              <Component {...pageProps} />
            </Layout>
          </SWRConfig>
        </MyUserContextProvider>
      </UserProvider>
    </>
  )
}
