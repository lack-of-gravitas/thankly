import dynamic from 'next/dynamic'
import cn from 'clsx'

import { FC } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Disclosure, Menu } from '@headlessui/react'

const Logo = dynamic(() => import('@/components/ui/Logo'))
const Banner = dynamic(() => import('@/components/ui/Banner'))
const Button = dynamic(() => import('@/components/ui/Button'))
const Icon = dynamic(() => import('@/components/common/Icon'))

import Link from 'next/link'
import { data } from 'autoprefixer'

interface Link {
  href: string
  label: string
}

interface NavbarProps {
  data?: any
  className?: string
  children?: any
}

const Navbar: FC<NavbarProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  // console.log('navbar data->', data)
  const [bannerVisible, setBannerVisible] = useState(true)
  const { header } = data
  return (
    <>
      <Icon name={`arrow_forward`} />
      <Icon name={`shopping_bag`} />
      <Icon name={`menu`} />
      <Icon name={`close`} />
      <Logo className="w-auto h-10 align-middle" height={'25'} width={'100'} />
      

      {data.banner && (
        <Banner
          className={cn(!bannerVisible ? `hidden ` : ``, `pb-2 sm:pb-5`)}
          icon={
            <span
              style={{
                backgroundColor: data.firstAccentColour
                  ? data.firstAccentColour
                  : '#fff',
              }}
              className="flex p-2 rounded-md"
            >
              <span
                className="w-6 h-6 text-white material-symbols-outlined"
                aria-hidden="true"
              >
                {data.banner.icon}
              </span>
            </span>
          }
          content={
            <span className="text-sm md:inline">{data.banner.content}</span>
          }
          dismiss={
            <button
              onClick={() => setBannerVisible(false)}
              type="button"
              className={cn(
                `-mr-1 flex rounded-md p-2 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white`
              )}
            >
              <span className="sr-only">Dismiss</span>
              <span
                className="w-6 h-6 material-symbols-outlined text-slate-500 hover:text-white"
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

export default Navbar
