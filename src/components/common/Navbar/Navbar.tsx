import dynamic from 'next/dynamic'
import cn from 'clsx'

import { FC } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Disclosure, Menu } from '@headlessui/react'

const Logo = dynamic(() => import('@/components/ui/Logo'))
const Banner = dynamic(() => import('@/components/ui/Banner'))
const Icon = dynamic(() => import('@/components/common/Icon'))

import Link from 'next/link'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [open, setOpen] = useState(false)
  // console.log('navbar data->', data)
  const [bannerVisible, setBannerVisible] = useState(true)
  const { header } = data
  return (
    <>
      <div className="bg-white">
        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl">
                  <div className="flex px-4 pt-5 pb-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <Icon name={`close`} />
                    </button>
                  </div>

                  <div className="px-4 py-6 space-y-6 ">
                    <Link passHref href="/">
                      <a>
                        <span className="sr-only">{data.name}</span>
                        <Logo
                          className="w-auto h-8"
                          height={'25'}
                          width={'80'}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="px-4 pb-6 space-y-6 ">
                    {header.map(({ sort, collection, item }: any) => {
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
                          className="block p-2 -m-2 font-medium text-gray-900"
                          href={
                            ((item.slug === 'home' || item.slug === '') &&
                              '/') ||
                            (collection === 'CustomLinks'
                              ? item.slug
                              : '/' + coll + item.slug)
                          }
                        >
                          <a>{item.name}</a>
                        </Link>
                      )
                    })}
                  </div>
                  {/* mobile menu options */}
                  {true  ? (
                    <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                      <div className="flow-root">
                        <a
                          href="#"
                          className="block p-2 -m-2 font-medium text-gray-900"
                        >
                          Your account
                        </a>
                      </div>
                      <div className="flow-root">
                        <a
                          href="#"
                          className="block p-2 -m-2 font-medium text-gray-900"
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Hero section */}
        <div className="relative">
          {/* Navigation */}
          <header className="relative z-10">
            <nav aria-label="Top">
              {/* Top navigation */}
              {data.banner && (
                <Banner
                  className={cn(!bannerVisible ? `hidden ` : ``, ``)}
                  icon={
                    <span className="mr-2">
                      <Icon name={data.banner.icon} />
                    </span>
                  }
                  content={
                    <span className="text-sm text-slate-500 md:inline">
                      {data.banner.content}
                    </span>
                  }
                  dismiss={
                    <button
                      onClick={() => setBannerVisible(false)}
                      type="button"
                      className="flex pt-3 mr-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">Dismiss</span>
                      <Icon className="hover:text-white" name={`close`} />
                    </button>
                  }
                />
              )}

              {/* Secondary navigation */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md backdrop-filter">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div>
                    <div className="flex items-center justify-between h-16">
                      {/* Logo (lg+) */}
                      <div className="hidden lg:flex lg:flex-1 lg:items-center">
                        <Link passHref href="/">
                          <a>
                            <span className="sr-only">{data.name}</span>
                            <Logo
                              className="w-auto h-8"
                              height={'25'}
                              width={'80'}
                            />
                          </a>
                        </Link>
                      </div>

                      <div className="hidden h-full lg:flex">
                        {/* Flyout menus */}
                        <Popover.Group className="inset-x-0 bottom-0 px-4">
                          <div className="flex justify-center h-full space-x-8">
                            {header.map(({ sort, collection, item }: any) => {
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
                                  className="flex items-center text-sm font-medium text-slate-500"
                                  href={
                                    ((item.slug === 'home' ||
                                      item.slug === '') &&
                                      '/') ||
                                    (collection === 'CustomLinks'
                                      ? item.slug
                                      : '/' + coll + item.slug)
                                  }
                                >
                                  <a>{item.name}</a>
                                </Link>
                              )
                            })}

                            {/* {navigation.pages.map((page) => (
                              <a
                                key={page.name}
                                href={page.href}
                                className="flex items-center text-sm font-medium text-slate-500"
                              >
                                {page.name}
                              </a>
                            ))} */}
                          </div>
                        </Popover.Group>
                      </div>

                      {/* Mobile menu and search (lg-) */}
                      <div className="flex items-center flex-1 lg:hidden">
                        <button
                          type="button"
                          className="p-2 -ml-2 text-slate-500"
                          onClick={() => setMobileMenuOpen(true)}
                        >
                          <span className="sr-only">Open menu</span>
                          {/* <Bars3Icon className="w-6 h-6" aria-hidden="true" /> */}
                          <Icon name={`menu`} />
                        </button>

                        {/* Search */}
                        {/* <a href="#" className="p-2 ml-2 text-white">
                        <span className="sr-only">Search</span>
                        <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
                      </a> */}
                      </div>

                      {/* Logo (lg-) */}
                      <Link passHref href="/" className="lg:hidden">
                        <a>
                          <span className="sr-only">{data.name}</span>
                          <Logo
                            className="w-auto h-8"
                            height={'25'}
                            width={'80'}
                          />
                        </a>
                      </Link>

                      <div className="flex items-center justify-end flex-1">
                        {/* <a
                          href="#"
                          className="hidden text-sm font-medium text-white lg:block"
                        >
                          Search
                        </a> */}

                        <div className="flex items-center lg:ml-8">
                          {/* Cart */}

                          {/* Profile dropdown */}
                          {true  ? (
                            <Menu
                              as="div"
                              className="relative pr-4 ml-3 border-r border-slate-300 "
                            >
                              <div>
                                <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                  <span className="sr-only">
                                    Open user menu
                                  </span>
                                  <img
                                    className="w-8 h-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                  />
                                </Menu.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        className={cn(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                      >
                                        Your Account
                                      </a>
                                    )}
                                  </Menu.Item>

                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        href="#"
                                        className={cn(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                      >
                                        Sign out
                                      </a>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          ) : (
                            <></>
                          )}

                          <div className="flow-root ml-4 lg:ml-4">

                          <Popover className="flow-root text-sm lg:relative ">
                <Popover.Button className="flex items-center p-2 -m-2 group">
                <Icon
                                className="flex-shrink-0 group-hover:text-gray-500"
                                name={`shopping_bag`}
                              />
                               {/* <ShoppingBagIcon
                    className="flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  /> */}
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                  <span className="sr-only">items in cart, view bag</span>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:top-full lg:left-auto lg:right-0 lg:mt-3 lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                    <h2 className="sr-only">Shopping Cart</h2>

                    <form className="max-w-2xl px-4 mx-auto">
                      <ul role="list" className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <li key={product.id} className="flex items-center py-6">
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              className="flex-none w-16 h-16 border border-gray-200 rounded-md"
                            />
                            <div className="flex-auto ml-4">
                              <h3 className="font-medium text-gray-900">
                                <a href={product.href}>{product.name}</a>
                              </h3>
                              <p className="text-gray-500">{product.color}</p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Checkout
                      </button>

                      <p className="mt-6 text-center">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          View Shopping Bag
                        </a>
                      </p>
                    </form>
                  </Popover.Panel>
                </Transition>
              </Popover>


                            {/* <a
                              href="#"
                              className="flex items-center p-2 -m-2 group"
                            >
                              <Icon
                                className="flex-shrink-0"
                                name={`shopping_bag`}
                              />

                              <span className="ml-2 text-sm font-medium text-slate-500">
                                0
                              </span>
                              <span className="sr-only">
                                items in cart, view bag
                              </span>
                            </a> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </div>
      </div>
    </>
  )
}

export default Navbar


const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  // More products...
]