import dynamic from 'next/dynamic'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
const Button = dynamic(() => import('@/components/ui/Button'))
import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'
import { fetchGetJSON, postData } from '@/lib/api-helpers'
import {
  getOrder,
  deleteOrder,
  updateVoucher,
  updateStock,
} from '@/lib/queries'
import Image from 'next/future/image'
import { Cart } from '@/types'
import { Store } from '@/lib/Store'
import { useContext, useEffect } from 'react'
import deleteCoupon from './api/deleteCoupon'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Icon = dynamic(() => import('@/components/common/Icon'))

export default function Home({ slug, preview, data }: any) {
  // console.log('prefetchedData->', data)
  const router = useRouter()
  const brand = SwrBrand()

  let { status } = data
  const { cart } = data.order
  status = Boolean(data.status === 'true')

  return (
    <>
      <main className="relative lg:min-h-auto">
        <div className="bg-white">
          (
          <div className="max-w-4xl py-16 mx-auto sm:px-6 sm:py-24">
            <div className="px-4 sm:px-0">
              <h2
                style={{
                  color: brand.firstAccentColour
                    ? brand.firstAccentColour
                    : '#2e2e2e',
                }}
                className="text-sm font-semibold tracking-widest uppercase "
              >
                {status ? `Payment Successful` : `Payment Cancelled`}
              </h2>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {status ? `Order confirmation` : `Order cancelled`}
              </h1>

              <p className="mt-2 mb-5 text-base text-gray-500">
                {status
                  ? `We appreciate your order, we’re currently processing it. Check your email for the order confirmation and we'll keep you updated as your order progresses. Something doesn't look quite right? Get in touch with us.`
                  : `Payment for your order has been cancelled and your cart has been cleared. Please start again if you'd like to send a new Thankly.`}
              </p>
              {false && (
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
              )}
              {/* <Link className="pt-6" passHref href={'/account'}>
                <Button
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className="inline-flex items-center px-4 py-2 mr-5 text-sm font-medium text-white border border-transparent rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  type="button"
                >
                 <Icon name="picture_as_pdf" className="mr-3" />
                          Download Invoice
                </Button>
              </Link>
              */}
            </div>

            {status && (
              <div className="mt-16">
                <div className="p-2 px-3 mt-10 shadow-md rounded-xs bg-gray-50 lg:mt-0">
                  <div className="mt-4">
                    <ul
                      role="list"
                      className="px-3 border-b border-gray-200 divide-y divide-gray-200"
                    >
                      {cart.items?.map((product: any) => (
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
                          {`$ ${(cart.totals.subtotal * 1).toFixed(2)}`}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm">{`Shipping Options (${cart.options.shipping.name})`}</dt>

                        <dd className="text-sm font-medium text-gray-900">
                          {`$` + (cart.totals.shipping * 1).toFixed(2)}
                        </dd>
                      </div>
                      <dt className="text-sm"></dt>

                      <div className="flex items-center justify-between pt-2">
                        <dt className="text-sm">G.S.T</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {`$ 
                      ${
                        cart.totals.subtotal * 1 + cart.totals.shipping * 1 ===
                        0
                          ? 0
                          : (
                              (cart.totals.subtotal * 1 +
                                cart.totals.shipping * 1) /
                              11
                            ).toFixed(2)
                      }`}
                        </dd>
                      </div>
                      {cart.totals.voucher * 1 !== 0 && (
                        <div className="flex items-center justify-between">
                          <dt className="text-sm">Thankly Voucher (applied)</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {`($ ${(cart.totals.voucher * 1).toFixed(2)})`}
                          </dd>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <dt className="text-base font-semibold">Order Total</dt>
                        <dd className="text-base font-semibold text-gray-900">
                          {`$ ${(cart.totals.net * 1).toFixed(2)}`}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
          )
        </div>
      </main>
    </>
  )
  // }
}

Home.Layout = Layout

export async function getServerSideProps(context: any) {
  const { id, status } = context.query
  const order = context.query.id != undefined ? await getOrder(id) : null
  // console.log('order >', order)

  // redirect to home if order is not found
  if (context.query.id === undefined || order.id === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  // send deleteOrder api if order cancelled
  if (status === false || status === 'false') {
    // delete order if it exists
    deleteOrder(id)
    // return false to show cancelled
    return {
      props: {
        data: {
          order: {}, // context.query.id != undefined ? await deleteOrder(id) : {},
          status: false,
        },
      },
    }
  } else {
    // call deleteStripeCoupon api to blow away Coupon used
    const coupon = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/api/deleteCoupon?id=${order.id}`
    )

    // update voucher balance
    if (Object.keys(order.cart.options.voucher).length != 0) {
      const voucher = updateVoucher(order.cart)
    }

    // update stockQty
    const stock = updateStock(order.cart.items)

    //TODO:create/update customer if selected / signedin
    // const customer = upsertCustomer(order)

    // get and pass orderInfo for confirmation
    return {
      props: {
        data: {
          order: order, //context.query.id != undefined ? await getOrder(id) : {},
          status: (status === true || status === 'true') ?? false,
        },
      },
    }
  }
}
