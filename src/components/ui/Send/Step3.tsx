import cn from 'clsx'
import Fuse from 'fuse.js'
import { useState, useEffect } from 'react'

import { mergeRefs } from 'react-merge-refs'
import { SwrBrand } from '@/lib/swr-helpers'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode,
  getDetails,
} from 'use-places-autocomplete'
import useOnclickOutside from 'react-cool-onclickoutside'
import { Switch } from '@headlessui/react'

const Icon = dynamic(() => import('@/components/common/Icon'))

import Script from 'next/script'

interface Step3Props {
  // children?: React.ReactNode[]
  className?: string
  // data?: any
}

// eslint-disable-next-line react/display-name
const Step3: React.FC<Step3Props> = ({ className }) => {
  const brand = SwrBrand()
  const [manualAddress, setManualAddress] = useState(false)

  // https://github.com/wellyshen/use-places-autocomplete?ref=hackernoon.com#api
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],

      componentRestrictions: { country: 'au' },
    },
    debounce: 300,
    cache: 24 * 60 * 60, // Provide the cache time in seconds, default is 24 hours
  })
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions()
  })

  // Update the keyword of the input element
  const handleInput = (e: any) => {
    setValue(e.target.value)
  }

  const handleSelect =
    ({ description }: any) =>
    () => {
      // Get latitude and longitude via utility functions
      getGeocode({
        address: description,
        componentRestrictions: { country: 'au' },
      }).then((results) => {
        // const { lat, lng } = getLatLng(results[0])
        // console.log('📍 Coordinates: ', { lat, lng })
        const zipCode = getZipCode(results[0], false)
        description += `, ` + zipCode
        console.log('Description: ', description)
        setValue(description, false)
      })

      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      // setValue(description, false)
      clearSuggestions()
    }

  const renderSuggestions = () =>
    data.map((suggestion: any) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <span className="text-sm">{`${main_text}, ${secondary_text}`}</span>
        </li>
      )
    })

  return (
    <div className="bg-white">
      <div className="max-w-2xl pt-5 pb-24 mx-auto lg:max-w-7xl ">
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

        <div className="py-5 border border-gray-150 bg-gray-50 sm:rounded-lg md:py-0">
          <div className="px-4 pb-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Want to send multiple Thanklys?
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>{`You can send the same Thankly to multiple people all at once. We'll even do the hard work and write in their names from your message.`}</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                <Icon className="mr-2" name={'dashboard_customize'} />
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

                <div>
                  <div className="flex justify-between">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <span className="text-sm text-gray-500" id="email-optional">
                      Optional
                    </span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="you@example.com"
                      aria-describedby="email-optional"
                    />
                  </div>
                </div>

                {/* TODO: https://github.com/wellyshen/use-places-autocomplete?ref=hackernoon.com#api */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1" ref={ref}>
                    <input
                      value={value}
                      onChange={handleInput}
                      disabled={!ready}
                      type="text"
                      name="ship-address"
                      id="ship-address"
                      required
                      autoComplete="off"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                    {/* We can use the "status" to decide whether we should display the dropdown or not */}
                    {status === 'OK' && <ul>{renderSuggestions()}</ul>}
                    <Switch.Group
                      as="div"
                      className="relative flex items-center ml-3 tracking-tight"
                    >
                      <Switch
                        checked={manualAddress}
                        onChange={() => {
                          if (manualAddress === true) {
                            setManualAddress(false)
                          }
                          if (manualAddress === false) {
                            setManualAddress(true)
                          }
                        }}
                        className={cn(
                          manualAddress ? 'bg-slate-600' : 'bg-gray-200',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            manualAddress ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                      <Switch.Label as="span" className="flex ml-3">
                        <span className="text-sm font-medium leading-tight text-gray-900">
                          Enter address manually.
                        </span>
                      </Switch.Label>
                    </Switch.Group>
                  </div>
                  <p
                    className="mt-2 text-sm text-gray-500"
                    id="email-description"
                  >
                    At this time, we only deliver Thanklys to addresses in
                    Australia. Please type Parcel Lockers and PO Boxes in
                    manually.
                  </p>
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
                      id="address2"
                      name="address2"
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
                      id="locality"
                      name="locality"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
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
                      id="postcode"
                      name="postcode"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                    />
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
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Thankly Voucher
                  </h2>
                  <p className="block pt-2 text-sm font-medium text-gray-700">
                    {`If you would like to use a Thankly Voucher for this
                    purchase, please enter it here.`}
                    <span className="font-semibold">{` If Voucher Balance is insufficient, you will be directed to Stripe to collect card details for the remaining amount.`}</span>
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
                      {/* <Icon name={'hourglass_empty'} /> */}
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
                  <Icon
                    className="mr-3 -mt-1 text-white align-middle"
                    name={'credit_card'}
                  />
                  {`Confirm order`}
                </button>
                <p className="justify-center mt-3 text-sm font-medium text-gray-500 ">
                  <Icon
                    name={'lock'}
                    className="mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  We use{' '}
                  <Link className="underline" href="https://stripe.com/au">
                    <a>Stripe</a>
                  </Link>{' '}
                  to securely process your payments.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Step3

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
