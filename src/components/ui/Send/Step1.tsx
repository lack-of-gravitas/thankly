import cn from 'clsx'
import Fuse from 'fuse.js'
import { useState } from 'react'

import { mergeRefs } from 'react-merge-refs'
import { SwrBrand } from '@/lib/swr-helpers'
import dynamic from 'next/dynamic'
import { Switch } from '@headlessui/react'


const Icon = dynamic(() => import('@/components/common/Icon'))
const Products = dynamic(() => import('@/components/ui/Products'))

interface Step1Props {
  // children?: React.ReactNode[]
  className?: string
  data?: any
}

// eslint-disable-next-line react/display-name
const Step1: React.FC<Step1Props> = ({
  // children,
  className,
  data,
}) => {

  const [query, updateQuery] = useState('')
  function onSearch({ currentTarget }: any) {
    updateQuery(currentTarget.value)
  }

  const list = [
    {
      id: 6,
      status: 'active',
      date_created: '2022-09-04T13:33:49.031Z',
      date_updated: '2022-09-22T02:19:11.092Z',
      tags: ['Alcohol-free', 'Cocktails', 'Drinks', 'Gift'],
      type: 'gift',
      stockQty: 5,
      description:
        'Alcohol Craft Cocktails – La Vie En Rose & Light Me Up – Zero Proof Fizz',
      name: 'DEMO Altina Zero',
      featured: true,
      prices: null,
      stripeId: null,
      brand: 'Altina',
      categories: [
        {
          item: {
            id: 3,
            name: 'Drinks',
            description: null,
          },
        },
      ],
    },
    {
      id: 8,
      status: 'active',
      date_created: '2022-09-15T03:54:06.298Z',
      date_updated: '2022-09-22T02:19:56.182Z',
      tags: ['Chocolates', 'Gift', 'Milk Chocolate'],
      type: 'gift',
      stockQty: 5,
      description:
        'Caramel Chocolate Freckles Milk 100g – Buttery, Jersey Caramel Milk Chocolate Topped with Sprinkles.',
      name: 'DEMO Koko Black 9 Piece Chocolatiers Selection',
      featured: false,
      prices: null,
      stripeId: null,
      brand: 'Koko Black',
      categories: [
        {
          item: {
            id: 1,
            name: 'Sweets',
            description: null,
          },
        },
      ],
    },
  ]

  const options = {
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 4,

    keys: ['name', 'description', 'tags', 'brand', 'categories.item.name'],
  }

  const fuse = new Fuse(list, options)
  const result = fuse.search(query)
  console.log('search result', result)

  return (
    <div className="max-w-2xl py-2 mx-auto sm:py-5 lg:max-w-7xl ">
      <h2 className="sr-only">Products</h2>
      {/* <div className="border rounded-md border-gray-150 bg-gray-50">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 ">Need more bandwidth?</h3>
          <div className="mt-2 text-sm text-gray-500 ">
            <p>
              Nose around our range of thoughtfully designed Thankly cards until
              you find one that sticks. If you’re just sending a card and would
              like it delivered on a specific date, please allow up to 10 days
              for postage or select express post at checkout. Cards are included
              free with a gift.
            </p>
          </div>
        </div>
      </div> */}

      {/* Show if Cards Only is false */}
      {true && (
        <div className="border rounded-md border-gray-150 bg-gray-50">
          <div className="px-4 py-5 mx-auto sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="hidden text-sm font-semibold text-gray-500 xs:invisible md:block">
              Search
              <span className="sr-only">, active</span>
            </h3>

            <div className="w-full mt-2 sm:mt-0 sm:ml-4 ">
              <div className="flex flex-wrap items-center -m-1">
                <div className="flex w-full mt-1 rounded-md ">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Icon name="search" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="block w-full pl-10 border-gray-300 rounded-none rounded-l-md focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                      placeholder="Search for a gift to start your Thankly..."
                      value={query}
                      onChange={onSearch}
                    />
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 mr-3 -ml-px space-x-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <span>Search</span>
                  </button>

                  <CardOnlySwitch  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 pt-5 mx-auto gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        <Products data={products} />
      </div>
    </div>
  )
}

export default Step1

export function CardOnlySwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch.Group as="div" className="flex items-center pt-2 pb-5">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={cn(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">
          Show Cards Only
        </span>
        {/* <span className="text-sm text-gray-500">(Save 10%)</span> */}
      </Switch.Label>
    </Switch.Group>
  )
}



const products = [
  {
    id: 1,
    name: 'Basic Tee 8-Pack',
    href: '#',
    price: '$256',
    description:
      'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',
    options: '8 colors',
    images: [
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg',
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-03.jpg',
    ],
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg',
    imageAlt:
      'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',
    options: 'Black',
    images: [
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg',
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-03.jpg',
    ],
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
    imageAlt: 'Front of plain black t-shirt.',
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',
    options: 'Black',
    images: [
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg',
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-03.jpg',
    ],
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
    imageAlt: 'Front of plain black t-shirt.',
  },
  // More products...
]
