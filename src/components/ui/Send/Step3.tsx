import cn from 'clsx'
import { useState, useEffect, useRef, useContext, Fragment } from 'react'
import { SwrBrand } from '@/lib/swr-helpers'
import dynamic from 'next/dynamic'
import Link from 'next/link'
// import Script from 'next/script'
import Image from 'next/future/image'
import debounce from 'lodash/debounce'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode,
  getDetails,
} from 'use-places-autocomplete'
import useOnclickOutside from 'react-cool-onclickoutside'
import { RadioGroup } from '@headlessui/react'
import { Store } from '@/lib/Store'
import { loadStripe } from '@stripe/stripe-js'
import { postData } from '@/lib/api-helpers'
import { stripe } from '@/lib/stripe'
import { getStripe } from '@/lib/stripe-client'
import { useRouter } from 'next/router'

const Icon = dynamic(() => import('@/components/common/Icon'))
const Modal = dynamic(() => import('@/components/ui/Modal'))

interface Step3Props {
  className?: string
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
)

// eslint-disable-next-line react/display-name
const Step3: React.FC<Step3Props> = ({ className }) => {
  const router = useRouter()

  const brand = SwrBrand()
  const { shippingRates } = brand
  const { state, dispatch } = useContext(Store)
  const [voucherValid, setVoucherValid]: any = useState()
  const [voucherBalance, setVoucherBalance] = useState(
    state.cart.options.voucher
      ? state.cart.options.voucher.value * 1 -
          state.cart.options.voucher.used * 1
      : 0
  )
  const [address, setAddress]: any = useState({})
  const [processing, setProcessing]: any = useState(false)
  const [errors, setErrors]: any[] = useState([])
  const [initiateCheckout, setInitiateCheckout] = useState(false)

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

  // When user clicks outside of the component, we can dismiss the searched suggestions by calling this method
  const ref = useOnclickOutside(() => {
    clearSuggestions()
  })

  // Update the keyword of the input element
  const handleInput = (e: any) => {
    setValue(e.target.value)
  }

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

  const num = 0

  return (
    <div className="bg-white">
      {/* <Script
        strategy="beforeInteractive"
        id="googlemaps"
        type="text/javascript"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_PLACES_AUTOCOMPLETE}&libraries=places`}
      /> */}

      <div className="max-w-2xl pt-5 pb-24 mx-auto lg:max-w-7xl ">
        {/* <div className="py-5 border border-gray-150 bg-gray-50 sm:rounded-lg md:py-0">
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
                className="inline-flex items-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:text-sm"
              >
                <Icon className="mr-2" name={'dashboard_customize'} />
                Click Here
              </button>
            </div>
          </div>
        </div> */}

        <div className="mt-5 lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h3
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
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
                    <span className="text-xs italic text-gray-400">
                      Required
                    </span>
                  </div>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      defaultValue={state.cart.recipient.firstname}
                      autoComplete="given-name"
                      // aria-invalid={errors.firstname ? 'true' : 'false'}
                      aria-describedby="name-error"
                      // placeholder="John"
                      // {...register('firstName', {
                      //   required: true,
                      //   maxLength: 80,
                      // })}
                      onChange={debounce((e: any) => {
                        dispatch({
                          type: 'SET_RECIPIENT',
                          payload: {
                            firstname: e.target.value,
                          },
                        })
                      }, 300)}
                      className={cn(
                        errors.filter((item: any) => item.id === 'firstname')
                          .length > 0
                          ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                          : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                        `block w-full rounded-md shadow-sm sm:text-sm`
                      )}
                    />
                    {errors.filter((item: any) => item.id === 'firstname')
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
                  {errors.filter((item: any) => item.id === 'firstname')
                    .length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors.filter((item: any) => item.id === 'firstname')[0]
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <div className="flex justify-between">
                    <label
                      htmlFor="cvc"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <span className="text-xs italic text-gray-400">
                      Required
                    </span>
                  </div>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="lastname"
                      // name="lastname"
                      autoComplete="family-name"
                      // {...register('lastname', { required: true })}
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
                        errors.filter((item: any) => item.id === 'lastname')
                          .length > 0
                          ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                          : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                        `block w-full rounded-md shadow-sm sm:text-sm`
                      )}
                    />
                    {errors.filter((item: any) => item.id === 'lastname')
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
                  {errors.filter((item: any) => item.id === 'lastname').length >
                    0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors.filter((item: any) => item.id === 'lastname')[0]
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
                    <span className="text-xs italic text-gray-400">
                      Optional
                    </span>
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
                        errors.filter((item: any) => item.id === 'company')
                          .length > 0
                          ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                          : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                        `block w-full rounded-md shadow-sm sm:text-sm`
                      )}
                    />
                    {errors.filter((item: any) => item.id === 'company')
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

            <div className="mt-5">
              <h3 className="text-lg font-medium text-gray-900">
                Shipping Address
              </h3>
              <p className="mt-2 text-sm italic leading-snug text-gray-500">
                At this time, we only ship Thanklys to addresses in Australia.
                Please enter Floor, Apt / Unit, PO Box or Parcel Lockers
                manually in the second field.
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
                    <span className="text-xs italic text-gray-400">
                      Required
                    </span>
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
                        errors.filter((item: any) => item.id === 'address')
                          .length > 0
                          ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                          : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                        `block w-full rounded-md shadow-sm sm:text-sm`
                      )}
                    />
                    {status === 'OK' && <ul>{renderSuggestions()}</ul>}

                    {errors.filter((item: any) => item.id === 'address')
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
                  {errors.filter((item: any) => item.id === 'address').length >
                    0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors.filter((item: any) => item.id === 'address')[0]
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
                    <span className="text-xs italic text-gray-400">
                      Optional
                    </span>
                  </div>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="address2"
                      placeholder=""
                      // {...register('address2', {})}
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
                      // autoComplete="street-address"
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
                    <span className="text-xs italic text-gray-400">
                      Required
                    </span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="locality"
                      name="locality"
                      // value={address.suburb ? address.suburb : ''}
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
                      // autoComplete="address-level2"
                      // {...register('locality', { required: true })}
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
                    <span className="text-xs italic text-gray-400">
                      Required
                    </span>
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
                    <span className="text-xs italic text-gray-400">
                      Required
                    </span>
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

          {/* Order summary */}

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
                {state.cart.items?.map((product: any) => (
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
                    {`$` + Number(state.cart.totals.subtotal * 1).toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping Options</dt>

                  <dd className="text-sm font-medium text-gray-900">
                    {`$` + Number(state.cart.totals.shipping * 1).toFixed(2)}
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
                    <RadioGroup.Label className="sr-only">
                      {'Choose a memory option'}
                    </RadioGroup.Label>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                      {shippingRates.map((option: any) => (
                        <>
                          {state.cart.totals.items * 1 < 50 &&
                          option.name === 'Express (Free)' ? (
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
                                  Number(option.amount).toFixed(2)}
                              </RadioGroup.Label>
                            </RadioGroup.Option>
                          )}
                        </>
                      ))}
                    </div>
                  </RadioGroup>

                  {errors.filter((item: any) => item.id === 'shippingRate')
                    .length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-red-600">
                      {
                        errors.filter(
                          (item: any) => item.id === 'shippingRate'
                        )[0].message
                      }
                    </p>
                  )}
                </dt>

                <div className="flex items-center justify-between pt-2">
                  <dt className="text-sm">G.S.T</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {`$` +
                      Number(
                        state.cart.totals.subtotal * 1 +
                          state.cart.totals.shipping * 1 ===
                          0
                          ? 0
                          : (state.cart.totals.subtotal * 1 +
                              state.cart.totals.shipping * 1) /
                              11
                      ).toFixed(2)}
                  </dd>
                </div>
                {state.cart.totals.voucher * 1 !== 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Thankly Voucher (applied)</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {`-$` +
                        Number(state.cart.totals.voucher * 1).toFixed(2) +
                        ``}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <dt className="text-base font-semibold">Order Total</dt>
                  <dd className="text-base font-semibold text-gray-900">
                    {`$` + Number(state.cart.totals.net * 1).toFixed(2)}
                  </dd>
                </div>

                {/* {state.cart.total === 0 && (
                  <div className="justify-center mt-3 text-sm font-medium text-gray-500 ">
                    <input
                      id="terms"
                      type="checkbox"
                      // {...register('terms', { required: true })}
                      checked={
                        state.cart.options.termsAccepted
                          ? state.cart.options.termsAccepted
                          : false
                      }
                      onChange={(e: any) => {
                        // console.log('checked', e.target.checked)
                        dispatch({
                          type: 'SET_TERMS',
                          payload: {
                            termsAccepted: e.target.checked === true,
                          },
                        })
                      }}
                      className="w-4 h-4 border-gray-300 rounded text-slate-600 focus:ring-slate-500"
                    />

                    <label
                      htmlFor="terms"
                      className="ml-3 font-medium text-gray-700"
                    >
                      {'I accept the '}
                      <Link className="underline" passHref href="/privacy">
                        <a target="_blank" rel="noopener noreferrer">
                          {' Thankly Terms & Conditions.'}
                        </a>
                      </Link>
                    </label>
                    {errors.filter((item: any) => item.id === 'terms').length >
                      0 && (
                      <p className="mt-2 text-xs leading-snug text-red-600">
                        {
                          errors.filter((item: any) => item.id === 'terms')[0]
                            .message
                        }
                      </p>
                    )}
                  </div>
                )} */}
              </dl>

              <div className="px-4 py-3 sm:px-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Thankly Voucher
                  </h2>
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

                            setVoucherBalance(
                              state.cart.totals.voucher.toFixed(2)
                            )
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
                        {(state.cart.options.voucher
                          ? state.cart.options.voucher.value * 1 -
                            state.cart.options.voucher.used * 1
                          : 0
                        ).toFixed(2)}
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

                    // final cart
                    // console.log('final cart --', state.cart)

                    // collate any errors
                    let foundErrors: any[] = []
                    state.cart.recipient.firstname === ''
                      ? (foundErrors = foundErrors.concat([
                          {
                            id: 'firstname',
                            title: 'Empty First Name',
                            message: `First Name is required. Please fill in the field.`,
                          },
                        ]))
                      : null
                    state.cart.recipient.lastname === ''
                      ? (foundErrors = foundErrors.concat([
                          {
                            id: 'lastname',
                            title: 'Empty Last Name',
                            message: `Last Name is required. Please fill in the field.`,
                          },
                        ]))
                      : null
                    // state.cart.totals.net === 0 && state.cart.options.termsAccepted === false
                    //   ? (foundErrors = foundErrors.concat([
                    //       {
                    //         id: 'terms',
                    //         title: 'Terms not accepted.',
                    //         message: `Please accept the terms & conditions.`,
                    //       },
                    //     ]))
                    //   : null

                    JSON.stringify(state.cart.options.shipping) === '{}'
                      ? (foundErrors = foundErrors.concat([
                          {
                            id: 'shippingRate',
                            title: 'Shipping Option not selected.',
                            message: `Please select a shipping option.`,
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
                            message: `Recipient Address not provided. Please fill out the recipient's shipping address.`,
                          },
                        ]))
                      : null

                    if (foundErrors.length > 0) {
                      setErrors(foundErrors)
                      console.log('errors --', errors)
                      setProcessing(false)
                      return
                    }

                    console.log('initiating checkout...')

                    try {
                      console.log('final cart -- ', state.cart)
                      if (state.cart.totals.net * 1 === 0) {
                        // nothing to pay, complete processing of order directly (send to api)
                        const order = await postData({
                          url: '/api/createOrder',
                          data: { cart: state.cart, status: 'placed' },
                        })
                        console.log('returned order -- ', order)

                        // redirect to order page with order data
                        order.id != ''
                          ? router.push({
                              pathname: '/order',
                              query: { id: order.id, status: true },
                            })
                          : null

                        setProcessing(false)
                        setInitiateCheckout(false)
                        dispatch({
                          type: 'CLEAR_CART',
                        })
                      } else {
                        // balance to pay -- total != 0

                        // create draft order before initating checkout
                        const order = await postData({
                          url: '/api/createOrder',
                          data: { cart: state.cart, status: 'draft' },
                        })

                        const { sessionId } = await postData({
                          url: '/api/createCheckoutSession',
                          data: { cart: state.cart, orderId: order.id },
                        })

                        console.log('checkout sessionid -- ', sessionId)

                        const stripe = await getStripe()
                        stripe?.redirectToCheckout({ sessionId }) // should re-direct to orderconfirm or fail
                        setProcessing(false)
                        setInitiateCheckout(false)
                        dispatch({
                          type: 'CLEAR_CART',
                        })
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
                  {`Confirm order`}
                </button>
                <p className="justify-between text-sm font-medium text-center align-middle text-slate-700 ">
                  <Icon
                    name={'lock'}
                    className="w-5 h-5 mr-2 text-base"
                    aria-hidden="true"
                  />
                  We use{' '}
                  <Link className="underline" href="https://stripe.com/au">
                    <a>Stripe</a>
                  </Link>
                  {' to securely process your payments.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={processing}
          readOnly
          icon={
            <Icon
              className="animate-pulse text-slate-700"
              aria-hidden="true"
              name="hourglass_empty"
            />
          }
          content={{
            title: `Confirming your order...`,
            description: `Please wait we're confirming your order.`,
          }}
        />
      </div>
    </div>
  )
}

export default Step3
