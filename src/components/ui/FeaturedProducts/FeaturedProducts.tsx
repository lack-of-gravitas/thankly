import React, { FC } from 'react'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'
import parse from 'html-react-parser'
import Image from 'next/future/image'
import { SwrBrand, SwrFeaturedProducts } from '@/lib/swr-helpers'
import cn from 'clsx'

interface FeaturedProductsProps {
  className?: string
  data: any
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ data }) => {
  const brand = SwrBrand()
  console.log('featured products data --> ', data)

  return (
    <>
     <div className="bg-white">
      
    </div>
    
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
              <article className="max-w-4xl text-base prose text-slate-700 prose-a:text-blue-600 prose-img:rounded-xs md:pt-5">
                {parse(data.content)}
              </article>
            </div>
          )}

<div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        
        <div className="grid grid-cols-1 mt-6 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <div className="overflow-hidden bg-gray-100 rounded-xs aspect-w-4 aspect-h-3">
                <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" />
                <div className="flex items-end p-4 opacity-0 group-hover:opacity-100" aria-hidden="true">
                  <div className="w-full px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white bg-opacity-75 rounded-xs backdrop-blur backdrop-filter">
                    View Product
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 space-x-8 text-base font-medium text-gray-900">
                <h3>
                  <a href="#">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <p>{product.price}</p>
              </div>
              {/* <p className="mt-1 text-sm text-gray-500">{product.category}</p> */}
            </div>
          ))}
        </div>
      </div>
      
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
                    className="relative flex flex-col overflow-hidden bg-white border border-gray-200 shadow-xs rounded-xs group"
                  >
                    <div className="bg-gray-200 aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none sm:h-96 ">
                      {product.mainImage && product.mainImage !== '' ? (
                        <Image
                          className="object-cover object-center w-full h-full sm:h-full sm:w-full"
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${product.mainImage}`}
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
                      <h3 className="font-bold text-gray-900 text-md">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                      <div className="flex flex-col justify-end flex-1">
                        {/* <p className="text-sm italic text-gray-500">{product.options}</p> */}
                        <p className="text-base font-medium text-gray-900">
                          {product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )
            })}
          </div>
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
                    className="inline-block px-8 py-3 mt-8 font-medium prose-xl text-white border shadow-md rounded-xs hover:border-slate-300 hover:bg-gray-100 hover:text-slate-500"
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


const products = [
  {
    id: 1,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-related-product-01.jpg',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  // More products...
]
