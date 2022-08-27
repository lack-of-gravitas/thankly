import dynamic from 'next/dynamic'
const Navbar = dynamic(() => import('@/components/common/Navbar'))
const Footer = dynamic(() => import('@/components/common/Footer'))
const Loading = dynamic(() => import('@/components/ui/Loading'))
const FeatureBar = dynamic(() => import('@/components/common/FeatureBar'))

import { useAcceptCookies } from '@/lib/hooks/useAcceptCookies'
import { Button } from '@/components/ui'

const Layout: React.FC = ({ children, brand }: any) => {
  console.log('layout brand ->', brand)
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()

  if (brand) {
    return (
      <>
        <div className="relative ">
          <Navbar data={brand ? brand : null} />
          <main>{children}</main>
          <Footer data={brand ? brand : null} />
        </div>

        <FeatureBar
          className="fixed bottom-0 pb-2 sm:pb-5"
          hide={acceptedCookies}
          icon={
            <span className="flex p-2 bg-indigo-800 rounded-md">
              <span
                className="w-6 h-6 text-white material-symbols-outlined"
                aria-hidden="true"
              >
                cookie
              </span>
            </span>
          }
          content={
            <span className="md:inline">
              This site uses cookies to improve your experience. By clicking
              accept, you agree to our{' '}
              <a href="/privacy" className="underline">
                Privacy Policy.
              </a>
            </span>
          }
          dismiss={
            <button
              type="button"
              className="flex p-2 -mr-1 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
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
          action={
            <Button
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-transparent rounded-md shadow-sm hover:bg-indigo-50"
              onClick={() => onAcceptCookies()}
            >
              Accept cookies
            </Button>
          }
        />
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
