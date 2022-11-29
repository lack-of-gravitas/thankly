import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { Disclosure } from '@headlessui/react'
import { SwrBrand } from '@/lib/swr-helpers'
import { RadioGroup } from '@headlessui/react'
import debounce from 'lodash/debounce'

import Router, { useRouter } from 'next/router'
import cn from 'clsx'
import { Store } from '@/lib/Store'
import Cookies from 'js-cookie'
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react'
import { getStripe } from '@/lib/stripe-client'
import { loadStripe } from '@stripe/stripe-js'
import { postData } from '@/lib/api-helpers'

const Button = dynamic(() => import('@/components/ui/Button'))
const Icon = dynamic(() => import('@/components/common/Icon'))
const Layout = dynamic(() => import('@/components/common/Layout'))
const AddCard = dynamic(() => import('@/components/ui/Send/AddCard'))
const AddGift = dynamic(() => import('@/components/ui/Send/AddGift'))
const PersonaliseOrder = dynamic(
  () => import('@/components/ui/Send/PersonaliseOrder')
)
const ConfirmOrder = dynamic(() => import('@/components/ui/Send/ConfirmOrder'))
const Notification = dynamic(() => import('@/components/ui/Notification'))
const Modal = dynamic(() => import('@/components/ui/Modal'))

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const key: any =
  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
    ? process.env.NEXT_PUBLIC_DEV_STRIPE_PUB_KEY
    : process.env.NEXT_PUBLIC_PRD_STRIPE_PUB_KEY

const stripePromise = loadStripe(key)

