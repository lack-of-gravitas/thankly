import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
const Button = dynamic(() => import('@/components/ui/Button'))
import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'
import { fetchGetJSON } from '@/lib/api-helpers'
import { getOrder } from '@/lib/queries'
import Image from 'next/future/image'
import { Cart } from '@/types'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Icon = dynamic(() => import('@/components/common/Icon'))

export default function Home({ slug, preview, data }: any) {
  console.log('prefetchedData->', data)
  const router = useRouter()
  const brand = SwrBrand()

  return (
    <>
      <main className="relative lg:min-h-auto">
        <div className="overflow-hidden h-80 lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <img
            src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
            alt="TODO"
            className="object-cover object-center w-full h-full"
          />
        </div>

        <div>
          <div className="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-8 xl:gap-x-24">
            <div className="lg:col-start-2">
              <h1
                style={{
                  color: brand.firstAccentColour
                    ? brand.firstAccentColour
                    : '#2e2e2e',
                }}
                className="text-sm font-semibold tracking-widest uppercase "
              >
                Payment successful
              </h1>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Thanks for ordering
              </h2>
              <p className="mt-2 mb-5 text-base text-gray-500">
                {`We appreciate your order, we’re currently processing it. Check your email for the order confirmation and we'll keep you updated as your order progresses! Something doesn't look quite right? Get in touch with us. `}
              </p>
              <Link className="pt-6" passHref href={'/account'}>
                <Button
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className="inline-flex items-center px-4 py-2 mr-5 text-sm font-medium text-white border border-transparent rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  type="button"
                >
                  <Icon className="mr-2 text-white" name={'person'} />
                  {/* {`Create ` : `Your ` + ` Account`} */}Account
                </Button>
              </Link>

              <div className="bg-white">
                <div className="max-w-4xl py-16 mx-auto sm:px-6 sm:py-24">
                  <div className="px-4 sm:px-0">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      Order history
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                      Check the status of recent orders, manage returns, and
                      download invoices.
                    </p>
                  </div>

                  <div className="mt-16">
                    <h2 className="sr-only">Recent orders</h2>

                    <div className="space-y-16 sm:space-y-24">
                      {orders.map((order) => (
                        <div key={order.number}>
                          <h3 className="sr-only">
                            Order placed on{' '}
                            <time dateTime={order.datetime}>{order.date}</time>
                          </h3>

                          <div className="px-4 py-6 bg-gray-50 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                            <dl className="flex-auto space-y-4 text-sm text-gray-600 divide-y divide-gray-200 md:grid md:grid-cols-3 md:gap-x-6 md:space-y-0 md:divide-y-0 lg:w-2/3 lg:flex-none lg:gap-x-8">
                              <div className="flex justify-between md:block">
                                <dt className="font-medium text-gray-900">
                                  Order number
                                </dt>
                                <dd className="md:mt-1">{order.number}</dd>
                              </div>
                              <div className="flex justify-between pt-4 md:block md:pt-0">
                                <dt className="font-medium text-gray-900">
                                  Date placed
                                </dt>
                                <dd className="md:mt-1">
                                  <time dateTime={order.datetime}>
                                    {order.date}
                                  </time>
                                </dd>
                              </div>
                              <div className="flex justify-between pt-4 font-medium text-gray-900 md:block md:pt-0">
                                <dt>Total amount</dt>
                                <dd className="md:mt-1">{order.total}</dd>
                              </div>
                            </dl>
                            <div className="mt-6 space-y-4 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                              {/* <a
                                href={order.href}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:w-auto"
                              >
                                View Order
                                <span className="sr-only">{order.number}</span>
                              </a> */}
                              <a
                                href={order.invoiceHref}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:w-auto"
                              >
                                View Invoice
                                <span className="sr-only">
                                  for order {order.number}
                                </span>
                              </a>
                            </div>
                          </div>

                          <div className="flow-root px-4 mt-6 sm:mt-10 sm:px-0">
                            <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                              {order.products.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex py-6 sm:py-10"
                                >
                                  <div className="flex-1 min-w-0 lg:flex lg:flex-col">
                                    <div className="lg:flex-1">
                                      <div className="sm:flex">
                                        <div>
                                          <h4 className="font-medium text-gray-900">
                                            {product.name}
                                          </h4>
                                          <p className="hidden mt-2 text-sm text-gray-500 sm:block">
                                            {product.description}
                                          </p>
                                        </div>
                                        <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                          {product.price}
                                        </p>
                                      </div>
                                      <div className="flex mt-2 text-sm font-medium sm:mt-4">
                                        <a
                                          href={product.href}
                                          className="text-indigo-600 hover:text-indigo-500"
                                        >
                                          View Product
                                        </a>
                                        <div className="pl-4 ml-4 border-l border-gray-200 sm:ml-6 sm:pl-6">
                                          <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-500"
                                          >
                                            Buy Again
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-6 font-medium">
                                      {product.status === 'delivered' ? (
                                        <div className="flex space-x-2">
                                          <Icon
                                            name="check"
                                            className="flex-none w-6 h-6 text-green-500"
                                            aria-hidden="true"
                                          />
                                          <p>
                                            Delivered
                                            <span className="hidden sm:inline">
                                              {' '}
                                              on{' '}
                                              <time dateTime={product.datetime}>
                                                {product.date}
                                              </time>
                                            </span>
                                          </p>
                                        </div>
                                      ) : product.status ===
                                        'out-for-delivery' ? (
                                        <p>Out for delivery</p>
                                      ) : product.status === 'cancelled' ? (
                                        <p className="text-gray-500">
                                          Cancelled
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 ml-4 sm:order-first sm:m-0 sm:mr-6">
                                    <img
                                      src={product.imageSrc}
                                      alt={product.imageAlt}
                                      className="object-cover object-center w-20 h-20 col-start-2 col-end-3 rounded-lg sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:h-40 sm:w-40 lg:h-52 lg:w-52"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2 px-3 mt-10 rounded-md shadow-sm bg-gray-50 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900 ">
                  Order summary
                </h2>

                <div className="mt-4">
                  <h3 className="sr-only">Items in your cart</h3>

                  <ul
                    role="list"
                    className="px-3 border-b border-gray-200 divide-y divide-gray-200"
                  >
                    {data.cart.items?.map((product: any) => (
                      <li key={product.id} className="flex py-6">
                        <div className="flex-shrink-0 border rounded-sm shadow-sm border-gray-150">
                          <Image
                            className="object-cover object-center w-24 h-24 rounded-md sm:h-32 sm:w-32"
                            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${
                              product.images[0]?.directus_files_id ??
                              '344cabf1-43ff-4184-acb0-cc7d461aff09'
                            }`}
                            width={900}
                            height={900}
                          />
                        </div>

                        <div className="flex flex-col flex-1 ml-4 sm:ml-6">
                          <div>
                            <div className="flex justify-between">
                              <h4 className="text-sm">
                                <a
                                  href={product.href}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product.name}
                                </a>
                              </h4>
                              <p className="ml-4 text-sm font-medium text-gray-900">
                                {product.price}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.color}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.size}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="px-4 py-6 space-y-2 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$` + Number(data.subtotal).toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">{`Delivery Options (${data.cart.options.delivery.name})`}</dt>

                      <dd className="text-sm font-medium text-gray-900">
                        {`$` + Number(data.delivery).toFixed(2)}
                      </dd>
                    </div>
                    <dt className="text-sm"></dt>

                    <div className="flex items-center justify-between pt-2">
                      <dt className="text-sm">G.S.T</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$` +
                          Number(
                            data.subtotal * 1 + data.delivery * 1 === 0
                              ? 0
                              : (data.subtotal * 1 + data.delivery * 1) / 11
                          ).toFixed(2)}
                      </dd>
                    </div>
                    {data.voucher !== 0 && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm">Thankly Voucher (applied)</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {`-$` + Number(data.voucher).toFixed(2) + ``}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <dt className="text-base font-semibold">Order Total</dt>
                      <dd className="text-base font-semibold text-gray-900">
                        {`$` + Number(data.net).toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

Home.Layout = Layout

export async function getServerSideProps(context: any) {
  return {
    props: {
      data:
        context.query.order != undefined
          ? await getOrder(context.query.order)
          : {},
    }, // will be passed to the page component as props
  }
}

const orders = [
  {
    number: 'WU88191111',
    date: 'January 22, 2021',
    datetime: '2021-01-22',
    href: '#',
    invoiceHref: '#',
    total: '$302.00',
    products: [
      {
        id: 1,
        name: 'Nomad Tumbler',
        description:
          "This durable double-walled insulated tumbler keeps your beverages at the perfect temperature all day long. Hot, cold, or even lukewarm if you're weird like that, this bottle is ready for your next adventure.",
        href: '#',
        price: '$35.00',
        status: 'out-for-delivery',
        date: 'January 5, 2021',
        datetime: '2021-01-05',
        imageSrc:
          'https://tailwindui.com/img/ecommerce-images/order-history-page-06-product-01.jpg',
        imageAlt:
          'Olive drab green insulated bottle with flared screw lid and flat top.',
      },
      // More products...
    ],
  },
  // More orders...
]
