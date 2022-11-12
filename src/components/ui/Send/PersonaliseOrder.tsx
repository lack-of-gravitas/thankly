// core imports
// lib imports
// ui imports
import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cn from 'clsx'
const Icon = dynamic(() => import('@/components/common/Icon'))

// lib
import debounce from 'lodash/debounce'

import { Store } from '@/lib/Store'

// ui
import { RadioGroup } from '@headlessui/react'
import { SwrWritingStyles, SwrRibbons } from '@/lib/swr-helpers'

export default function PersonaliseOrder() {
  const { state, dispatch } = useContext(Store)
  // State & Variable Declarations
  // Function Declarations
  // Component Return

  let { errors } = state.cart
  const writingStyles = SwrWritingStyles()
  const ribbons = SwrRibbons()
  const [selectedWritingStyle, setSelectedWritingStyle] = useState(
    state.cart.cardContent.writingStyle
  )
  const [selectedRibbon, setSelecedRibbon] = useState(state.cart.options.ribbon)

  return (
    <div className="">
      <div className="max-w-2xl pb-10 mx-auto lg:max-w-7xl ">
        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="lg:mt-0">
            <RadioGroup
              value={selectedWritingStyle}
              onChange={(style: any) => {
                setSelectedWritingStyle(style)
                dispatch({
                  type: 'SET_STYLE',
                  payload: { style },
                })
              }}
            >
              <h3
                id="writingStyle"
                className="text-lg font-medium text-gray-900 border-b border-gray-200"
              >
                Handwriting Style
              </h3>

              <RadioGroup.Label className="hidden text-lg font-medium text-gray-900 ">
                Handwriting Style
              </RadioGroup.Label>

              <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-3 sm:gap-x-3">
                {writingStyles?.map((writingStyle: any) => (
                  <RadioGroup.Option
                    key={writingStyle.id}
                    value={writingStyle}
                    className={({ checked, active }) =>
                      cn(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'ring-2 ring-slate-700' : '',
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
                            ) : null}
                            <img
                              className="h-auto mx-3 my-3 rounded-md w-15 lg:w-25 lg:h-auto"
                              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${writingStyle.image}`}
                              alt=""
                            />

                            <RadioGroup.Label
                              as="span"
                              className="block mx-3 text-sm font-semibold leading-tight text-gray-900"
                            >
                              {writingStyle.name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className="flex items-center mx-3 mt-1 text-sm leading-tight text-gray-500"
                            >
                              {writingStyle.description}
                            </RadioGroup.Description>
                          </span>
                        </span>

                        <span
                          className={cn(
                            active ? 'border' : 'border-2',
                            checked ? 'border-slate-700' : 'border-transparent',
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

            {/* {errors?.filter((error: any) => error.id === 'ribbon').length > 0 && (
              <p className="mt-2 text-xs leading-snug text-red-600">
                {
                  errors?.filter((error: any) => error.id === 'shippingRate')[0]
                    .message
                }
              </p>
            )} */}
          </div>

          {ribbons && ribbons?.length > 0 && (
            <div className="mt-10 lg:mt-0">
              <RadioGroup
                value={selectedRibbon}
                onChange={(ribbon: any) => {
                  setSelecedRibbon(ribbon)
                  dispatch({
                    type: 'SET_RIBBON',
                    payload: { ribbon },
                  })
                }}
              >
                <h3
                  id="contact-info-heading"
                  className="text-lg font-medium text-gray-900 border-b border-gray-200"
                >
                  Add a Ribbon (optional)
                </h3>
                <RadioGroup.Label className="hidden text-lg font-medium text-gray-900 ">
                  Add a Ribbon
                </RadioGroup.Label>

                <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-3 sm:gap-x-3">
                  {ribbons?.map((item: any) => (
                    <RadioGroup.Option
                      key={item.id}
                      value={item}
                      className={({ checked, active }) =>
                        cn(
                          checked ? 'border-transparent' : 'border-gray-300',
                          active ? 'ring-2 ring-slate-700' : '',
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
                              ) : null}
                              <img
                                className="h-auto mx-3 my-3 rounded-md w-15 lg:w-25 lg:h-auto"
                                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${item.images[0].directus_files_id}`}
                                alt=""
                              />

                              <RadioGroup.Label
                                as="span"
                                className="block mx-3 text-sm font-semibold leading-tight text-gray-900"
                              >
                                {item.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="flex items-center mx-3 mt-1 text-sm leading-tight text-gray-500"
                              >
                                {item.description}
                              </RadioGroup.Description>
                            </span>
                          </span>

                          <span
                            className={cn(
                              active ? 'border' : 'border-2',
                              checked
                                ? 'border-slate-700'
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
              {/* {errors?.filter((error: any) => error.id === 'ribbon').length > 0 && (
              <p className="mt-2 text-xs leading-snug text-red-600">
                {
                  errors?.filter((error: any) => error.id === 'shippingRate')[0]
                    .message
                }
              </p>
            )} */}
            </div>
          )}

          <div className="mt-10 lgmt-0 ">
            <h2 className="text-lg font-medium text-gray-900 border-b border-gray-300">
              Message
            </h2>

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
                    rows={10}
                    name="message"
                    id="message"
                    defaultValue={state.cart.cardContent.message}
                    onChange={debounce((e: any) => {
                      // console.log(e)
                      dispatch({
                        type: 'SET_MESSAGE',
                        payload: e.target.value,
                      })
                    }, 300)}
                    className={cn(
                      errors?.filter((error: any) => error.id === 'message')
                        .length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'message')
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
          <div className="mt-10 lgmt-0 ">
            <h2 className="text-lg font-medium text-gray-900 border-b border-gray-300">
              Additional Instructions (optional)
            </h2>

            <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Anything extra that we can accommodate. Emojis, doodles etc.
                </label>

                <div className="mt-1">
                  <textarea
                    rows={10}
                    name="instructions"
                    id="instructions"
                    defaultValue={state.cart.cardContent.instructions}
                    onChange={debounce((e: any) => {
                      // console.log(e)
                      dispatch({
                        type: 'SET_INSTRUCTIONS',
                        payload: e.target.value,
                      })
                    }, 300)}
                    className={cn(
                      errors?.filter(
                        (error: any) => error.id === 'instructions'
                      ).length > 0
                        ? `border-red-600 pr-10 text-red-600 placeholder-red-600 focus:border-red-600 focus:ring-red-600`
                        : `border-gray-300 focus:border-slate-500 focus:ring-slate-500`,
                      `block w-full rounded-md shadow-sm sm:text-sm`
                    )}
                  />
                  {errors?.filter((error: any) => error.id === 'message')
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
        </form>
      </div>
    </div>
  )
}
