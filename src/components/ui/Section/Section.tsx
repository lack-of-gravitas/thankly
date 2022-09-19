import React, { FC, useState } from 'react'
import dynamic from 'next/dynamic'
import { SwrSection, SwrBrand } from '@/lib/swr-helpers'

import * as Sections from '@/components/ui'
import cn from 'clsx'

interface SectionProps {
  data?: any
  className?: string
  children?: any
}

let sectionData: any

export const Section: FC<SectionProps> = ({ data, className, children }) => {
  const [bannerVisible, setBannerVisible] = useState(true)
  const brand = SwrBrand()

  let queryParams = {
    collection: data.collection,
    id: data.id,
    pages_id: data.pages_id,
  }

  // console.log('queryParams -- ', queryParams)
  console.log('rendering:', data.collection)

  sectionData = SwrSection(queryParams)
  if (!sectionData) return null

  switch (data.collection) {
    case 'hero':
      // console.log(data.collection, `: `, sectionData)
      return <Sections.Hero data={sectionData ? sectionData : null} />
      break
    // case 'slider':
    //   // console.log(data.collection, `: `, sectionData)
    //   return <Sections.Slider data={sectionData ? sectionData : null} />
    //   break

    case 'banner':
      // console.log('rendering:', data.collection)
      // console.log(data.collection,`: `, sectionData)

      return (
        <Sections.Banner
          className={cn(!bannerVisible ? `hidden ` : ``, `pb-2 sm:pb-5`)}
          icon={
            <span
              style={{
                backgroundColor: brand.firstAccentColour
                  ? brand.firstAccentColour
                  : '#fff',
              }}
              className="flex p-2 rounded-md"
            >
              <span
                className="w-6 h-6 text-white material-symbols-outlined"
                aria-hidden="true"
              >
                {sectionData.icon}
              </span>
            </span>
          }
          content={
            <span className="text-sm md:inline">{sectionData.content}</span>
          }
          dismiss={
            <button
              onClick={() => setBannerVisible(false)}
              type="button"
              className={cn(
                `-mr-1 flex rounded-md p-2 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white`
              )}
            >
              <span className="sr-only">Dismiss</span>
              <span
                className="w-6 h-6 material-symbols-outlined text-slate-500"
                aria-hidden="true"
              >
                close
              </span>
            </button>
          }
        />
      )

      break

    case 'pageContent':
      // console.log('rendering:', data.collection)
      return <Sections.Content data={sectionData ? sectionData : null} />
      break
    case 'seenOn':
      return <Sections.SeenOn data={sectionData ? sectionData : null} />
      break

    case 'features':
      // console.log('rendering:', data.collection)
      // console.log(data.collection, `: `, sectionData)
      return <Sections.Features data={sectionData ? sectionData : null} />
      break

    case 'form':
      return <Sections.Form data={sectionData ? sectionData : null} />
      break

    case 'featuredProducts':
      // console.log('query ', data)

      return (
        <Sections.FeaturedProducts data={sectionData ? sectionData : null} />
      )
      break

    //   case 'PostsAll':
    //     return <PostsAll data={sectionData ? sectionData : null} />
    //     break
    //   case 'PostsRecent':
    //     return <PostsRecent data={sectionData ? sectionData : null} />
    //     break

    //   // Products
    //   case 'ProductsAll':
    //     return <ProductsAll data={sectionData ? sectionData : null} />
    //     break
   
    //   case 'Testimonials':
    //     return <ProductsFeatured data={sectionData ? sectionData : null} />
    //     break

    default:
      return <></>
  }

  return <></>
}
export default Section
