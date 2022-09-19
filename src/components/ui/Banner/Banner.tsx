import cn from 'clsx'
// import s from './Marquee.module.css'
import { FC, ReactNode, Component, Children } from 'react'

import { SwrBrand } from '@/lib/swr-helpers'

interface BannerProps {
  className?: string
  hide?: boolean
  dismiss?: React.ReactNode

  // title: string
  // description?: string
  icon?: React.ReactNode
  content?: React.ReactNode
}

const Banner: FC<BannerProps> = ({ className, hide, icon, content,dismiss }) => {
  const brand: any = SwrBrand()

  return (
    <div className={cn(`inset-x-0 `, className)}>
        <div className='px-2 mx-auto md:pt-5 max-w-7xl sm:px-6 lg:px-8'>
          <div 
          
          style={{
            backgroundColor: brand.secondAccentColour
              ? brand.secondAccentColour
              : '#fff',
          }}
          className='p-2 rounded-md shadow-md sm:p-3'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex items-center flex-1 w-0'>
                {icon && icon}

                <p 
                style={{
                  color: brand.textColour
                    ? brand.textColour
                    : '#64748b',
                }}
                className='ml-3 text-sm font-medium'>
                  {content && content}
                </p>
              </div>
              <div className='flex-shrink-0 order-2 sm:order-3 sm:ml-2'>
                {dismiss && dismiss}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Banner
