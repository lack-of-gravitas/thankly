import React, { FC } from 'react'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'
import parse from 'html-react-parser'
import Image from 'next/future/image'
import { SwrBrand } from '@/lib/swr-helpers'

interface HeroProps {
  className?: string
  data: any
}

const Hero: FC<HeroProps> = ({ data }) => {
  // console.log('hero data --> ', data)
  const brand = SwrBrand()

  return (
    <div className="relative bg-gray-900 animate-fade-in">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {data.image && data.image !== '' ? (
          <Image
            className="object-cover object-center w-full h-full"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${data?.image}`}
            // layout="fill"
            width={1800}
            height={1600}
            alt={data?.name || ''}
            priority
          />
        ) : (
          <>
            <Image
              className="object-cover object-center w-full h-full"
              src="https://tailwindui.com/img/ecommerce-images/home-page-01-hero-full-width.jpg"
              // layout="fill"
              width={1800}
              height={1600}
              alt=""
              priority
            />
          </>
        )}
      </div>

      <div className="relative flex flex-col items-center max-w-3xl px-6 py-32 mx-auto prose text-center sm:py-64 lg:px-0">
        {parse(data.content)}
        {data.buttons?.map(({ id, item, collection }: any) => {
          let coll = ''

          switch (collection) {
            case 'posts':
              coll = 'blog/'
              case 'pages':
              return (
                <Link
                  key={id}
                  href={'/' + coll + item.slug}
                  className="flex items-center text-sm font-medium no-underline text-slate-500"
                >
                  <Button
                    style={{
                      backgroundColor: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#fff',
                    }}
                    className="inline-block px-8 py-3 mt-8 font-medium prose-xl text-white no-underline border rounded-md shadow-md hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                    type="button"
                  >
                    {item.name}
                    <span className="ml-2 no-underline align-middle material-symbols-outlined">
                      arrow_forward
                    </span>
                  </Button>
                </Link>
              )
              break
            case 'customLinks':
              return (
                <a
                  key={id}
                  target="_blank" rel="noopener noreferrer"
                  href={item.slug}
                  className="flex items-center text-sm font-medium no-underline text-slate-500"
                >
                 <Button
                    style={{
                      backgroundColor: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#fff',
                    }}
                    className="inline-block px-8 py-3 mt-8 font-medium prose-xl text-white border rounded-md shadow-md hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                    type="button"
                  >
                    {item.name}
                    <span className="ml-2 align-middle material-symbols-outlined">
                      arrow_forward
                    </span>
                  </Button>
                </a>
              )
            default:
              return (
                <Link
                  key={id}
                  href={'/' + coll + item.slug}
                  className="flex items-center text-sm font-medium no-underline text-slate-500"
                >
                  <Button
                    style={{
                      backgroundColor: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#fff',
                    }}
                    className="inline-block px-8 py-3 mt-8 font-medium prose-xl text-white border rounded-md shadow-md hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                    type="button"
                  >
                    {item.name}
                    <span className="ml-2 align-middle material-symbols-outlined">
                      arrow_forward
                    </span>
                  </Button>
                </Link>
              )
          }
        })}
      </div>
    </div>
  )
}

export default Hero
