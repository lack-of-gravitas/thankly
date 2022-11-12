import { SWRConfig } from 'swr'
import { SwrBrand } from '@/lib/swr-helpers'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState, useEffect, useRef, useContext } from 'react'
import Image from 'next/future/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cn from 'clsx'
const Icon = dynamic(() => import('@/components/common/Icon'))
import debounce from 'lodash/debounce'
interface NotificationProps {
  // children?: React.ReactNode[]
  className?: string
  show?: boolean
  icon?: React.ReactNode
  content?: any
  errors?:any
  buttons?: React.ReactNode
  readOnly?: boolean
}

export default function Notification({
  className = '',
  show,
  icon,
  content,
  errors,
  ...props
}: any) {
  const brand: any = SwrBrand()
  const cancelButtonRef = useRef(null)
  const [open, setOpen] = useState(show ? show : false)

  return (
    <>
      <span className={className + ` `}>
        <div
          aria-live="assertive"
          className={cn(`fixed inset-0 z-10 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6`,open ? `bg-gray-500 bg-opacity-75 transition-opacity`:``)} >
          <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
            <Transition
              show={open}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="w-full max-w-sm overflow-hidden border rounded-lg shadow-xl pointer-events-auto bg-slate-50 border-slate-400 ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                
                  <div className="flex items-start">
                  {/* <p className="text-sm font-bold text-red-600">
                        Errors with your Order
                      </p> */}
                    <div className="flex-shrink-0">
                      {icon ? (
                        icon
                      ) : (
                       null
                      )}
                    </div>

                    {errors ? (
                      errors
                    ) : (
                      null
                    )}

{/* 
                    {content ? (
                      content
                    ) : (
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          {`${content?.title ?? ''}`}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {`${content?.message ?? ''}`}
                        </p>
                      </div>
                    )} */}
                    <div className="flex flex-shrink-0 ml-4">
                      <button
                        type="button"
                        className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          setOpen(false)

                        }}
                      >
                        <span className="sr-only">Close</span>
                        <Icon
                          name="close"
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </span>
    </>
  )
}
