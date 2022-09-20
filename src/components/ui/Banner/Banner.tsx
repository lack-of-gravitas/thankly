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

const Banner: FC<BannerProps> = ({
  className,
  hide,
  icon,
  content,
  dismiss,
}) => {
  const brand: any = SwrBrand()

  return (
    <>
      <div
        style={{
          backgroundColor: brand.secondAccentColour
            ? brand.secondAccentColour
            : '#fff',
        }}
        className={cn(
          `relative inset-x-0 flex flex-wrap items-center justify-between `,
          className
        )}
      >
        <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
          <div className="flex items-center pr-16 sm:px-16 sm:text-center">
            {icon && icon}
            <p
              style={{
                color: brand.textColour ? brand.textColour : '#64748b',
              }}
              className="text-white "
            >
              {content && content}
            </p>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
            <span className="sr-only">Dismiss</span>
            {dismiss && dismiss}
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner
