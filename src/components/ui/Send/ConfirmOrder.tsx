import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cn from 'clsx'
import debounce from 'lodash/debounce'
import { SwrBrand } from '@/lib/swr-helpers'
import { postData } from '@/lib/api-helpers'

// core imports
// lib imports
// ui imports
import { useRouter } from 'next/router'

import { getStripe } from '@/lib/stripe-client'
import { loadStripe } from '@stripe/stripe-js'
import useOnclickOutside from 'react-cool-onclickoutside'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode,
  getDetails,
} from 'use-places-autocomplete'
import { Store } from '@/lib/Store'

import { RadioGroup } from '@headlessui/react'
const Icon = dynamic(() => import('@/components/common/Icon'))
const Modal = dynamic(() => import('@/components/ui/Modal'))
const Notification = dynamic(() => import('@/components/ui/Notification'))

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const key: any =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_STRIPE_PUB_KEY
    : process.env.NEXT_PUBLIC_PRD_STRIPE_PUB_KEY

const stripePromise = loadStripe(key)

export default function ConfirmOrder() {
  // State & Variable Declarations
  const { state, dispatch } = useContext(Store)
  const [address, setAddress]: any = useState({})
  const brand = SwrBrand()
  let { errors } = state.cart
  // Function Declarations
  const router = useRouter()

  const [voucherBalance, setVoucherBalance] = useState(
    state.cart.options.voucher * 1
      ? state.cart.options.voucher.value * 1 -
      state.cart.options.voucher.used * 1
      : 0
  )
  const [processing, setProcessing]: any = useState(false)

  //
  // Google Address Autocomplete
  //
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
  //
  //
  // When user clicks outside of the component, we can dismiss the searched suggestions by calling this method
  const ref = useOnclickOutside(() => {
    clearSuggestions()
  })
  //
  //
  // Update the keyword of the input element
  const handleInput = (e: any) => {
    setValue(e.target.value)
  }
  //
  //
  // Renders addresses returned
  const renderSuggestions = () =>
    data.map((suggestion: any) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li
          className="px-2 border border-gray-100 shadow-sm bg-gray-50"
          key={place_id}
          onClick={handleSelect(suggestion)}
        >
          <span className="text-sm">
            <Icon className="-mr-3 text-sm" name={'pin_drop'} />{' '}
            {`${main_text}, ${secondary_text}`}
          </span>
        </li>
      )
    })
  //
  //
  // handles address selection
  const handleSelect = (data: any) => () => {
    // console.log('data -', data)
    // Get latitude and longitude via utility functions
    var circle: any
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        circle = new window.google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy,
        })
        // autoComplete.setBounds(circle.getBounds());
      })
    }
    getGeocode({
      address: data.description,
      bounds: circle?.getBounds(),
      componentRestrictions: { country: 'au' },
    }).then((results) => {
      // const { lat, lng } = getLatLng(results[0])
      // console.log('📍 Coordinates: ', { lat, lng })
      const zipCode = getZipCode(results[0], false)
      data.description += `, ` + zipCode
      // console.log('Description: ', data.description)
      setValue(data.description, false)

      const parameter = {
        // Use the "place_id" of suggestion from the dropdown (object), here just taking first suggestion for brevity
        placeId: data.place_id,
        fields: ['formatted_address', 'address_component'], // Specify the return data that you want (optional)
      }
      getDetails(parameter)
        .then((addressObject: any) => {
          // console.log('Details: ', addressObject)
          setAddress({
            street_number: addressObject.address_components[0].short_name,
            street_name: addressObject.address_components[1].short_name,
            suburb: addressObject.address_components[2].short_name,
            state: addressObject.address_components[4].short_name,
            postcode: addressObject.address_components[6].short_name,
            country: addressObject.address_components[5].long_name,
            fulladdress: addressObject.formatted_address,
          })

          dispatch({
            type: 'SET_RECIPIENT',
            payload: {
              address: {
                ...state.cart.recipient.address,
                ...{
                  street_number: addressObject.address_components[0].short_name,
                  street_name: addressObject.address_components[1].short_name,
                  suburb: addressObject.address_components[2].short_name,
                  state: addressObject.address_components[4].short_name,
                  postcode: addressObject.address_components[6].short_name,
                  country: addressObject.address_components[5].long_name,
                  fulladdress: addressObject.formatted_address,
                },
              },
            },
          })
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
    })

    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    // setValue(description, false)
    clearSuggestions()
  }

  // Component Returns
  return (
    <div className="max-w-2xl pb-10 mx-auto lg:max-w-7xl ">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <div className="p-2 px-3">
            <h3
              id="contact-info-heading"
              className="text-lg font-medium text-gray-900 border-b border-gray-200"
            >
              Recipient Details
            </h3>

            <div className="grid grid-cols-4 mt-6 gap-y-3 gap-x-4 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    defaultValue={state.cart.recipient.firstname}
                    autoComplete="given-name"
                    aria-describedby="name-error"
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          firstname: e.target.value,
                        },
                      })
                    }, 300)}
                    className={cn(
                      errors?.filter((error: any) => error.id === 'firstname')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'firstname')
                    .length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon
                          name={'error'}
                          className="w-5 h-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                </div>
                {errors?.filter((error: any) => error.id === 'firstname')
                  .length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors?.filter(
                          (error: any) => error.id === 'firstname'
                        )[0].message
                      }
                    </p>
                  )}
              </div>

              <div className="col-span-2 sm:col-span-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="lastname"
                    autoComplete="family-name"
                    defaultValue={state.cart.recipient.lastname}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          lastname: e.target.value,
                        },
                      })
                    }, 300)}
                    className={cn(
                      errors?.filter((error: any) => error.id === 'lastname')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'lastname')
                    .length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon
                          name={'error'}
                          className="w-5 h-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                </div>
                {errors?.filter((error: any) => error.id === 'lastname')
                  .length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors?.filter((error: any) => error.id === 'lastname')[0]
                          .message
                      }
                    </p>
                  )}
              </div>

              <div className="col-span-4">
                <div className="flex justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <span className="text-xs italic text-gray-400">Optional</span>
                </div>

                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="company"
                    // {...register('company', {})}
                    defaultValue={state.cart.recipient.company}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          company: e.target.value,
                        },
                      })
                    }, 300)}
                    aria-describedby="company-optional"
                    className={cn(
                      errors?.filter((error: any) => error.id === 'company')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'company')
                    .length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon
                          name={'error'}
                          className="w-5 h-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-2 px-3 ">
            <h3
              id="contact-info-heading"
              className="text-lg font-medium text-gray-900 border-b border-gray-200"
            >
              Shipping Address
            </h3>
            <p className="mt-2 text-sm italic leading-snug text-gray-500">
              At this time, we only ship Thanklys to addresses in Australia.
              Please enter Floor, Apt / Unit, PO Box or Parcel Lockers manually
              in the second field.
            </p>
            <div className="grid grid-cols-1 mt-6 gap-y-3 gap-x-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <div className="flex justify-between">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm" ref={ref}>
                  <input
                    value={
                      state.cart.recipient.address.fulladdress
                        ? state.cart.recipient.address.fulladdress
                        : value
                    }
                    // defaultValue={state.cart.recipient.address.fulladdress}
                    onChange={handleInput}
                    disabled={!ready}
                    type="text"
                    placeholder="Start typing your street address..."
                    autoComplete="off"
                    className={cn(
                      errors?.filter((error: any) => error.id === 'address')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {status === 'OK' && <ul>{renderSuggestions()}</ul>}

                  {errors?.filter((error: any) => error.id === 'address')
                    .length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon
                          name={'error'}
                          className="w-5 h-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                </div>
                {errors?.filter((error: any) => error.id === 'address').length >
                  0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors?.filter((error: any) => error.id === 'address')[0]
                          .message
                      }
                    </p>
                  )}
              </div>
              <div className="sm:col-span-3">
                <div className="flex justify-between">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Floor, Apt / Unit, PO Box or Parcel Locker
                  </label>
                  <span className="text-xs italic text-gray-400">Optional</span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="address2"
                    placeholder=""
                    defaultValue={state.cart.recipient.address.line2}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          address: {
                            ...state.cart.recipient.address,
                            line2: e.target.value,
                          },
                        },
                      })
                    }, 300)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="hidden">
                <div className="flex justify-between">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Suburb
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="mt-1">
                  <input
                    type="text"
                    id="locality"
                    name="locality"
                    defaultValue={state.cart.recipient.address.suburb}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          address: {
                            ...state.cart.recipient.address,
                            suburb: e.target.value,
                          },
                        },
                      })
                    }, 300)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="hidden">
                <div className="flex justify-between">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="mt-1">
                  <select
                    id="state"
                    name="state"
                    required
                    autoComplete="state"
                    value={address.state ? address.state : 'NSW'}
                    defaultValue={state.cart.recipient.address.state}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          address: {
                            ...state.cart.recipient.address,
                            state: e.target.value,
                          },
                        },
                      })
                    }, 300)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  >
                    <option>NSW</option>
                    <option>VIC</option>
                    <option>QLD</option>
                    <option>SA</option>
                    <option>WA</option>
                    <option>TAS</option>
                    <option>NT</option>
                  </select>
                </div>
              </div>

              <div className="hidden">
                <div className="flex justify-between">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postcode
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="mt-1">
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    required
                    // value={address.postcode ? address.postcode : ''}
                    defaultValue={state.cart.recipient.address.postcode}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_RECIPIENT',
                        payload: {
                          address: {
                            ...state.cart.recipient.address,
                            postcode: e.target.value,
                          },
                        },
                      })
                    }, 300)}
                    autoComplete="postal-code"
                    // {...register('postcode', { required: true })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-1 lg:gap-x-12 xl:gap-x-16">
        <div className="p-2 px-3">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200">
            Your Contact Details
          </h3>
          <p className="mt-2 text-sm italic leading-snug text-gray-500">
            Provide your name and email so that we can get send you Order
            Notifications and get in touch with you in case there are problems
            with your order.
          </p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <div className="p-2 px-3">
            <div className="grid grid-cols-4 mt-6 gap-y-3 gap-x-4 sm:grid-cols-4">
              <div className="col-span-4">
                <div className="flex justify-between">
                  <label
                    htmlFor="sendername"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="lastname"
                    defaultValue={state.cart.sender.name}
                    onChange={debounce((e: any) => {
                      dispatch({
                        type: 'SET_SENDER_NAME',
                        payload:  e.target.value,
                      })
                    }, 300)}
                    className={cn(
                      errors?.filter((error: any) => error.id === 'sender_name')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'sender_name')
                    .length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon
                          name={'error'}
                          className="w-5 h-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                </div>
                {errors?.filter((error: any) => error.id === 'sender_name')
                  .length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {errors?.filter((error: any) => error.id === 'sender_name')[0].message}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-2 px-3 ">
            <div className="grid grid-cols-1 mt-6 gap-y-3 gap-x-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <div className="flex justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Email
                  </label>
                  <span className="text-xs italic text-gray-400">Required</span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="email"
                    id="email"
                    placeholder=""
                    defaultValue={state.cart.sender.email}
                    onChange={debounce((e: any) => {

                      // check if email pattern applies
                      const regex = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
                      regex.test(e.target.value) === true ?
                        dispatch({
                          type: 'SET_SENDER_EMAIL',
                          payload:
                            e.target.value,
                        }) : dispatch({
                          type: 'SET_SENDER_EMAIL',
                          payload: '',

                        })
                    }, 300)}
                    className={cn(
                      errors?.filter((error: any) => error.id === 'sender_email')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'sender_email')
                    .length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon
                          name={'error'}
                          className="w-5 h-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                </div>
                {errors?.filter((error: any) => error.id === 'sender_email')
                  .length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors?.filter((error: any) => error.id === 'sender_email')[0]
                          .message
                      }
                    </p>
                  )}
              </div>

            </div>
          </div>
        </div>
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
    </div >
  )
}
