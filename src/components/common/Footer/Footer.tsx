import { FC } from 'react'
import cn from 'clsx'
import { useRouter } from 'next/router'
import type { Page } from '@/types/page'
import dynamic from 'next/dynamic'
const Logo = dynamic(() => import('@/components/ui/Logo'))

interface Props {
  data?: any
  className?: string
  children?: any
  // pages?: Page[]
}

const Footer: FC<Props | any> = ({ data, className}) => {
  console.log('footer data->', data)
  
  return (
    <>
      <footer aria-labelledby='footer-heading' className='bg-pink-50'>
        <h2 id='footer-heading' className='sr-only'>
          Footer
        </h2>
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='pb-20 border-t border-gray-200'>
            <div className='pt-16'>
              <div className='md:flex md:justify-center'>
                <Logo className='w-auto h-8' width={50} height={50} />
              </div>
            </div>
            <div className='py-10 md:flex md:items-center md:justify-between'>
              <div className='text-center md:text-left'>
                <p className='text-sm text-gray-500'>
                  {data?.name || 'Company Name '} &copy; 2022 All Rights
                  Reserved
                </p>
              </div>

              <div className='flex items-center justify-center mt-4 md:mt-0'>
                <div className='flex space-x-8'>
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
                        <a
                          key={sort}
                          href={
                            ((item.slug === 'home' || item.slug === '') &&
                              '/') ||
                            (collection === 'CustomLinks'
                              ? item.slug
                              : '/' + coll + item.slug)
                          }
                          className='pl-6 ml-6 text-sm text-gray-500 border-l border-gray-200 hover:text-gray-600'
                        >
                          {item.name}
                        </a>
                      )
                    }
                  )}
                </div>

          
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
