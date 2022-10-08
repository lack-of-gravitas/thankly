import cn from 'clsx'

import { mergeRefs } from 'react-merge-refs'
import { SwrBrand } from '@/lib/swr-helpers'
import dynamic from 'next/dynamic'
const Icon = dynamic(() => import('@/components/common/Icon'))
const Step1 = dynamic(() => import('@/components/ui/Send/Step1'))
const Step2 = dynamic(() => import('@/components/ui/Send/Step2'))
const Step3 = dynamic(() => import('@/components/ui/Send/Step3'))

interface ProgressProps {
  // children?: React.ReactNode[]
  className?: string
  currentStep?: number
  data?: any
}

// eslint-disable-next-line react/display-name
const Progress: React.FC<ProgressProps> = ({
  // children,
  className,
  currentStep,
}) => {
  const brand = SwrBrand()

  return (
    <>
      <nav aria-label="Progress">
        <ol
          role="list"
          className="border border-gray-300 divide-y divide-gray-300 rounded-md md:flex md:divide-y-0"
        >
          {steps.map((step: any, stepIdx: any) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {stepIdx < (currentStep ? currentStep : 1) - 1 ? (
                <div className="flex items-center w-full group">
                  <span className="flex items-center px-4 py-2 text-sm font-medium md:text-md">
                    <span
                      style={{
                        backgroundColor: brand.secondAccentColour
                          ? brand.secondAccentColour
                          : '#fff',
                      }}
                      className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full "
                    >
                      <Icon className="text-white" name={`check`} />
                    </span>
                    <span className="mt-0.5 ml-2 flex min-w-0 flex-col">
                      <span
                        //  style={{
                        //   color: brand.firstAccentColour
                        //     ? brand.firstAccentColour
                        //     : '#2e2e2e',
                        // }}
                        className="ml-2 text-sm md:text-md text-slate-600"
                      >
                        {step.name}
                      </span>
                      <span className="hidden ml-2 text-sm font-medium leading-tight text-gray-500 md:block">
                        {step.description}
                      </span>
                    </span>
                  </span>
                </div>
              ) : stepIdx === (currentStep ? currentStep : 1) - 1 ? (
                <div
                  className="flex items-center px-4 py-2 text-sm font-medium md:text-md"
                  aria-current="step"
                >
                  <span
                    style={{
                      border: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#2e2e2e',
                    }}
                    className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-2xl rounded-full"
                  >
                    <span
                      style={{
                        color: brand.firstAccentColour
                          ? brand.firstAccentColour
                          : '#2e2e2e',
                      }}
                      className="font-semibold "
                    >
                      {step.id}
                    </span>
                  </span>
                  <span className=" mt-0.5 ml-2 flex min-w-0 flex-col">
                    <span
                      style={{
                        color: brand.firstAccentColour
                          ? brand.firstAccentColour
                          : '#2e2e2e',
                      }}
                      className="ml-2 text-sm font-semibold md:text-md "
                    >
                      {step.name}
                    </span>
                    <span className="hidden ml-2 text-sm font-medium leading-tight text-gray-500 md:block">
                      {step.description}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center group ">
                  <span className="flex items-center px-4 py-2 text-sm font-medium">
                    <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">
                        {step.id}
                      </span>
                    </span>
                    <span className="mt-0.5 ml-2 flex min-w-0 flex-col">
                      <span className="ml-2 text-sm font-semibold text-gray-500 md:text-md group-hover:text-gray-900">
                        {step.name}
                      </span>
                      <span className="hidden ml-2 text-sm font-medium leading-tight text-gray-500 md:block">
                        {step.description}
                      </span>
                    </span>
                  </span>
                </div>
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

      {currentStep === 1 && <Step1  />}
      {currentStep === 2 && <Step2  />}
      {currentStep === 3 && <Step3 />}
    </>
  )
}

export default Progress

const steps = [
  {
    id: '01',
    name: 'Choose',
    description:
      'Choose a gift to create a Thankly or just send a thoughtfully designed card.',
    href: '#',
  },
  {
    id: '02',
    name: 'Personalise',
    description:
      'Personalise your Thankly with a handwritten message and extra options.',
    href: '#',
  },
  {
    id: '03',
    name: 'Send',
    description:
      'Add recipient details, confirm, pay and send your Thankly and our team will do the rest.',
    href: '#',
  },
]
