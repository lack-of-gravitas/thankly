import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
const Button = dynamic(() => import('@/components/ui/Button'))
import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'
import { fetchGetJSON } from '@/lib/api-helpers'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Icon = dynamic(() => import('@/components/common/Icon'))

export default function Home({ slug, preview, data }: any) {
  // console.log('prefetchedData->', data)
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

              <ul
                role="list"
                className="mt-6 text-sm font-medium text-gray-500 border-t border-gray-200 divide-y divide-gray-200"
              >
                {/* {products.map((product) => (
                  <li key={product.id} className="flex py-6 space-x-6">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="flex-none object-cover object-center w-24 h-24 bg-gray-100 rounded-md"
                    />
                    <div className="flex-auto space-y-1">
                      <h3 className="text-gray-900">
                        <a href={product.href}>{product.name}</a>
                      </h3>
                      <p>{product.color}</p>
                      <p>{product.size}</p>
                    </div>
                    <p className="flex-none font-medium text-gray-900">
                      {product.price}
                    </p>
                  </li>
                ))} */}
              </ul>

              <dl className="pt-6 space-y-6 text-sm font-medium text-gray-500 border-t border-gray-200">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">$72.00</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-gray-900">$8.00</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd className="text-gray-900">$6.40</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Thankly Voucher</dt>
                  <dd className="text-gray-900">($6.40)</dd>
                </div>
                <div className="flex items-center justify-between pt-6 text-gray-900 border-t border-gray-200">
                  <dt className="text-lg font-semibold">Total</dt>
                  <dd className="text-lg font-semibold">$86.40</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

Home.Layout = Layout

export async function getServerSideProps(context: any) {
  const data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BRAND}/getOrder?id=${context.query.order}`
    )
  ).json()

  console.log(
    `${process.env.NEXT_PUBLIC_BRAND}/getOrder?id=${context.query.order}`
  )
  return {
    props: { data }, // will be passed to the page component as props
  }
}
