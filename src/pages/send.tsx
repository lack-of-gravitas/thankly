import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getProducts } from '@/lib/queries'
import cn from 'clsx'
import { useState, useRef } from 'react'
import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Store } from '@/lib/Store'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Icon = dynamic(() => import('@/components/common/Icon'))
const Button = dynamic(() => import('@/components/ui/Button'))
const Progress = dynamic(() => import('@/components/ui/Send/Progress'))
const Modal = dynamic(() => import('@/components/ui/Modal'))

export default function Send({ slug, preview, prefetchedData }: any) {
  // console.log('prefetchedData->', prefetchedData)
  const brand = SwrBrand()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [modal, setModal] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState({})

  const { state, dispatch } = useContext(Store)
  console.log('current cart', state.cart)

  const handleNextStep = () => {
    switch (currentStep) {
      case 1:
        // console.log('currentStep // ', currentStep)
        // check if at least card is selected
        const existCard = state.cart.items.find((x: any) => x.type === 'card')
        if (existCard) {
          // console.log('card picked')
          setCurrentStep(currentStep + 1)
        }

        if (!existCard) {
          // console.log('card not picked')
          setShowError(true)
          setErrorMessage({
            title: 'Card not selected',
            description:
              'You need to select at least one Card to send as your Thankly. Please select from one of our cards and click Next Step.',
          })
          setCurrentStep(currentStep)
        }

        break
      case 2:
        if (state.cart.cardContent.message != '') {
          setCurrentStep(currentStep + 1)
        }

        if (state.cart.cardContent.message === '') {
          setErrorMessage({
            title: 'Message not provided',
            description:
              'You need to provide a message to put on the card select at least one Card to send as your Thankly. Please write a message to your recipient and click Next Step.',
          })
          setShowError(true)
          setCurrentStep(currentStep)
        }

        break
      case 3:
        break
    }
  }

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
                {/* <p className="mt-2 mb-5 text-base text-gray-500">
                  Express your gratitude by sending a thoughtful gift that
                  really hits that soft spot.
                </p> */}
              </div>
              <div className="flex mt-4 md:mt-0 md:ml-4">
                {/* remember to clear cart / order if created */}
                <Link href={'/'}>
                  <Button
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'CLEAR_CART' })
                    }}  
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  style={{
                    backgroundColor: brand.secondAccentColour
                      ? brand.secondAccentColour
                      : '#fff',
                  }}
                  disabled={currentStep === 1}
                  className={cn(
                    `ml-3 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`,
                    currentStep === 1
                      ? `border-gray-300 bg-slate-100 text-slate-300 `
                      : `text-slate-500 hover:bg-slate-500 hover:text-white `
                  )}
                  onClick={() =>
                    currentStep === 1
                      ? setCurrentStep(currentStep)
                      : setCurrentStep(currentStep - 1)
                  }
                >
                  Back
                </Button>
                <Button
                  disabled={currentStep === 3}
                  onClick={handleNextStep}
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className={cn(
                    `ml-3 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`,
                    currentStep === 3
                      ? `border-gray-300 bg-slate-100 text-slate-300 `
                      : `text-white hover:bg-slate-500 hover:text-white `
                  )}
                  type="button"
                >
                  Next Step
                </Button>
              </div>
            </div>

            <Progress currentStep={currentStep} data={prefetchedData} />
            <Modal
              show={showError}
              icon={
                <Icon
                  className="text-red-600"
                  aria-hidden="true"
                  name="warning"
                />
              }
              content={errorMessage}
              buttons={
                <>
                  <Button
                    onClick={() => setShowError(false)}
                    style={{
                      backgroundColor: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#fff',
                    }}
                    className={cn(
                      `ml-3 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`,
                      currentStep === 3
                        ? `border-gray-300 bg-slate-100 text-slate-300 `
                        : `text-white hover:bg-slate-500 hover:text-white `
                    )}
                    type="button"
                  >
                    OK
                  </Button>
                </>
              }
            />
          </div>
        </section>
      </div>
    </>
  )
}

Send.Layout = Layout
