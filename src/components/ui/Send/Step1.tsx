import cn from 'clsx'
import Fuse from 'fuse.js'
import { useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { SwrBrand, SwrProducts } from '@/lib/swr-helpers'
import dynamic from 'next/dynamic'
import { Switch } from '@headlessui/react'
import { Product } from '@/types'

const Icon = dynamic(() => import('@/components/common/Icon'))
const ProductCarousel = dynamic(
  () => import('@/components/ui/Send/ProductCarousel')
)

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
  const brand = SwrBrand()
  const products = SwrProducts()
  console.log('products // ', products)
  const options = {
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 3,
    threshold: 0.3,
    // distance:25,
    keys: [
      { name: 'name', weight: 0.7 },
      { name: 'type', weight: 1 },
      // { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.7 },
      { name: 'brand', weight: 0.3 },
      { name: 'categories.item.name', weight: 0.5 },
    ],
  }

  const [query, updateQuery] = useState('')
  const [result, updateResult]: any = useState()
  const [enabled, setEnabled] = useState(false)

  let fuse: any

  if (products) {
    fuse = new Fuse(products, options)
    console.log('search result', result)
  }
  function onSearch({ currentTarget }: any) {
    currentTarget.value === '' || query === ''
      ? updateQuery('gift')
      : updateQuery(currentTarget.value)
    updateResult(fuse.search(query))
  }

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
            <div className="relative flex flex-row px-3 py-3 focus-within:z-10 justify-items-center">
              <div className="grow basis-1/2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 ml-2 pointer-events-none grow ">
                <Icon name={'search'} />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="flex max-w-full min-w-full pl-10 font-medium tracking-tight border-gray-300 rounded-md grow txt-slate-500 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                placeholder="Start searching here..."
                onChange={onSearch}
              />
              </div>
              <div className="basis-1/8">
              <Switch.Group
                as="div"
                className="relative flex items-center ml-3 tracking-tight"
              >
                <Switch
                  checked={enabled}
                  onChange={() => {
                    if (enabled === true) {
                      setEnabled(false)
                      updateResult(fuse.search('gift'))
                    }
                    if (enabled === false) {
                      setEnabled(true)
                      updateResult(fuse.search('card'))
                    }
                  }}
                  className={cn(
                    enabled ? 'bg-slate-600' : 'bg-gray-200',
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
                <Switch.Label as="span" className="flex ml-3">
                  <span className="text-sm font-medium leading-tight text-gray-900">
                    <span className="hidden leading-tight md:block">{`Show `}</span>
                    Cards Only
                  </span>
                  {/* <span className="text-sm text-gray-500">(Save 10%)</span> */}
                </Switch.Label>
              </Switch.Group></div>
            </div>
        </div>
      )}
      <div className="grid grid-cols-1 pt-5 mx-auto gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {!result &&
          products?.map((product: any) => (
            <div
              key={product.id}
              className={` relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white`}
            >
              <ProductCarousel data={product.images} />

              <div className="flex flex-col flex-1 p-4 space-y-2">
                <div className="flex items-center justify-between mt-4 space-x-8 text-base font-medium text-gray-900">
                  <h3>
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p>{product.price}</p>
                </div>

                <p className="text-sm text-gray-500">{product.description}</p>
              </div>

              <div className="mt-3">
                <a
                  href="#"
                  className="relative flex items-center justify-center px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase bg-gray-100 border border-transparent hover:bg-gray-200"
                >
                  <Icon className="mr-2" name={'loyalty'} />
                  Choose<span className="sr-only">, {product.name}</span>
                </a>
              </div>
            </div>
          ))}

        {result &&
          result?.map((product: any) => (
            <div
              key={product.item.id}
              className={` relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white`}
            >
              <div className="bg-gray-200 aspect-w-3 aspect-h-4 sm:aspect-none sm:h-96">
                <img
                  src={
                    'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg'
                  }
                  className="object-cover object-center w-full h-full sm:h-full sm:w-full"
                />
              </div>

              <div className="flex flex-col flex-1 p-4 space-y-2">
                <div className="flex items-center justify-between mt-4 space-x-8 text-base font-medium text-gray-900">
                  <h3>
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.item.name}
                    </a>
                  </h3>
                  <p>{product.item.price}</p>
                </div>

                <p className="text-sm text-gray-500">
                  {product.item.description}
                </p>
              </div>

              <div className="mt-3">
                <a
                  href="#"
                  className="relative flex items-center justify-center px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase bg-gray-100 border border-transparent hover:bg-gray-200"
                >
                  <Icon className="mr-2" name={'loyalty'} />
                  Choose<span className="sr-only">, {product.item.name}</span>
                </a>
              </div>
            </div>
          ))}

        {/* <Products data={products} /> */}
      </div>
    </div>
  )
}

export default Step1