console.log('env > ', process.env.NODE_ENV)
export default function Send({ slug, preview, prefetchedData }: any) {
  // console.log('prefetchedData->', prefetchedData)
  const brand = SwrBrand()
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  const { shippingRates } = brand
  const [voucherBalance, setVoucherBalance] = useState(
    state.cart.options.voucher * 1
      ? state.cart.options.voucher.value * 1 -
      state.cart.options.voucher.used * 1
      : 0
  )
  // let { errors } = state.cart
  const [voucherValid, setVoucherValid]: any = useState()
  const [processing, setProcessing]: any = useState(false)
  const [initiateCheckout, setInitiateCheckout] = useState(false)
  const [errors, setErrors] = useState(state.cart.errors)

  const steps: any[] = [
    {
      id: 1,
      name: 'Start with a card',
      icon: <Icon className="mr-3 " name={'mark_email_unread'} />,
      ui: (
        <>
          <AddCard />
        </>
      ),
    },
    {
      id: 2,
      name: 'Add a gift (optional)',
      icon: <Icon className="mr-3" name={'view_in_ar'} />,
      ui: (
        <>
          <AddGift />
        </>
      ),
    },
    {
      id: 3,
      name: 'Personalise',
      icon: <Icon className="mr-3 text-2xl" name={'edit_note'} />,
      ui: (
        <>
          <PersonaliseOrder />
        </>
      ),
    },
    {
      id: 4,
      name: 'Confirm & Send',
      icon: <Icon className="mr-3" name={'send'} />,
      ui: (
        <>
          <ConfirmOrder />
        </>
      ),
    },
  ]

  console.log('state.cart >', state.cart)
  return (
    <>
      <div className="bg-white">
        <section
          aria-labelledby="features-heading"
          className="py-5 pb-5 mx-auto max-w-7xl sm:px-2 lg:px-8"
        >
          <div className="max-w-2xl px-4 mx-auto lg:max-w-none lg:px-0">
            <div className="pb-5 md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2
                  id="collection-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  Send a Thankly
                </h2>
                <p className="mt-2 mb-5 text-base text-gray-500">
                  Express your gratitude by sending a thoughtful gift that
                  really hits that soft spot. Choose a Card, add a Gift,
                  personalise and send.
                </p>
              </div>
              <div className="flex mt-4 md:mt-0 md:ml-4">
                <Button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'CLEAR_CART' })
                    setErrors([])
                    // console.log('cart >', state.cart)
                    // console.log('cookie >', Cookies?.get('cart'))
                    router.push('/send')

                  }}
                >
                  <Icon name="undo" className="mr-2" /> Start Over
                </Button>


              </div>
            </div>


            <Card />

            <dl className="space-y-4 sm:pb-5 ">
              {steps.map((step) => (
                <Disclosure
                  as="div"
                  key={step.id}
                  className="p-3 pt-4 pl-4 border border-gray-300 rounded-md shadow-sm bg-slate-100"
                  style={{
                    backgroundColor: brand.backgroundColor
                      ? brand.backgroundColor
                      : '#fff',
                  }}
                >
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="flex items-start w-full text-left text-gray-400">
                          <span className="font-medium text-gray-900">
                            {step.icon}
                          </span>

                          <span className="font-medium text-gray-900">
                            {step.name}
                          </span>
                          <span className="flex ml-6 items-right h-7">
                            <Icon
                              name="expand_more"
                              className={cn(
                                open ? '-rotate-180' : 'rotate-0',
                                'h-6 w-6 transform font-medium'
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 ">
                        <p className="text-base text-gray-500">{step.ui}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
            <div className="flex justify-center">
              <div className="max-w-2xl p-5 px-5 mt-10 border-2 rounded-md shadow-md border-slate-700 bg-gray-50 lg:mt-0">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 ">
                  Order Summary
                </h2>

                <div className="mt-4">
                  <h3 className="sr-only">Items in your cart</h3>

                  <ul role="list" className="divide-y divide-gray-200">
                    {state.cart.items?.map((product: any) => (
                      <li key={product.id} className="flex ">
                        <div className="flex-shrink-0 border rounded-sm shadow-sm border-gray-150">
                          <Image
                            className="object-cover object-center w-24 h-24 rounded-md sm:h-32 sm:w-32"
                            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${product.images[0]?.directus_files_id ??
                              '344cabf1-43ff-4184-acb0-cc7d461aff09'
                              }`}
                            width={900}
                            height={900}
                            alt=""
                          />
                        </div>

                        <div className="flex flex-col flex-1 ml-4 ">
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

                  <dl className="py-3 ">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Items</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$ ${(state.cart.totals.items * 1).toFixed(2)}`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">- Discounted Card with Gifts</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`($ ${(state.cart.totals.discount * 1).toFixed(2)})`}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between">
                      <dt className="text-sm">+ Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$` + (state.cart.totals.shipping * 1).toFixed(2)}
                      </dd>
                    </div>
                    <dt className="text-sm">
                      <RadioGroup
                        value={state.cart.options.shipping ?? shippingRates[0]}
                        onChange={(e: any) => {
                          // console.log('radiogroup -- ', e)
                          dispatch({
                            type: 'SET_SHIPPING',
                            payload: {
                              shippingRate: { ...e },
                            },
                          })
                        }}
                        className="mt-2"
                      >
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                          {shippingRates.map((option: any) => (
                            <>
                              {state.cart.totals.items * 1 <= 50 &&
                                option.name === 'Express Shipping (FREE)' ? (
                                <></>
                              ) : state.cart.totals.items * 1 > 50 &&
                                option.name === 'Express Shipping' ? (
                                <></>
                              ) : (
                                <RadioGroup.Option
                                  key={option.id}
                                  value={option}
                                  className={cn(
                                    'cursor-pointer focus:outline-none',
                                    option.id === state.cart.options.shipping.id
                                      ? 'border-transparent bg-slate-600 text-white ring-2 ring-slate-500 ring-offset-2 hover:bg-slate-700'
                                      : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                                    'flex items-center justify-center rounded-md border py-3 px-3 text-xs font-medium sm:flex-1'
                                  )}
                                >
                                  <RadioGroup.Label as="span">
                                    {option.name +
                                      ` $` +
                                      Number(option.unit_amount * 1)}
                                  </RadioGroup.Label>
                                </RadioGroup.Option>
                              )}
                            </>
                          ))}
                        </div>
                      </RadioGroup>

                      {errors?.filter(
                        (error: any) => error.id === 'shippingRate'
                      ).length > 0 && (
                          <p className="mt-2 text-xs leading-snug text-red-600">
                            {
                              errors?.filter(
                                (item: any) => item.id === 'shippingRate'
                              )[0].message
                            }
                          </p>
                        )}
                    </dt>
                    <div className="flex items-center justify-between pt-2">
                      <dt className="text-sm font-bold">Subtotal</dt>
                      <dd className="text-sm font-bold text-gray-900">
                        {`$ ${(state.cart.totals.subtotal * 1).toFixed(2)}`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <dt className="text-sm">G.S.T Included</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$ 
                    ${state.cart.totals.subtotal * 1 +
                            state.cart.totals.shipping * 1 ===
                            0
                            ? 0
                            : (
                              (state.cart.totals.subtotal * 1 +
                                state.cart.totals.shipping * 1) /
                              11
                            ).toFixed(2)
                          }`}
                      </dd>
                    </div>
                    {state.cart.totals.voucher * 1 !== 0 && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm">- used Thankly Voucher</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {`($ ${(state.cart.totals.voucher * 1).toFixed(2)})`}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
                      <dt className="text-base font-semibold">
                        Total Outstanding
                      </dt>
                      <dd className="text-base font-semibold text-gray-900">
                        {`$ ${(state.cart.totals.net * 1).toFixed(2)}`}
                      </dd>
                    </div>
                  </dl>

                  <div className="py-3 ">
                    <div>
                      <h3 className="font-medium text-gray-900 text-md">
                        Thankly Voucher
                      </h3>
                      <p className="block pt-2 text-sm font-medium leading-snug text-gray-700">
                        {`If you would like to use a Thankly Voucher for this
                  purchase, please enter it here.`}
                        <span className="font-semibold">{` If Voucher Balance is insufficient, you will be directed to Stripe to collect card details for the remaining amount.`}</span>
                      </p>

                      <div className="flex py-3 mt-1 rounded-md ">
                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon name={'redeem'} />
                          </div>
                          <input
                            type="text"
                            name="voucher"
                            id="voucher"
                            maxLength={10}
                            size={10}
                            className={`txt-slate-500 block w-full rounded-none rounded-l-md border-gray-300 pl-10 font-semibold focus:border-slate-500 focus:ring-slate-500 sm:text-sm`}
                            placeholder="VOUCHER CODE"
                            onChange={debounce(async (e: any) => {
                              // call api to validate voucher and set
                              setVoucherBalance(0)
                              // console.log('voucher', e.target.value)
                              if (e.target.value === '') {
                                dispatch({
                                  type: 'REMOVE_VOUCHER',
                                })
                              } else {
                                let data = await (
                                  await fetch(
                                    `${process.env.NEXT_PUBLIC_REST_API}/vouchers?fields=*` +
                                    `&filter[code][_eq]=${e.target.value}` +
                                    `&filter[status][_eq]=published`
                                  )
                                ).json()
                                data = data.data
                                if (data?.length === 1) {
                                  data = data[0]
                                  // console.log('voucher data >', data)
                                  setVoucherValid(true)
                                } else {
                                  data = null
                                  setVoucherValid(false)
                                }
                                // console.log('voucher data', data)
                                // console.log('getVoucher', data)

                                dispatch({
                                  type: 'APPLY_VOUCHER',
                                  payload: data,
                                })

                                setVoucherBalance(state.cart.totals.voucher * 1)
                              }
                            }, 300)}
                          />
                        </div>

                        <button
                          type="button"
                          className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 "
                        >
                          <Icon name={'attach_money'} />
                          <span className="font-medium text-gray-700">
                            {`Balance `}
                            {state.cart.options.voucher &&
                              state.cart.options.voucher != undefined &&
                              Object.keys(state.cart.options.voucher).length != 0
                              ? (
                                state.cart.options.voucher.value * 1 -
                                state.cart.options.voucher.used * 1
                              ).toFixed(2)
                              : (0).toFixed(2)}
                          </span>
                        </button>
                      </div>

                      {voucherValid === false && (
                        <p className="block pb-4 text-sm font-medium leading-tight text-red-600 0">
                          <Icon
                            className="w-5 h-5 text-sm leading-tight"
                            name={'cancel'}
                          />
                          <span className="text-sm leading-snug">{`Invalid or already used Voucher. Please try a different Voucher. If you think this is in error, please contact us.`}</span>
                        </p>
                      )}
                    </div>



                    <button
                      type="submit"
                      onClick={async (e: any) => {
                        e.preventDefault()
                        setProcessing(true)
                        console.log('final cart -- ', state.cart)
                        console.log('initiating checkout...')

                        try {
                          console.log('validating order...')
                          // const validCart =
                          if (validateCart()) {
                            if (state.cart.totals.net * 1 === 0) {
                              console.log('creating order...')

                              // nothing to pay, complete processing of order directly (send to api)
                              const order = await postData({
                                url: '/api/createOrder',
                                data: { cart: state.cart, status: 'placed' },
                              })

                              // redirect to order page with order data
                              order.id != ''
                                ? router.push({
                                  pathname: '/order',
                                  query: { id: order.id, status: true },
                                })
                                : router.push({
                                  pathname: '/order',
                                  query: { id: order.id, status: false },
                                })

                              dispatch({ type: 'CLEAR_CART' })
                              setProcessing(false)
                              setInitiateCheckout(false)
                            } else {
                              // balance to pay -- total != 0
                              console.log('creating order...')

                              const order = await postData({
                                url: '/api/createOrder',
                                data: { cart: state.cart, status: 'draft' },
                              })

                              console.log('transfer to Stripe...')
                              const { sessionId } = await postData({
                                url: '/api/createCheckoutSession',
                                data: { cart: state.cart },
                              })

                              console.log('sessionId', sessionId)
                              const stripe = await getStripe()
                              stripe?.redirectToCheckout({ sessionId })

                              setProcessing(false)
                              setInitiateCheckout(false)
                              dispatch({ type: 'CLEAR_CART' })
                            }
                          } else {
                            // refresh page & show notification
                            // setErrors(state.cart.errors)

                          }
                        } catch (error) {
                          return alert((error as Error)?.message)
                        }

                        // should already be redirected to orderConfirmation or orderError routes
                      }}
                      style={{
                        backgroundColor: brand.firstAccentColour
                          ? brand.firstAccentColour
                          : '#fff',
                      }}
                      className="w-full px-4 py-3 text-base font-medium text-white align-middle border border-transparent rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      <Icon
                        className="mr-3 -mt-1 text-white align-middle"
                        name={'credit_card'}
                      />
                      {`Checkout`}
                    </button>

                    <div className="flex justify-center">
                      <p className="max-w-md pt-3 text-xs font-medium leading-tight text-center align-middle justify-middle text-slate-700 ">
                        <Icon
                          name={'lock'}
                          className="p-2 mr-1 text-xl "
                          aria-hidden="true"
                        />
                        {`We use `}
                        <Link
                          className="underline"
                          href="https://stripe.com/au"
                        >
                          Stripe
                        </Link>
                        {` to securely process your payments. By checking out, you also accept the `}
                        <Link
                          className="underline"
                          passHref
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{' Thankly Terms & Conditions.'}</span>
                        </Link>
                      </p>
                    </div>

                    {errors?.length > 0 && <div className="p-4 mt-3 border rounded-md shadow-lg bg-red-50 border-slate-50">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Icon name="error" className="w-5 h-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-1">
                          <h3 className="text-sm font-medium text-red-600">{`There are ${errors.length} errors. Please fix and click Checkout again.`}</h3>
                          <div className="mt-2 text-sm text-red-600">
                            <ul role="list" className="space-y-0 list-disc">
                              {errors.map((error: any) => (
                                <li
                                  key={error.id}
                                  className="flex space-x-0 leading-snug"
                                >
                                  <Icon
                                    name="close"
                                    className="flex-shrink-0 w-5 h-5 text-sm leading-snug text-red-600"
                                    aria-hidden="true"
                                  />
                                  <span className="pr-1 text-sm font-medium leading-snug text-red-600">
                                    {` ${error.message}`}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        show={processing}
        readOnly
        className="cursor-progress"
        icon={
          <Icon
            className="animate-spin-slower text-slate-700"
            aria-hidden="true"
            name="hourglass_empty"
          />
        }
        content={{
          title: `Confirming your order...`,
          description: `Please wait we're confirming your order.`,
        }}
      />

    </>
  )

  function validateCart() {
    dispatch({ type: 'CLEAR_ERRORS' })
    let foundErrors: any[] = []

    state.cart.items.filter((product: any) => product.type === 'card')
      .length === 0
      ? (foundErrors = foundErrors.concat([
        {
          id: 'card',
          title: 'Card',
          message: `Thankly Card not selected.`,
        },
      ]))
      : null

    JSON.stringify(state.cart.cardContent.writingStyle) === '{}'
      ? (foundErrors = foundErrors.concat([
        {
          id: 'writingStyle',
          title: 'Writing Style',
          message: `Please choose a preferred writing style.`,
        },
      ]))
      : null

    // JSON.stringify(state.cart.options.ribbon) === '{}'
    // ? (foundErrors = foundErrors.concat([
    //     {
    //       id: 'ribbon',
    //       title: 'Shipping Option not selected.',
    //       message: `Please select a shipping option.`,
    //     },
    //   ]))
    // : null

    state.cart.cardContent.message === ''
      ? (foundErrors = foundErrors.concat([
        {
          id: 'message',
          title: 'Empty Message',
          message: `Recipient Message field is empty.`,
        },
      ]))
      : null

    state.cart.cardContent.message.length > 400
      ? (foundErrors = foundErrors.concat([
        {
          id: 'message',
          title: 'Message Limit',
          message: `Recipient Message too long (400 character limit).`,
        },
      ]))
      : null

    JSON.stringify(state.cart.options.shipping) === '{}'
      ? (foundErrors = foundErrors.concat([
        {
          id: 'shippingRate',
          title: 'Shipping Option',
          message: `Shipping Option not selected.`,
        },
      ]))
      : null

    state.cart.recipient.firstname === ''
      ? (foundErrors = foundErrors.concat([
        {
          id: 'firstname',
          title: 'Empty First Name',
          message: `Recipient First Name is empty.`,
        },
      ]))
      : null

    state.cart.recipient.lastname === ''
      ? (foundErrors = foundErrors.concat([
        {
          id: 'lastname',
          title: 'Empty Last Name',
          message: `Recipient Last Name is empty.`,
        },
      ]))
      : null

    Object.values(state.cart.recipient.address).every(
      (x) => x === null || x === ''
    )
      ? (foundErrors = foundErrors.concat([
        {
          id: 'address',
          title: 'Address Empty',
          message: `Recipient Address is empty.`,
        },
      ]))
      : null

    state.cart.sender.name === ''
      ? (foundErrors = foundErrors.concat([
        {
          id: 'sender_name',
          title: 'Sender Name',
          message: `Sender Name is empty.`,
        },
      ]))
      : null

    state.cart.sender.email === ''
      ? (foundErrors = foundErrors.concat([
        {
          id: 'sender_email',
          title: 'Sender Email',
          message: `Sender email is not valid.`,
        },
      ]))
      : null



    console.log('errors detected >', foundErrors)

    if (foundErrors.length > 0) {
      dispatch({
        type: 'SET_ERRORS',
        payload: foundErrors,
      })

      setErrors(foundErrors)
      setProcessing(false)
      return false
    }

    if (foundErrors.length === 0) {
      setProcessing(true)
      return true
    }
  }
}

Send.Layout = Layout


import { Fragment } from 'react'
import { Dialog, Menu, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const currencies = ['CAD', 'USD', 'AUD', 'EUR', 'GBP']
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
const breadcrumbs = [
  { id: 1, name: 'Objects', href: '#' },
  { id: 2, name: 'Workspace', href: '#' },
  { id: 3, name: 'Sale', href: '#' },
]
const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'All New Arrivals', checked: false },
      { value: 'tees', label: 'Tees', checked: false },
      { value: 'objects', label: 'Objects', checked: true },
      { value: 'sweatshirts', label: 'Sweatshirts', checked: false },
      { value: 'pants-shorts', label: 'Pants & Shorts', checked: false },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: false },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'sizes',
    name: 'Sizes',
    options: [
      { value: 'xs', label: 'XS', checked: false },
      { value: 's', label: 'S', checked: false },
      { value: 'm', label: 'M', checked: false },
      { value: 'l', label: 'L', checked: false },
      { value: 'xl', label: 'XL', checked: false },
      { value: '2xl', label: '2XL', checked: false },
    ],
  },
]
const activeFilters = [{ value: 'objects', label: 'Objects' }]
const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  // More products...
]



export function Card() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="bg-gray-50">
      

      <div>
      

        <main>


  
          <Cards />
          <Recipients />
        </main>


      </div>
    </div>
  )
}



const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
]


export function Cards() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      
      <div className="sticky top-0 z-10 bg-white sm:flex sm:items-center">
        <div className="pt-4 sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900"><Icon className="mr-3 text-2xl " name={'mark_email_unread'} />Start with a Card</h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            Add a recipient by clicking on the Add Recipient button. A Thankly will be sent to each of the Recipients. If you want to send a Thankly with a different card and gift, confirm or cancel this Thankly package and begin a new Thankly.
          </p> */}
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Recipient
          </button>
        </div> */}
      </div>
      

        <div>
          {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileFiltersOpen}>
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
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4">
                    {filters.map((section) => (
                      <Disclosure as="div" key={section.name} className="px-4 py-6 border-t border-gray-200">
                        {({ open }) => (
                          <>
                            <h3 className="flow-root -mx-2 -my-3">
                              <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-sm text-gray-400 bg-white">
                                <span className="font-medium text-gray-900">{section.name}</span>
                                <span className="flex items-center ml-6">
                                  <ChevronDownIcon
                                    className={cn(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                    aria-hidden="true"
                                  />
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
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
                      <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as="div" className="mt-2">
                    <div className="border-b border-gray-200">
                      <Tab.List className="flex px-4 -mb-px space-x-8">
                        {navigation.categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              cn(
                                selected ? 'text-indigo-600 border-indigo-600' : 'text-gray-900 border-transparent',
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
                      {navigation.categories.map((category, categoryIdx) => (
                        <Tab.Panel key={category.name} className="px-4 pt-10 pb-6 space-y-12">
                          <div className="grid items-start grid-cols-1 gap-y-10 gap-x-6">
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6">
                              <div>
                                <p id={`mobile-featured-heading-${categoryIdx}`} className="font-medium text-gray-900">
                                  Featured
                                </p>
                                <ul
                                  role="list"
                                  aria-labelledby={`mobile-featured-heading-${categoryIdx}`}
                                  className="mt-6 space-y-6"
                                >
                                  {category.featured.map((item) => (
                                    <li key={item.name} className="flex">
                                      <a href={item.href} className="text-gray-500">
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p id="mobile-categories-heading" className="font-medium text-gray-900">
                                  Categories
                                </p>
                                <ul role="list" aria-labelledby="mobile-categories-heading" className="mt-6 space-y-6">
                                  {category.categories.map((item) => (
                                    <li key={item.name} className="flex">
                                      <a href={item.href} className="text-gray-500">
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6">
                              <div>
                                <p id="mobile-collection-heading" className="font-medium text-gray-900">
                                  Collection
                                </p>
                                <ul role="list" aria-labelledby="mobile-collection-heading" className="mt-6 space-y-6">
                                  {category.collection.map((item) => (
                                    <li key={item.name} className="flex">
                                      <a href={item.href} className="text-gray-500">
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <p id="mobile-brand-heading" className="font-medium text-gray-900">
                                  Brands
                                </p>
                                <ul role="list" aria-labelledby="mobile-brand-heading" className="mt-6 space-y-6">
                                  {category.brands.map((item) => (
                                    <li key={item.name} className="flex">
                                      <a href={item.href} className="text-gray-500">
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                    {navigation.pages.map((page) => (
                      <div key={page.name} className="flow-root">
                        <a href={page.href} className="block p-2 -m-2 font-medium text-gray-900">
                          {page.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                    <div className="flow-root">
                      <a href="#" className="block p-2 -m-2 font-medium text-gray-900">
                        Create an account
                      </a>
                    </div>
                    <div className="flow-root">
                      <a href="#" className="block p-2 -m-2 font-medium text-gray-900">
                        Sign in
                      </a>
                    </div>
                  </div>

                  <div className="px-4 py-6 space-y-6 border-t border-gray-200">
                    {/* Currency selector */}
                    <form>
                      <div className="inline-block">
                        <label htmlFor="mobile-currency" className="sr-only">
                          Currency
                        </label>
                        <div className="relative -ml-2 border-transparent rounded-md group focus-within:ring-2 focus-within:ring-white">
                          <select
                            id="mobile-currency"
                            name="currency"
                            className="flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-800"
                          >
                            {currencies.map((currency) => (
                              <option key={currency}>{currency}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                            <ChevronDownIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

  {/* Filters */}
  <section aria-labelledby="filter-heading">
            <h2 id="filter-heading" className="sr-only">
              Active Filters
            </h2>

            <div className="py-4 border-b border-gray-200 bg-white-100">
              <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
                      Sort
                      <ChevronDownIcon
                        className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
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
                    <Menu.Items className="absolute left-0 z-10 w-40 mt-2 origin-top-left bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            {({ active }) => (
                              <a
                                href={option.href}
                                className={cn(
                                  option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                {option.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  type="button"
                  className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters
                </button>

                <div className="hidden sm:block">
                  <div className="flow-root">
                    <Popover.Group className="flex items-center -mx-4 divide-x divide-gray-200">
                      {filters.map((section, sectionIdx) => (
                        <Popover key={section.name} className="relative inline-block px-4 text-left">
                          <Popover.Button className="inline-flex justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
                            <span>{section.name}</span>
                            {sectionIdx === 0 ? (
                              <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                                1
                              </span>
                            ) : null}
                            <ChevronDownIcon
                              className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          </Popover.Button>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Popover.Panel className="absolute right-0 z-10 p-4 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <form className="space-y-4">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-${section.id}-${optionIdx}`}
                                      className="pr-6 ml-3 text-sm font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </form>
                            </Popover.Panel>
                          </Transition>
                        </Popover>
                      ))}
                    </Popover.Group>
                  </div>
                </div>
              </div>
            </div>

            {/* Active filters */}
            <div className="bg-gray-100">
              <div className="px-4 py-3 mx-auto max-w-7xl sm:flex sm:items-center sm:px-6 lg:px-8">
                <h3 className="text-sm font-medium text-gray-500">
                  Active Filters
                  <span className="sr-only">, active</span>
                </h3>

                <div aria-hidden="true" className="hidden w-px h-5 bg-gray-300 sm:ml-4 sm:block" />

                <div className="mt-2 sm:mt-0 sm:ml-4">
                  <div className="flex flex-wrap items-center -m-1">
                    {activeFilters.map((activeFilter) => (
                      <span
                        key={activeFilter.value}
                        className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                      >
                        <span>{activeFilter.label}</span>
                        <button
                          type="button"
                          className="inline-flex flex-shrink-0 w-4 h-4 p-1 ml-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove filter for {activeFilter.label}</span>
                          <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
      <div className="mt-8 -mx-4 overflow-hidden sm:-mx-6 md:mx-0 ">
        {/* Product grid */}
        <section
          aria-labelledby="products-heading"
          className="max-w-2xl px-4 pt-12 pb-16 mx-auto sm:px-6 sm:pt-16 sm:pb-24 lg:max-w-7xl lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a key={product.id} href={product.href} className="group">
                <div className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="object-cover object-center w-full h-full group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
              </a>
            ))}
          </div>
        </section>



      </div>
    </div>
  )
}

export function Recipients() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Recipients</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add a recipient by clicking on the Add Recipient button. A Thankly will be sent to each of the Recipients. If you want to send a Thankly with a different card and gift, confirm or cancel this Thankly package and begin a new Thankly.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Recipient
          </button>
        </div>
      </div>
      <div className="mt-8 -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Company
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Shipping Address
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Role
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.map((person) => (
              <tr key={person.email}>
                <td className="w-full py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-0 sm:w-auto sm:max-w-none sm:pl-6">
                  {person.name}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Title</dt>
                    <dd className="mt-1 text-gray-700 truncate">{person.title}</dd>
                    <dt className="sr-only sm:hidden">Email</dt>
                    <dd className="mt-1 text-gray-500 truncate sm:hidden">{person.email}</dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{person.title}</td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{person.email}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{person.role}</td>
                <td className="py-4 pl-3 pr-4 text-sm font-medium text-right sm:pr-6">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Remove<span className="sr-only">, {person.name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
