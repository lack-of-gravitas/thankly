import React, { FC } from 'react'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'
import parse from 'html-react-parser'
import Image from 'next/future/image'
import { SwrBrand } from '@/lib/swr-helpers'

interface FormProps {
  className?: string
  data: any
}

const Form: FC<FormProps> = ({ data }) => {
  // console.log('seenon data --> ', data)
  const brand = SwrBrand()

  return (
    <>
      <div 
      style={{
        backgroundColor: brand.backgroundColour
          ? brand.backgroundColour
          : '#fff',
      }}
      >
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:flex lg:items-center lg:py-32 lg:px-8">
          <div className="lg:w-0 lg:flex-1">
          <article className="max-w-3xl text-base prose prose-img:rounded-md md:pt-5">
              {parse(data.content)}
            </article>

            {/* <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sign up for our newsletter
            </h2>
            <p className="max-w-3xl mt-3 text-lg text-gray-500">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
              fugiat.
            </p> */}
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:max-w-xs"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">

                
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Notify me
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-gray-500">
              We care about the protection of your data. Read our{' '}
              <Link href="/privacy" passHref className="font-medium underline">
                <a>Privacy Policy.</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Form
