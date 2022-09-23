import cn from 'clsx'
import Fuse from 'fuse.js'
import { useState } from 'react'

import { mergeRefs } from 'react-merge-refs'
import { SwrBrand } from '@/lib/swr-helpers'
import dynamic from 'next/dynamic'
import { RadioGroup } from '@headlessui/react'

const Icon = dynamic(() => import('@/components/common/Icon'))

interface Step2Props {
  // children?: React.ReactNode[]
  className?: string
  data?: any
}

// eslint-disable-next-line react/display-name
const Step2: React.FC<Step2Props> = ({ className, data }) => {
    const [selectedWritingStyle, setSelectedWritingStyle] = useState(
        writingStyles[0]
      )
    
      return (
        <div className="">
          <div className="max-w-2xl pt-16 pb-24 mx-auto lg:max-w-7xl ">
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
                        rows={10}
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
                                ) : // <CheckCircleIcon className="w-5 h-5 text-indigo-600" aria-hidden="true" />
    
                                null}
                                <img
                                  className="h-auto mx-3 my-3 rounded-md w-15 lg:w-25 lg:h-auto"
                                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/56c20eda-f59b-4f26-a310-76aff1f094d0`}
                                  alt=""
                                />
    
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
              </div>
            </form>
          </div>
        </div>
      )
}

export default Step2


const writingStyles = [
    {
      id: 1,
      title: 'Natural Print',
      description: 'Handwritten messge with naturally printed letters.',
    },
    {
      id: 2,
      title: 'Cursive Italics',
      description: 'Handwritten messge with cursive, italicized letters.',
    },
    {
      id: 2,
      title: 'Full Caps',
      description: 'Handwritten messge with all letters capitalised.',
    },
  ]
  