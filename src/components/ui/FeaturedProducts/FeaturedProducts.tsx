import React, { FC } from 'react'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'
import parse from 'html-react-parser'
import Image from 'next/future/image'
import { SwrBrand } from '@/lib/swr-helpers'
import cn from 'clsx'

interface FeaturedProductsProps {
  className?: string
  data: any
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ data }) => {
  const brand = SwrBrand()
  // console.log('featured products data --> ', data)

  return (
    <>
      <div

      // style={{
      //   backgroundColor: brand.backgroundColour
      //     ? brand.backgroundColour
      //     : '#fff',
      // }}
      >
        <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
          {data.content && (
            <div className="flex flex-col items-center text-center">
              <article className="max-w-4xl text-base prose prose-img:rounded-md text-slate-700 prose-a:text-blue-600 md:pt-5">
                {parse(data.content)}
              </article>
            </div>
          )}

          

          <div
            className={cn(
              data.columns ? `lg:grid-cols-` + data.columns : `lg:grid-cols-3`,
              ` mt-16 grid grid-cols-1 gap-y-16 lg:gap-x-8`
            )}
          >
            {data.products?.map((product: any) => {
              return (
                <>
                  <div
                    key={product.id}
                    className="relative flex flex-col overflow-hidden bg-white rounded-md group"
                  >
                    <div className="bg-gray-200 aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none sm:h-96">
                      {product.images && product.images[0]?.directus_files_id !== '' ? (
                        <Image
                          className="object-cover object-center w-full h-full sm:h-full sm:w-full"
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${product.images[0].directus_files_id}`}
                          // layout="fill"
                          width={1000}
                          height={900}
                          // alt={data?.name || ''}
                        />
                      ) : (
                        <>
                          <Image
                            className="object-cover object-center w-full h-full sm:h-full sm:w-full"
                            src="https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
                            // layout="fill"
                            width={1000}
                            height={900}
                            alt=""
                          />
                        </>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-4 space-y-2">
                      <div className="flex items-center justify-between mt-2 space-x-8 text-base font-medium text-gray-900">
                        <h3>
                          <a href="#">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.name}
                          </a>
                        </h3>
                        <p>{product.price}</p>
                      </div>

                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-2">
                      <a
                        style={{
                          backgroundColor: brand.firstAccentColour
                            ? brand.firstAccentColour
                            : '#fff',
                        }}
                        href={product.href}
                        className="relative flex items-center justify-center px-8 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:bg-gray-200 hover:text-slate-600"
                      >
                        Send
                        <span className="sr-only">, {product.name}</span>
                      </a>
                    </div>
                  </div>
                </>
              )
            })}
          </div>

          {/* Button */}
          <div className="flex flex-col items-center pt-5 text-center justify-middle">
            {data.buttons?.map(({ id, item, collection }: any) => {
              let coll = ''

              switch (collection) {
                case 'posts':
                  coll = 'blog/'
                  break
                // case 'products':
                //   coll = item.type + 's/'
                //   break
              }

              return (
                <Link
                  key={id}
                  href={
                    ((item.slug === 'home' || item.slug === '') && '/') ||
                    (collection === 'CustomLinks'
                      ? item.slug
                      : '/' + coll + item.slug)
                  }
                >
                  <Button
                    style={{
                      backgroundColor: brand.firstAccentColour
                        ? brand.firstAccentColour
                        : '#fff',
                    }}
                    className="inline-block px-8 py-3 mt-8 font-medium prose-xl text-white border rounded-md shadow-md hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
                    type="button"
                    // item={item}
                    // collection={collection}
                  >
                    {item.name}
                    <span className="ml-2 align-middle material-symbols-outlined">
                      arrow_forward
                    </span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default FeaturedProducts
