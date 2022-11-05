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
  // console.log('newsletter data --> ', data)
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
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:flex lg:items-center lg:py-16 lg:px-8">
          <div className="lg:w-0 lg:flex-1">
            <article className="max-w-3xl text-base prose prose-img:rounded-md md:pt-5">
              {parse(data.content)}
            </article>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <div id="mc_embed_signup">
              <form
                action={data.url}
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="grid grid-cols-1 mt-6 validate gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                target="_self"
              >
                <div className="mc-field-group">
                  <label
                    htmlFor="mce-FNAME"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="FNAME"
                      id="mce-FNAME"
                      autoComplete="name"
                      placeholder="Enter your name"
                      className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    />

                    <span id="mce-FNAME-HELPERTEXT" className="helper_text" />
                  </div>
                </div>
                <div className="mc-field-group">
                  <label
                    htmlFor="mce-EMAIL"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      defaultValue=""
                      name="EMAIL"
                      className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm required email focus:border-slate-500 focus:ring-slate-500"
                      id="mce-EMAIL"
                      required
                      autoComplete="email"
                      placeholder="Enter your email"
                    />

                    <span id="mce-EMAIL-HELPERTEXT" className="helper_text" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <button
                     style={{
                      backgroundColor: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#fff',
                    }}
                    type="submit"
                    defaultValue="Subscribe"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    {`Let's talk`}
                  </button>

                  <p className="mt-3 text-sm text-gray-500">
                    We care about the protection of your data. Read our{' '}
                    <Link
                      href="/privacy"
                      passHref
                      className="font-medium underline"
                    >
                      Privacy Policy.
                    </Link>
                  </p>

                  <div hidden>
                    <input
                      type="hidden"
                      name="tags"
                      defaultValue="347220,7334468"
                    />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div
                      className="response"
                      id="mce-error-response"
                      style={{ display: 'none' }}
                    />
                    <div
                      className="response"
                      id="mce-success-response"
                      style={{ display: 'none' }}
                    />
                  </div>

                   {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                   <div
                    style={{ position: 'absolute', left: '-5000px' }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_5d9e439add41cade42245512f_acf8317a97"
                      tabIndex={-1}
                      defaultValue=""
                    />
                  </div>
                </div>

              
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Form
