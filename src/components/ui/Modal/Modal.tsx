import { SwrBrand } from '@/lib/swr-helpers'
import Icon from '@/components/common/Icon'
import { Fragment, useState } from 'react'
import { useRef } from 'react'
import cn from 'clsx'

import { Dialog, Transition } from '@headlessui/react'
import { FC, ReactNode, Component, Children } from 'react'
import Button from '@/components/ui/Button'

interface ModalProps {
  // children?: React.ReactNode[]
  className?: string
  show?: boolean
  icon?: React.ReactNode
  content?: any
  buttons?: React.ReactNode
  readOnly?: boolean
}

const Modal: FC<ModalProps> = ({
  className,
  show,
  icon,
  content,
  buttons,
  readOnly,
  // ...props
}) => {
  const brand: any = SwrBrand()
  const [open, setOpen] = useState(show ? show : false)
  const cancelButtonRef = useRef(null)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <span className={className + ` `}>
        <Transition.Root show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={() => (readOnly ? null : handleClose)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        {icon ? (
                          icon
                        ) : (
                          <Icon
                            className="text-red-600"
                            aria-hidden="true"
                            name={'warning'}
                          />
                        )}
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {content?.title ? content.title : 'Error'}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {content?.description
                              ? content.description
                              : `We're sorry! An unknown error has occurred. Please contact us for assistance.`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      {buttons ? (
                        buttons
                      ) : readOnly ? (
                        <></>
                      ) : (
                        <Button
                          onClick={() => setOpen(false)}
                          style={{
                            backgroundColor: brand.firstAccentColour
                              ? brand.firstAccentColour
                              : '#fff',
                          }}
                          className={cn(
                            `ml-3 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm `
                          )}
                          type="button"
                        >
                          OK
                        </Button>
                      )}

                      {/* <button
                        type="button"
                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Deactivate
                      </button> */}
                      {/* <button
                        type="button"
                        className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button> */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </span>
    </>
  )
}

export default Modal
