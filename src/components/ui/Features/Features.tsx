import React, { FC } from 'react'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'
import parse from 'html-react-parser'
import Image from 'next/future/image'
import { SwrBrand } from '@/lib/swr-helpers'
import cn from 'clsx'

interface FeaturesOnProps {
  className?: string
  data: any
}

const Features: FC<FeaturesOnProps> = ({ data }) => {
  // console.log('Features data --> ', data)

  return (
    <div className="relative bg-white animate-fade-in">
      {data.style === 'imageCover' && (
        <>
          <FeatureImageCover data={data} />
        </>
      )}
      {data.style === 'imageRight' && (
        <>
          <FeatureImageRight data={data} />
        </>
      )}
      {data.style === 'imageLeft' && (
        <>
          <FeatureImageLeft data={data} />
        </>
      )}
      {data.style === 'columns' && (
        <>
          <FeatureColumns data={data} />
        </>
      )}

      {/* <div className="px-4 pt-8 pb-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
      </div> */}
    </div>
  )
}

export default Features

export function FeatureColumns({ data }: any) {
  const brand = SwrBrand()

  console.log('feature data --', data)
  return (
    <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
      {data.content && (
        <div className="flex flex-col items-center text-center">
          <article className="max-w-4xl text-base prose text-slate-700 prose-a:text-blue-600 prose-img:rounded-md md:pt-5">
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
        {data.items?.map(({ item }: any) => {
          return (
            <div>
              <div className="w-full overflow-hidden rounded-md aspect-w-3 aspect-h-2">
                {item.image && item.image !== '' ? (
                  <Image
                    className="object-cover object-center w-full h-full"
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${item.image}`}
                    // layout="fill"
                    width={800}
                    height={600}
                    // alt={data?.name || ''}
                    priority
                  />
                ) : (
                  <>
                    <Image
                      className="object-cover object-center w-full h-full"
                      src="https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg"
                      // layout="fill"
                      width={800}
                      height={600}
                      alt=""
                      priority
                    />
                  </>
                )}
              </div>
              {item.content && (
                <article className="max-w-4xl pt-12 text-base prose text-slate-700 prose-a:text-blue-600 prose-img:rounded-md md:pt-5">
                  {parse(item.content)}
                </article>
              )}
            </div>
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
              href={
                ((item.slug === 'home' || item.slug === '') && '/') ||
                (collection === 'CustomLinks'
                  ? item.slug
                  : '/' + coll + item.slug)
              }
            >
              <Button
                key={id}
                style={{
                  backgroundColor: brand.firstAccentColour
                    ? brand.firstAccentColour
                    : '#fff',
                }}
                className="inline-block px-8 py-3 mt-8 font-medium prose-xl text-white border rounded-md border-slate-100 hover:border-slate-500 hover:bg-gray-100 hover:text-slate-500"
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
  )
}

export function FeatureImageCover({ data }: any) {
  return (
    <div className="relative px-6 py-16 bg-gray-800 sm:py-16 sm:px-12 lg:px-16">
      <div className="absolute inset-0 overflow-hidden">
        {data.items[0].item.image && data.items[0].item.image !== '' ? (
          <Image
            className="object-cover object-center w-full h-full"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${data.items[0].item.image}`}
            // layout="fill"
            width={1600}
            height={600}
            // alt={data?.name || ''}
          />
        ) : (
          <>
            <Image
              className="object-cover object-center w-full h-full"
              src="https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg"
              // layout="fill"
              width={1600}
              height={600}
              alt=""
            />
          </>
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
      />
      <div className="relative flex flex-col items-center max-w-3xl mx-auto text-center text-white">
        {data.content && (
          <div className="flex flex-col items-center text-center text-white">
            <article className="max-w-4xl text-base prose prose-headings:text-white prose-img:rounded-md md:pt-5">
              {parse(data.content)}
            </article>
          </div>
        )}
      </div>
    </div>
  )
}

export function FeatureImageRight({ data }: any) {
  return (
    <>
      <div className="grid items-center max-w-2xl grid-cols-1 px-4 py-24 mx-auto gap-y-16 gap-x-8 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        {data.items[0].item.content && (
          <div className="flex flex-col items-center ">
            <article className="max-w-4xl text-base prose prose-img:rounded-md md:pt-5">
              {parse(data.items[0].item.content)}
            </article>
          </div>
        )}

        <div className="grid grid-cols-1 grid-rows-1 gap-4 sm:gap-6 lg:gap-8">
          {data.items[0].item.image && data.items[0].item.image !== '' ? (
            <Image
              className="object-cover object-center w-full h-full rounded-md"
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${data.items[0].item.image}`}
              // layout="fill"
              width={800}
              height={600}
              // alt={data?.name || ''}
            />
          ) : (
            <>
              <Image
                className="object-cover object-center w-full h-full"
                src="https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg"
                // layout="fill"
                width={800}
                height={600}
                alt=""
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export function FeatureImageLeft({ data }: any) {
  return (
    <section aria-labelledby="features-heading" className="relative">
      <div className="overflow-hidden aspect-w-3 aspect-h-2 sm:aspect-w-5 lg:aspect-none lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-16">
        {data.items[0].item.image && data.items[0].item.image !== '' ? (
          <Image
            className="object-cover object-center w-full h-full rounded-md"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${data.items[0].item.image}`}
            // layout="fill"
            width={800}
            height={600}
            // alt={data?.name || ''}
          />
        ) : (
          <>
            <Image
              className="object-cover object-center w-full h-full"
              src="https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg"
              // layout="fill"
              width={800}
              height={600}
              alt=""
            />
          </>
        )}

        {/* <img
          src="https://tailwindui.com/img/ecommerce-images/confirmation-page-01-hero.jpg"
          alt="Black leather journal with silver steel disc binding resting on wooden shelf with machined steel pen."
          className="object-cover object-center w-full h-full lg:h-full lg:w-full"
        /> */}
      </div>

      <div className="max-w-2xl px-4 pt-16 pb-24 mx-auto sm:px-6 sm:pb-32 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-32">
        <div className="lg:col-start-2">
          {data.items[0].item.content && (
            <div className="flex flex-col items-center">
              <article className="max-w-4xl text-base prose prose-img:rounded-md md:pt-5">
                {parse(data.items[0].item.content)}
              </article>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
