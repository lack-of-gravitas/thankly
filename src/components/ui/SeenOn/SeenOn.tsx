import React, { FC } from 'react'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'
import parse from 'html-react-parser'
import Image from 'next/future/image'
import { SwrBrand } from '@/lib/swr-helpers'

interface SeenOnProps {
  className?: string
  data: any
}

const SeenOn: FC<SeenOnProps> = ({ data }) => {
  // console.log('seenon data --> ', data)
  const brand = SwrBrand()

  return (
    <div className="relative bg-white animate-fade-in">
      <div className="px-4 pt-8 pb-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-6">
          {data?.images?.map(({ directus_files_id: image, sort }: any) => {
            return (
              <div
                key={sort}
                className="flex justify-center col-span-1 md:col-span-2 lg:col-span-1"
              >
                {image && image !== '' ? (
                  <Image
                    className="h-12"
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${image}`}
                    // layout="fill"
                    width={100}
                    height={50}
                    // alt={data?.name || ''}
                    priority
                  />
                ) : (
                  <>
                    <Image
                      className="h-12"
                      src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
                      // layout="fill"
                      width={100}
                      height={50}
                      alt=""
                      priority
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SeenOn
