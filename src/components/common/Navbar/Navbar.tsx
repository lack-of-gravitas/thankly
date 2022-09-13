import dynamic from 'next/dynamic'
import cn from 'clsx'

import { FC } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Disclosure, Menu } from '@headlessui/react'

const Logo = dynamic(() => import('@/components/ui/Logo'))
const Banner = dynamic(() => import('@/components/ui/Banner'))
const Button = dynamic(() => import('@/components/ui/Button'))

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
  const [open, setOpen] = useState(false)
  // console.log('navbar data->', data)
  const [bannerVisible, setBannerVisible] = useState(true)
  const { header } = data
  return (
    <>

      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex items-center flex-shrink-0">
                    <span className=" text-slate-500" aria-hidden="true">
                      <Logo className="align-middle " width={200} height={55} />
                    </span>
                    {/* <span className="ml-2 font-extrabold text-md text-slate-500 group-hover:text-slate-800">
                          {data.name || `Company Name`}
                        </span> */}

                    {/* <Link
                      className="block w-auto h-6 align-middle"
                      href="/"
                      passHref
                      aria-label="Home"
                    >
                      <a className="block w-auto h-6 align-middle">
                        <span className="" aria-hidden="true">
                          <Logo className="" width={36} height={36} />
                        </span>
                        <span className="ml-2 font-extrabold text-md text-slate-500 group-hover:text-slate-800">
                          {data.name || `Company Name`}
                        </span>
                      </a>
                    </Link> */}

                    {/* 
                    <img
                    className="block w-auto h-8 lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  />*/}
                    <img
                      className="hidden w-auto h-8 lg:block"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {/* Current: "border-indigo-500 text-slate-900", Default: "border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700" */}

                    {header?.map(({ id, item, collection }: any) => {
                      let coll = ''

                      switch (collection) {
                        case 'posts':
                          coll = 'blog/'
                          break
                        // case 'products':
                        //   coll = item.type + 's/'
                        //   break
                      }

                      return (<>
                        <Link
                          key={id}
                          href={
                            ((item.slug === 'home' || item.slug === '') && '/') ||
                            (collection === 'CustomLinks'
                              ? item.slug
                              : '/' + coll + item.slug)
                          }
                          className="inline-flex items-center px-1 text-sm font-medium text-slate-900"
                          passHref
                        > <a
                        >
                            {item.name}
                          </a> </Link>
                      </>)
                    })}

                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <div className="flex items-center justify-end flex-1">
                    <div className="flex items-center lg:ml-8">

                      {/* Desktop Profile Dropdown */}
                      {false ? <div className="flex space-x-8">
                        <div className="flex">
                          <Menu as="div" className="relative ml-3">
                            <div>
                              <Menu.Button className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                                <span className="sr-only">Open user menu</span>
                                <img
                                  className="w-8 h-8 rounded-full"
                                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                  alt=""
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white shadow-lg rounded-xs ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={cn(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-slate-700'
                                      )}
                                    >
                                      Account
                                    </a>
                                  )}
                                </Menu.Item>

                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={cn(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-slate-700'
                                      )}
                                    >
                                      Sign out
                                    </a>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div> : <>
                        <Link
                          className="flex space-x-8"
                          href={'/login'
                          }
                        >
                          <Button

                            style={{
                              backgroundColor: data.firstAccentColour
                                ? data.firstAccentColour
                                : '#fff',
                            }}
                            className="flex px-8 py-2 font-medium prose-md text-white border rounded-md shadow-xs hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                            type="button"
                          // item={item}
                          // collection={collection}
                          >
                            Sign In
                            <span className="ml-2 align-middle material-symbols-outlined">
                              arrow_forward
                            </span>
                          </Button>
                        </Link>
                      </>}

                      {/* separator */}
                      <span
                        className="w-px h-6 mx-4 bg-gray-200 lg:mx-6"
                        aria-hidden="true"
                      />

                      <div className="flow-root">
                        <Link href="#" passHref aria-label="Cart">
                          <a
                            // href="#"
                            className="flex items-center p-2 -m-2 group"
                          >
                            <span
                              style={{
                                color: data.firstAccentColour
                                  ? data.firstAccentColour
                                  : '#E69789',
                              }}
                              className="flex-shrink-0 w-6 h-6 material-symbols-outlined group-hover:text-slate-500"
                              aria-hidden="true"
                            >
                              shopping_bag
                            </span>
                            {/* <ShoppingCartIcon
                            className="flex-shrink-0 w-6 h-6 text-slate-400 group-hover:text-slate-500"
                            aria-hidden="true"
                          /> */}
                            <span
                              style={{
                                color: data.firstAccentColour
                                  ? data.firstAccentColour
                                  : '#E69789',
                              }}
                              className="ml-2 text-sm font-medium group-hover:text-slate-800"
                            >
                              0
                            </span>
                            <span className="sr-only">
                              items in cart, view bag
                            </span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center -mr-2 sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-xs text-slate-400 hover:bg-gray-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <span
                        className="block w-6 h-6 material-symbols-outlined text-slate-500"
                        aria-hidden="true"
                      >
                        close
                      </span>
                    ) : (
                      <span
                        className="block w-6 h-6 material-symbols-outlined text-slate-500"
                        aria-hidden="true"
                      >
                        menu
                      </span>
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            {/* Mobile menu */}
            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">


                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-slate-500 hover:bg-gray-50 hover:border-gray-300 hover:text-slate-700" */}
                <Disclosure.Button
                  as="a"
                  href="#"

                  className="block py-2 pl-3 pr-4 text-base font-medium hover:border-gray-300 hover:bg-gray-50 hover:text-slate-700 text-slate-900"
                >
                  Dashboard
                </Disclosure.Button>


              </div>
              {/* mobile user dropdown */}
              {false ? <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">

                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block py-2 pl-3 pr-4 text-base font-medium"
                >

                  <div className="text-base font-medium text-slate-800">
                    Tom Cook
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    tom@example.com
                  </div>

                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                >
                  Account
                </Disclosure.Button>

                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                >
                  Sign out
                </Disclosure.Button>
              </div> : <>
                <div

                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800"
                >
                  <Link
                    className="flex space-x-8"
                    href={'/login'
                    }
                  >
                    <Button

                      style={{
                        backgroundColor: data.firstAccentColour
                          ? data.firstAccentColour
                          : '#fff',
                      }}
                      className="flex px-8 py-2 font-medium prose-md text-white border rounded-md shadow-xs hover:border-slate-300"
                      type="button"
                    // item={item}
                    // collection={collection}
                    >
                      Sign In
                      <span className="ml-2 align-middle material-symbols-outlined">
                        arrow_forward
                      </span>
                    </Button>
                  </Link>
                </div>
              </>}


            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div
        style={{
          backgroundColor: data.backgroundColour
            ? data.backgroundColour
            : '#fff',
        }}
        className='bg-pink-50'
      >
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setOpen}
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
                      className="inline-flex items-center justify-center p-2 -m-2 rounded-xs text-slate-400"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <span
                        className="w-6 h-6 material-symbols-outlined text-slate-500"
                        aria-hidden="true"
                      >
                        close
                      </span>
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as="div" className="mt-2">
                    <div className="border-gray-200 ">
                      <Tab.List className="flex px-4 -mb-px space-x-8">
                        {navigation.categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              cn(
                                selected
                                  ? ' text-slate-500'
                                  : 'border-transparent text-slate-900',
                                'flex-1 whitespace-nowrap py-4 px-1 text-base font-medium'
                              )
                            }
                          >
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                  </Tab.Group>

                  <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                    {navigation.pages.map((page) => (
                      <div key={page.name} className="flow-root">
                        <a
                          href={page.href}
                          className="block p-2 -m-2 font-medium text-slate-900"
                        >
                          {page.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                    <div className="flow-root">
                      <a
                        href="#"
                        className="block p-2 -m-2 font-medium text-slate-900"
                      >
                        Create an account
                      </a>
                    </div>
                    <div className="flow-root">
                      <a
                        href="#"
                        className="block p-2 -m-2 font-medium text-slate-900"
                      >
                        Sign in
                      </a>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
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
                className="flex p-2 rounded-xs"
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
                  `rounded-xs -mr-1 flex p-2 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white`
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
      </div>
    </>
  )
}

export default Navbar

const navigation = {
  categories: [
    {
      name: 'Women',
      featured: [
        { name: 'Sleep', href: '#' },
        { name: 'Swimwear', href: '#' },
        { name: 'Underwear', href: '#' },
      ],
      collection: [
        { name: 'Everything', href: '#' },
        { name: 'Core', href: '#' },
        { name: 'New Arrivals', href: '#' },
        { name: 'Sale', href: '#' },
      ],
      categories: [
        { name: 'Basic Tees', href: '#' },
        { name: 'Artwork Tees', href: '#' },
        { name: 'Bottoms', href: '#' },
        { name: 'Underwear', href: '#' },
        { name: 'Accessories', href: '#' },
      ],
      brands: [
        { name: 'Full Nelson', href: '#' },
        { name: 'My Way', href: '#' },
        { name: 'Re-Arranged', href: '#' },
        { name: 'Counterfeit', href: '#' },
        { name: 'Significant Other', href: '#' },
      ],
    },
    {
      name: 'Men',
      featured: [
        { name: 'Casual', href: '#' },
        { name: 'Boxers', href: '#' },
        { name: 'Outdoor', href: '#' },
      ],
      collection: [
        { name: 'Everything', href: '#' },
        { name: 'Core', href: '#' },
        { name: 'New Arrivals', href: '#' },
        { name: 'Sale', href: '#' },
      ],
      categories: [
        { name: 'Artwork Tees', href: '#' },
        { name: 'Pants', href: '#' },
        { name: 'Accessories', href: '#' },
        { name: 'Boxers', href: '#' },
        { name: 'Basic Tees', href: '#' },
      ],
      brands: [
        { name: 'Significant Other', href: '#' },
        { name: 'My Way', href: '#' },
        { name: 'Counterfeit', href: '#' },
        { name: 'Re-Arranged', href: '#' },
        { name: 'Full Nelson', href: '#' },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}
