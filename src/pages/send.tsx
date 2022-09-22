import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getPage } from '@/lib/queries'
import Fuse from 'fuse.js'
import cn from 'clsx'
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'

import { Switch } from '@headlessui/react'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Section = dynamic(() => import('@/components/ui/Section'))
const Icon = dynamic(() => import('@/components/common/Icon'))
const ProductSlider = dynamic(() => import('@/components/ui/ProductSlider'))
const Button = dynamic(() => import('@/components/ui/Button'))

export default function Home({ slug, preview, prefetchedData }: any) {
  console.log('prefetchedData->', prefetchedData)
  const brand = SwrBrand()
  const router = useRouter()
  const list = [
    {
      title: "Old Man's War",
      author: 'John Scalzi',
      tags: ['fiction'],
    },
    {
      title: 'The Lock Artist',
      author: 'John Steven',
      tags: ['thriller'],
    },
  ]
  const options = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: ['author', 'tags'],
  }

  const fuse = new Fuse(list, options)

  const result = fuse.search('john')
  console.log(result)
  //   if (!prefetchedData) {
  //     router.push('/404')
  //   }

  return (
    <>
      <div className="bg-white">
        <section
          aria-labelledby="features-heading"
          className="py-5 mx-auto max-w-7xl sm:px-2 lg:px-8"
        >
          <div className="max-w-2xl px-4 mx-auto lg:max-w-none lg:px-0">
            <div className="max-w-3xl pb-6"></div>

            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2
                  id="collection-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  Send a Thankly
                </h2>
                <p className="mt-2 mb-5 text-base text-gray-500">
                  Express your gratitude by sending a thoughtful gift that
                  really hits that soft spot.
                </p>
              </div>
              <div className="flex mt-4 md:mt-0 md:ml-4">
                {/* remember to clear cart / order if created */}
                <Link href={'/'}>
                  <Button
                    // style={{
                    //   backgroundColor: brand.thirdAccentColour
                    //     ? brand.thirdAccentColour
                    //     : '#fff',
                    // }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                    type="button"
                    // item={item}
                    // collection={collection}
                  >
                    Cancel
                    {/* <span className="ml-2 align-middle material-symbols-outlined">
                      arrow_forward
                    </span> */}
                  </Button>
                </Link>

                <Button
                  style={{
                    backgroundColor: brand.secondAccentColour
                      ? brand.secondAccentColour
                      : '#fff',
                  }}
                  className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium border border-transparent rounded-md shadow-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 hover:bg-slate-500 hover:text-white"
                  type="button"
                  // item={item}
                  // collection={collection}
                >
                  Back
                  {/* <span className="ml-2 align-middle material-symbols-outlined">
                      arrow_forward
                    </span> */}
                </Button>
                <Button
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 hover:bg-slate-600"
                  type="button"
                  // item={item}
                  // collection={collection}
                >
                  Next Step
                  {/* <span className="ml-2 align-middle material-symbols-outlined">
                      arrow_forward
                    </span> */}
                </Button>
                {/* <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Next Step
                </button> */}
              </div>
            </div>
            <CardOnlySwitch />

            <nav aria-label="Progress">
              <ol
                role="list"
                className="border border-gray-300 divide-y divide-gray-300 rounded-md md:flex md:divide-y-0"
              >
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className="relative md:flex md:flex-1">
                    {step.status === 'complete' ? (
                      <a
                        href={step.href}
                        className="flex items-center w-full group"
                      >
                        <span className="flex items-center px-4 py-2 text-sm font-medium">
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                            <Icon className="text-white" name={`check`} />
                          </span>
                          <span className="mt-0.5 ml-2 flex min-w-0 flex-col">
                            <span className="ml-2 text-sm font-semibold text-indigo-600">
                              {step.name}
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-500">
                              {step.description}
                            </span>
                          </span>
                        </span>
                      </a>
                    ) : step.status === 'current' ? (
                      <a
                        href={step.href}
                        className="flex items-center px-4 py-2 text-sm font-medium"
                        aria-current="step"
                      >
                        <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 border-indigo-600 rounded-full">
                          <span className="font-semibold text-indigo-600">
                            {step.id}
                          </span>
                        </span>
                        <span className="mt-0.5 ml-2 flex min-w-0 flex-col">
                          <span className="ml-2 text-sm font-semibold text-indigo-600">
                            {step.name}
                          </span>
                          <span className="ml-2 text-sm font-medium text-gray-500">
                            {step.description}
                          </span>
                        </span>
                      </a>
                    ) : (
                      <a href={step.href} className="flex items-center group">
                        <span className="flex items-center px-4 py-2 text-sm font-medium">
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                            <span className="text-gray-500 group-hover:text-gray-900">
                              {step.id}
                            </span>
                          </span>
                          <span className="mt-0.5 ml-2 flex min-w-0 flex-col">
                            <span className="ml-2 text-sm font-semibold text-gray-500 group-hover:text-gray-900">
                              {step.name}
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-500">
                              {step.description}
                            </span>
                          </span>
                        </span>
                      </a>
                    )}

                    {stepIdx !== steps.length - 1 ? (
                      <>
                        {/* Arrow separator for lg screens and up */}
                        <div
                          className="absolute top-0 right-0 hidden w-5 h-full md:block"
                          aria-hidden="true"
                        >
                          <svg
                            className="w-full h-full text-gray-300"
                            viewBox="0 0 22 80"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0 -2L20 40L0 82"
                              vectorEffect="non-scaling-stroke"
                              stroke="currentcolor"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>
       

        <Step3 />
      </div>
    </>
  )
}

Home.Layout = Layout

export function Step1() {
  return (
    <div className="max-w-2xl px-4 py-2 mx-auto sm:py-5 sm:px-2 lg:max-w-7xl lg:px-8">
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

      <div className="border rounded-md border-gray-150 bg-gray-50">
        <div className="px-4 py-5 mx-auto sm:flex sm:items-center sm:px-6 lg:px-8">
          <h3 className="hidden text-sm font-semibold text-gray-500 xs:invisible md:block">
            Search
            <span className="sr-only">, active</span>
          </h3>

          <div className="w-full mt-2 sm:mt-0 sm:ml-4 ">
            <div className="flex flex-wrap items-center -m-1">
              <div className="flex w-full mt-1 rounded-md shadow-sm ">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name="search" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full pl-10 border-gray-300 rounded-none rounded-l-md focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    placeholder="Search for a gift to start your Thankly..."
                  />
                </div>
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                >
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 pt-5 mx-auto gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg group"
          >
            {/* EMBLA */}

            <div className="bg-gray-200 aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none sm:h-96">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="object-cover object-center w-full h-full sm:h-full sm:w-full"
              />
            </div>

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
                href={product.href}
                className="relative flex items-center justify-center px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase bg-gray-100 border border-transparent hover:bg-gray-200"
              >
                <Icon className="mr-2" name={'loyalty'} />
                Choose<span className="sr-only">, {product.name}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Step2() {
  const [selectedWritingStyle, setSelectedWritingStyle] = useState(writingStyles[0])

  return (
    <div className="">
      <div className="max-w-2xl px-4 pt-16 pb-24 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="mt-10 lg:mt-0 ">
            <h2 className="text-lg font-medium text-gray-900">Message</h2>
            {/* <p className="block text-sm font-medium text-gray-700">
              This is the person you are sending to.{' '}
            </p> */}

            <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter your message to place on the Card (400 character limit)
                </label>

                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="comment"
                    id="comment"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    defaultValue={''}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional instructions to scribe
                </label>

                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="comment"
                    id="comment"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    defaultValue={''}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <RadioGroup
              value={selectedWritingStyle}
              onChange={setSelectedWritingStyle}
            >
              <RadioGroup.Label className="text-lg font-medium text-gray-900">
                Handwriting Style
              </RadioGroup.Label>

              <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {writingStyles.map((writingStyle) => (
                  <RadioGroup.Option
                    key={writingStyle.id}
                    value={writingStyle}
                    className={({ checked, active }) =>
                      cn(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'ring-2 ring-indigo-500' : '',
                        'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <>
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                          {checked ? (
                          <Icon className="" name={`check`} />
                        ) : // <CheckCircleIcon className="w-5 h-5 text-indigo-600" aria-hidden="true" />

                        null}
                          <img className="h-auto mx-3 my-3 rounded-md w-15 lg:w-25 lg:h-auto" 
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/56c20eda-f59b-4f26-a310-76aff1f094d0`}
                          alt="" />
                          

                            <RadioGroup.Label
                              as="span"
                              className="block mx-3 text-sm font-semibold text-gray-900"
                            >
                              {writingStyle.title}{' '}
                              {/* <span className="align-right">
                                {writingStyle.price}
                              </span> */}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className="flex items-center mx-3 mt-1 text-sm text-gray-500"
                            >
                              {writingStyle.description}
                            </RadioGroup.Description>
                          </span>
                        </span>
                        
                        <span
                          className={cn(
                            active ? 'border' : 'border-2',
                            checked
                              ? 'border-indigo-500'
                              : 'border-transparent',
                            'pointer-events-none absolute -inset-px rounded-lg'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Step3() {
  const brand = SwrBrand()

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  )

  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 pt-5 pb-24 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
      
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

    <div className="py-5 border md:py-0 bg-gray-50 sm:rounded-lg border-gray-150">
      <div className="px-4 pb-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Want to send multiple Thanklys?</h3>
        <div className="mt-2 text-sm text-gray-500">
          <p>{`You can send the same Thankly to multiple people all at once. We'll even do the hard work and write in their names from your message.`}</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          ><Icon className="mr-2" name={'dashboard_customize'} />
            Click Here
          </button>
        </div>
      </div>
    </div>
 

        <form className="mt-10 lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            

            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Recipient Details
              </h2>
             
              <div className="grid grid-cols-2 mt-4 gap-x-2 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      autoComplete="given-name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      autoComplete="family-name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="apartment"
                      id="apartment"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>
                {/* <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div> */}
              </div>
            </div>

         

           
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="w-20 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col flex-1 ml-6">
                      <div className="flex">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm">
                            <a
                              href={product.href}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product.name}
                            </a>
                          </h4>
                        </div>

                        <div className="flex-shrink-0 flow-root ml-4">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove</span>
                            <Icon className="" name={`delete`} />

                            {/* <TrashIcon className="w-5 h-5" aria-hidden="true" /> */}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-end justify-between flex-1 pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {product.price}
                        </p>

                       
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="px-4 py-6 space-y-6 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">$64.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium text-gray-900">$5.52</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Thankly Voucher</dt>
                  <dd className="text-sm font-medium text-gray-900">($5.52)</dd>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <dt className="text-base font-medium">Total Due</dt>
                  <dd className="text-base font-medium text-gray-900">
                    $75.52
                  </dd>
                </div>
              </dl>






              <div className="px-4 py-6 border-t border-gray-200 sm:px-6">

              

      
                 {/* Thankly Voucher */}
            <div >
              <h2 className="text-lg font-medium text-gray-900">
                Thankly Voucher
              </h2>
              <p className="block pt-2 text-sm font-medium text-gray-700">
                If you would like to use a Thankly Voucher for this purchase, please
                enter it here. <span className="font-semibold">{` If Voucher Balance is insufficient, you will be directed to Stripe to collect card details for the remaining amount.`}</span>
              </p>


              <div className="flex py-3 mt-1 rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
           <Icon name={'redeem'} />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full pl-10 font-semibold border-gray-300 rounded-none txt-slate-500 rounded-l-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="VOUCHER CODE"
          />
        </div>
        <button
          type="button"
          className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <Icon name={'attach_money'} />
          <span>100.00</span>
        </button>
      </div>

      
           
            </div>



                <button
                  type="submit"
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className="w-full px-4 py-3 text-base font-medium text-white align-middle border border-transparent rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  <Icon className="mr-3 -mt-1 text-white align-middle" name={'credit_card'} /> Confirm order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const steps = [
  {
    id: '01',
    name: 'Choose',
    description:
      'Choose a gift to create a Thankly or just send a thoughtfully designed card.',
    href: '#',
    status: 'current',
  },
  {
    id: '02',
    name: 'Personalise',
    description:
      'Personalise your Thankly with a handwritten message and extra options.',
    href: '#',
    status: 'upcoming',
  },
  {
    id: '03',
    name: 'Send',
    description:
      'Add recipient details, confirm, pay and send your Thankly and our team will do the rest.',
    href: '#',
    status: 'upcoming',
  },
]


const writingStyles = [
  {id: 1,title: 'Natural Print',description: 'Handwritten messge with naturally printed letters.',},
  { id: 2, title: 'Cursive Italics', description: 'Handwritten messge with cursive, italicized letters.', },
  { id: 2, title: 'Full Caps', description: 'Handwritten messge with all letters capitalised.', },

]


const deliveryMethods = [
  {
    id: 1,
    title: 'Standard',
    turnaround: '4–10 business days',
    price: '$5.00',
  },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
]

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
  // More products...
]

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
