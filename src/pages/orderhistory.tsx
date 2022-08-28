import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getPage } from '@/lib/queries'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Section = dynamic(() => import('@/components/ui/Section'))

export default function Home({ slug, preview, prefetchedData }: any) {
  console.log('prefetchedData->', prefetchedData)
  const router = useRouter()
  //   if (!prefetchedData) {
  //     router.push('/404')
  //   }

  return (
    <>
      <Example />
    </>
  )
}

Home.Layout = Layout

import { Fragment, useState } from 'react'

const orders = [
  {
    number: 'WU88191111',
    date: 'January 22, 2021',
    datetime: '2021-01-22',
    invoiceHref: '#',
    total: '$104.00',
    products: [
      {
        id: 1,
        name: "Men's 3D Glasses Artwork Tee",
        href: '#',
        price: '$36.00',
        status: 'Delivered Jan 25, 2021',
        imageSrc:
          'https://tailwindui.com/img/ecommerce-images/order-history-page-04-product-01.jpg',
        imageAlt:
          'Black tee with intersecting red, white, and green curved lines on front.',
      },
      {
        id: 1,
        name: 'TEST TEST Tee',
        href: '#',
        price: '$136.00',
        status: 'Delivered Jan 25, 2021',
        imageSrc:
          'https://tailwindui.com/img/ecommerce-images/order-history-page-04-product-01.jpg',
        imageAlt:
          'Black tee with intersecting red, white, and green curved lines on front.',
      },
      // More products...
    ],
  },
  {
    number: 'WU88191111',
    date: 'January 22, 2021',
    datetime: '2021-01-22',
    invoiceHref: '#',
    total: '$104.00',
    products: [
      {
        id: 1,
        name: "Men's 3D Glasses Artwork Tee",
        href: '#',
        price: '$36.00',
        status: 'Delivered Jan 25, 2021',
        imageSrc:
          'https://tailwindui.com/img/ecommerce-images/order-history-page-04-product-01.jpg',
        imageAlt:
          'Black tee with intersecting red, white, and green curved lines on front.',
      },

      // More products...
    ],
  },
  // More orders...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white">
      <main className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Order history
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and download
            invoices.
          </p>
        </div>

        <section aria-labelledby="recent-heading" className="mt-16">
          <h2 id="recent-heading" className="sr-only">
            Recent orders
          </h2>

          <div className="space-y-20">
            {orders.map((order) => (
              <div key={order.number}>
                <h3 className="sr-only">
                  Order placed on{' '}
                  <time dateTime={order.datetime}>{order.date}</time>
                </h3>

                <div className="px-4 py-6 rounded-lg bg-gray-50 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                  <dl className="flex-auto space-y-6 text-sm text-gray-600 divide-y divide-gray-200 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                    <div className="flex justify-between sm:block">
                      <dt className="font-medium text-gray-900">Date placed</dt>
                      <dd className="sm:mt-1">
                        <time dateTime={order.datetime}>{order.date}</time>
                      </dd>
                    </div>
                    <div className="flex justify-between pt-6 sm:block sm:pt-0">
                      <dt className="font-medium text-gray-900">
                        Order number
                      </dt>
                      <dd className="sm:mt-1">{order.number}</dd>
                    </div>
                    <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                      <dt>Total amount</dt>
                      <dd className="sm:mt-1">{order.total}</dd>
                    </div>
                  </dl>
                  <a
                    href={order.invoiceHref}
                    className="flex items-center justify-center w-full px-4 py-2 mt-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                  >
                    View Invoice
                    <span className="sr-only">for order {order.number}</span>
                  </a>
                </div>

                <table className="w-full mt-4 text-gray-500 sm:mt-6">
                  <caption className="sr-only">Products</caption>
                  <thead className="text-sm text-left text-gray-500 sr-only sm:not-sr-only">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="hidden py-3 pr-8 font-normal sm:table-cell"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="w-0 py-3 font-normal text-right"
                      >
                        Info
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm border-b border-gray-200 divide-y divide-gray-200 sm:border-t">
                    {order.products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-6 pr-8">
                          <div className="flex items-center">
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              className="object-cover object-center w-16 h-16 mr-6 rounded"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="mt-1 sm:hidden">
                                {product.price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-6 pr-8 sm:table-cell">
                          {product.price}
                        </td>
                        <td className="hidden py-6 pr-8 sm:table-cell">
                          {product.status}
                        </td>
                        <td className="py-6 font-medium text-right whitespace-nowrap">
                          <a href={product.href} className="text-slate-500">
                            View
                            <span className="hidden lg:inline"> Product</span>
                            <span className="sr-only">, {product.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
