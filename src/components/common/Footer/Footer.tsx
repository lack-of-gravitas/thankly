import { FC } from 'react'
import cn from 'clsx'
import { useRouter } from 'next/router'
import type { Page } from '@/types/page'
import dynamic from 'next/dynamic'
import Link from 'next/link'
const Logo = dynamic(() => import('@/components/ui/Logo'))

interface Props {
  data?: any
  className?: string
  children?: any
  // pages?: Page[]
}

const Footer: FC<Props | any> = ({ data, className }) => {
  // console.log('footer data->', data)

  return (
    <>
      <footer
        // style={{
        //   backgroundColor: data.backgroundColour
        //     ? data.backgroundColour
        //     : '#fff',
        // }}
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="flex justify-center mt-8 space-x-6">
          <Link passHref href="/">
            <a>
              <Logo
                className="w-auto h-10 align-middle"
                height={'25'}
                width={'100'}
              />
            </a>
          </Link>
        </div>
        <div className="px-4 py-12 mx-auto overflow-hidden max-w-7xl sm:px-6 lg:px-8">
          <nav
            className="flex flex-wrap justify-center -mx-5 -my-2"
            aria-label="Footer"
          >
            {data.footer[0]?.item.links.map(
              ({ sort, collection, item }: any) => {
                let coll = ''

                switch (collection) {
                  case 'posts':
                    coll = 'blog/'
                    break
                  // case 'products':
                  //   coll = item.type + 's/'
                  //   break
                }
                return (
                  <Link
                    key={sort}
                    passHref
                    className="px-5 py-2"
                    href={
                      ((item.slug === 'home' || item.slug === '') && '/') ||
                      (collection === 'CustomLinks'
                        ? item.slug
                        : '/' + coll + item.slug)
                    }
                  >
                    <a
                      className="text-base text-gray-500 hover:text-gray-900"
                      // className="pl-6 ml-6 text-sm text-gray-500 border-l border-gray-200 hover:text-gray-600"
                    >
                      {item.name}
                    </a>
                  </Link>
                )
              }
            )}
          </nav>

          <p className="mt-8 text-sm text-center text-gray-400">
            {data?.name || 'Company Name '} &copy; 2022 All Rights Reserved
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer
