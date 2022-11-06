import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { Disclosure } from '@headlessui/react'
import { SwrBrand } from '@/lib/swr-helpers'

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

const Button = dynamic(() => import('@/components/ui/Button'))
const Icon = dynamic(() => import('@/components/common/Icon'))
const Layout = dynamic(() => import('@/components/common/Layout'))
const AddCard = dynamic(() => import('@/components/ui/Send/AddCard'))
const AddGift = dynamic(() => import('@/components/ui/Send/AddGift'))
const PersonaliseOrder = dynamic(
  () => import('@/components/ui/Send/PersonaliseOrder')
)
const ConfirmOrder = dynamic(() => import('@/components/ui/Send/ConfirmOrder'))

export default function Send({ slug, preview, prefetchedData }: any) {
  // console.log('prefetchedData->', prefetchedData)
  const brand = SwrBrand()
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  // const [errors, setErrors]: any[] = useState([])

  let { errors } = state.cart

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
                    console.log('cart >', state.cart)
                    console.log('cookie >', Cookies?.get('cart'))
                    router.reload
                  }}
                >
                  <Icon name="undo" className="mr-2" /> Start Over
                </Button>

                {/* <Button
                  disabled={state.cart?.status === 'ready_to_submit'}
                  // onClick={handleNextStep}
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className={cn(
                    `ml-3 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`,
                    `text-white hover:bg-slate-500 hover:text-white `
                  )}
                  type="button"
                >
                  <Icon name="shopping_basket" className="mr-2" /> Checkout
                </Button> */}
              </div>
            </div>

            {errors?.length > 0 && (
              <>
                <div className="p-4 rounded-md bg-red-50">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Icon
                        name="warning"
                        className="w-5 h-5 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-600">{`There were ${errors.length} errors with your order`}</h3>
                      <div className="mt-2 -ml-5 text-sm text-red-600">
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
                                {/* {`${error.title}: `} */}
                              {/* </span>
                              <span className="text-sm leading-snug text-red-600"> */}
                                {` ${error.message}`}
                              </span>
                            </li>
                          ))}
                          {/* <li>Your password must be at least 8 characters</li>
                          <li>
                            Your password must include at least one pro
                            wrestling finishing move
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <dl className="space-y-4 ">
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
          </div>
        </section>
      </div>
    </>
  )
}

Send.Layout = Layout
