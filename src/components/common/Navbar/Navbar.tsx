import dynamic from 'next/dynamic'
import cn from 'clsx'

import { FC } from 'react'
import { Container } from '@/components/ui'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
const Logo = dynamic(() => import('@/components/ui/Logo'))
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

  {
    /* Logo (lg+) */
  }
  //   <div className='flow-root align-middle'>

  // </div>
  {
    /* 



                        <span
                                className='w-6 h-6 material-symbols-outlined text-slate-500'
                                aria-hidden='true'
                              >
                                person
                              </span>    

                              
*/
  }

  return (
    <>
      <div className='bg-white'>
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-40 lg:hidden'
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-black bg-opacity-25' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl'>
                  <div className='flex px-4 pt-5 pb-2'>
                    <button
                      type='button'
                      className='inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md'
                      onClick={() => setOpen(false)}
                    >
                      <span className='sr-only'>Close menu</span>
                      <span
                        className='w-6 h-6 material-symbols-outlined text-slate-500'
                        aria-hidden='true'
                      >
                        cross
                      </span>
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as='div' className='mt-2'>
                    <div className='border-b border-gray-200'>
                      <Tab.List className='flex px-4 -mb-px space-x-8'>
                        {navigation.categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              cn(
                                selected
                                  ? 'border-indigo-600 text-indigo-600'
                                  : 'border-transparent text-gray-900',
                                'flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium'
                              )
                            }
                          >
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                      {navigation.categories.map((category) => (
                        <Tab.Panel
                          key={category.name}
                          className='px-4 py-6 space-y-12'
                        >
                          <div className='grid grid-cols-2 gap-x-4 gap-y-10'>
                            {category.featured.map((item) => (
                              <div key={item.name} className='relative group'>
                                <div className='overflow-hidden bg-gray-100 rounded-md aspect-w-1 aspect-h-1 group-hover:opacity-75'>
                                  <img
                                    src={item.imageSrc}
                                    alt={item.imageAlt}
                                    className='object-cover object-center'
                                  />
                                </div>
                                <a
                                  href={item.href}
                                  className='block mt-6 text-sm font-medium text-gray-900'
                                >
                                  <span
                                    className='absolute inset-0 z-10'
                                    aria-hidden='true'
                                  />
                                  {item.name}
                                </a>
                                
                              </div>
                            ))}
                          </div>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className='px-4 py-6 space-y-6 border-t border-gray-200'>
                    {navigation.pages.map((page) => (
                      <div key={page.name} className='flow-root'>
                        <a
                          href={page.href}
                          className='block p-2 -m-2 font-medium text-gray-900'
                        >
                          {page.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className='px-4 py-6 space-y-6 border-t border-gray-200'>
                    <div className='flow-root'>
                      <a
                        href='#'
                        className='block p-2 -m-2 font-medium text-gray-900'
                      >
                        Create an account
                      </a>
                    </div>
                    <div className='flow-root'>
                      <a
                        href='#'
                        className='block p-2 -m-2 font-medium text-gray-900'
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

        <header className='relative'>
          <nav aria-label='Top'>
            {/* Primary navigation */}
            <div className='bg-white'>
              <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                  {/* Logo (lg+) */}
                  <div className='hidden lg:flex lg:flex-1 lg:items-center'>
                    {/* <a href='#'> */}
                    <span className='sr-only'>Workflow</span>
                    {/* <img
                        className='w-auto h-8'
                        src='https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600'
                        alt=''
                      /> */}

                    <Link href='/' aria-label='Home'>
                      <a className='flex items-center p-2 -m-2 group'>
                        <span className='h-6 text-slate-500' aria-hidden='true'>
                          <Logo
                            className='w-auto h-6 align-middle'
                            width={36}
                            height={36}
                          />
                        </span>
                        <span className='ml-2 font-extrabold text-pink-300 text-md group-hover:text-gray-800'>
                          {data.name || `Company Name`}
                        </span>
                      </a>
                    </Link>

                    {/* </a> */}
                  </div>

                  <div className='hidden h-full lg:flex'>
                    {/* Flyout menus */}
                    <Popover.Group className='inset-x-0 bottom-0 px-4'>
                      <div className='flex justify-center h-full space-x-8'>
                        {navigation.categories.map((category) => (
                          <Popover key={category.name} className='flex'>
                            {({ open }) => (
                              <>
                                <div className='relative flex'>
                                  <Popover.Button
                                    className={cn(
                                      open
                                        ? 'text-indigo-600'
                                        : 'text-gray-700 hover:text-gray-800',
                                      'relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out'
                                    )}
                                  >
                                    {category.name}
                                    <span
                                      className={cn(
                                        open ? 'bg-indigo-600' : '',
                                        'absolute inset-x-0 -bottom-px z-20 h-0.5 transition duration-200 ease-out'
                                      )}
                                      aria-hidden='true'
                                    />
                                  </Popover.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter='transition ease-out duration-200'
                                  enterFrom='opacity-0'
                                  enterTo='opacity-100'
                                  leave='transition ease-in duration-150'
                                  leaveFrom='opacity-100'
                                  leaveTo='opacity-0'
                                >
                                  <Popover.Panel className='absolute inset-x-0 z-10 text-sm text-gray-500 bg-white top-full'>
                                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                    <div
                                      className='absolute inset-0 bg-white shadow top-1/2'
                                      aria-hidden='true'
                                    />
                                    {/* Fake border when menu is open */}
                                    <div
                                      className='absolute inset-0 top-0 h-px px-8 mx-auto max-w-7xl'
                                      aria-hidden='true'
                                    >
                                      <div
                                        className={cn(
                                          open
                                            ? 'bg-gray-200'
                                            : 'bg-transparent',
                                          'h-px w-full transition-colors duration-200 ease-out'
                                        )}
                                      />
                                    </div>

                                    <div className='relative'>
                                      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                                        <div className='grid grid-cols-4 py-16 gap-y-10 gap-x-8'>
                                          {category.featured.map((item) => (
                                            <div
                                              key={item.name}
                                              className='relative group'
                                            >
                                              <div className='overflow-hidden bg-gray-100 rounded-md aspect-w-1 aspect-h-1 group-hover:opacity-75'>
                                                <img
                                                  src={item.imageSrc}
                                                  alt={item.imageAlt}
                                                  className='object-cover object-center'
                                                />
                                              </div>
                                              <a
                                                href={item.href}
                                                className='block mt-4 font-medium text-gray-900'
                                              >
                                                <span
                                                  className='absolute inset-0 z-10'
                                                  aria-hidden='true'
                                                />
                                                {item.name}
                                              </a>
                                              
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        ))}

                        {navigation.pages.map((page) => (
                          <a
                            key={page.name}
                            href={page.href}
                            className='flex items-center text-sm font-medium text-gray-700 hover:text-gray-800'
                          >
                            {page.name}
                          </a>
                        ))}
                      </div>
                    </Popover.Group>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className='flex items-center flex-1 lg:hidden'>
                    <button
                      type='button'
                      className='p-2 -ml-2 text-gray-400 bg-white rounded-md'
                      onClick={() => setOpen(true)}
                    >
                      <span className='sr-only'>Open menu</span>
                      <span
                        className='w-6 h-6 material-symbols-outlined text-slate-500'
                        aria-hidden='true'
                      >
                        menu
                      </span>
                    </button>

                    {/* Search */}
                    <a
                      href='#'
                      className='p-2 ml-2 text-gray-400 hover:text-gray-500'
                    >
                      <span className='sr-only'>Search</span>
                      <span
                        className='w-6 h-6 material-symbols-outlined text-slate-500'
                        aria-hidden='true'
                      >
                        search
                      </span>{' '}
                    </a>
                  </div>

                  {/* Logo (lg-) */}
                  <a href='#' className='lg:hidden'>
                    <span className='sr-only'>Workflow</span>
                    <img
                      src='https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600'
                      alt=''
                      className='w-auto h-8'
                    />
                  </a>

                  <div className='flex items-center justify-end flex-1'>
                    <div className='flex items-center lg:ml-8'>
                      {/* Cart */}
                      <div className='flow-root ml-4 lg:ml-8'>
                        <a
                          href='#'
                          className='flex items-center p-2 -m-2 group'
                        >
                          <span
                            className='flex-shrink-0 w-6 h-6 material-symbols-outlined text-slate-500'
                            aria-hidden='true'
                          >
                            shopping_bag
                          </span>
                        </a>
                      </div>
                      {/* Cart */}
                      <div className='flow-root ml-4 lg:ml-8'>
                        <a
                          href='#'
                          className='flex items-center p-2 -m-2 group'
                        >
                          <span
                            className='flex-shrink-0 w-6 h-6 material-symbols-outlined text-slate-500'
                            aria-hidden='true'
                          >
                            shopping_bag
                          </span>

                          <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
                            0
                          </span>
                          <span className='sr-only'>
                            items in cart, view bag
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary navigation */}
            <div className='bg-slate-500'>
              <div className='flex items-center justify-between h-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'></div>
            </div>
          </nav>
        </header>
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
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt:
            'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt:
            'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg',
          imageAlt:
            'Model wearing minimalist watch with black wristband and white watch face.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
      ],
    },
    {
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-01.jpg',
          imageAlt:
            'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-02.jpg',
          imageAlt: 'Model wearing light heather gray t-shirt.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-03.jpg',
          imageAlt:
            'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-04.jpg',
          imageAlt:
            'Model putting folded cash into slim card holder olive leather wallet with hand stitching.',
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

