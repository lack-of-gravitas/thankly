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

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const key: any =
  (process.env.NODE_ENV === 'development' ||process.env.NODE_ENV === 'test')
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

            {/* {errors.length > 0 && (
              <>
                <Notification
                  show={errors?.length > 0}
                  errors={
                    <div className=" w-0 flex-1 pt-0.5">
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
                  }
                />
              </>
            )} */}

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

                              const stripe = await getStripe()
                              stripe?.redirectToCheckout({ sessionId })
                              dispatch({ type: 'CLEAR_CART' })
                              setProcessing(false)
                              setInitiateCheckout(false)
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
