import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getProducts } from '@/lib/queries'
import cn from 'clsx'
import { useState, useRef } from 'react'
import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'


const Layout = dynamic(() => import('@/components/common/Layout'))
const Icon = dynamic(() => import('@/components/common/Icon'))
const Button = dynamic(() => import('@/components/ui/Button'))
const Progress = dynamic(() => import('@/components/ui/Send/Progress'))

export default function Send({ slug, preview, prefetchedData }: any) {
  // console.log('prefetchedData->', prefetchedData)
  const brand = SwrBrand()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)

  //   if (!prefetchedData) {
  //     router.push('/404')
  //   }

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
                  className={cn(`inline-flex items-center px-4 py-2 ml-3 text-sm font-medium border border-transparent rounded-md shadow-sm   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`,currentStep===1 ? `bg-slate-100 border-gray-300 text-slate-300 ` :`hover:bg-slate-500 hover:text-white text-slate-500 `)}
                  onClick={() =>
                    currentStep === 1
                      ? setCurrentStep(currentStep)
                      : setCurrentStep(currentStep - 1)
                  }
                >
                  Back
                </Button>
                <Button
                onClick={() =>
                  currentStep === 3
                    ? setCurrentStep(currentStep)
                    : setCurrentStep(currentStep + 1)
                }
                  style={{
                    backgroundColor: brand.firstAccentColour
                      ? brand.firstAccentColour
                      : '#fff',
                  }}
                  className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  type="button"
                >
                  Next Step
                </Button>
              </div>
            </div>
            
            <Progress currentStep={currentStep} data={prefetchedData}/>

            {/* <Progress currentStep={currentStep} /> */}
          </div>
        </section>

       
      </div>
    </>
  )
}

Send.Layout = Layout

// export async function getServerSideProps(context:any) {

//   const data = await getProducts()
// console.log(data)

//   return {
//     props: {
//       preview: context.preview ? true : null,
//       prefetchedData: data && data.data.length > 0 ? data.data : null,
//     }, // will be passed to the page component as props
    
//   }

// }