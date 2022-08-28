import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { SwrBrand } from '@/lib/swr-helpers'
import { SwrSection } from '@/lib/swr-helpers'
import * as Sections from '@/components/ui'

interface SectionProps {
  data?: any
  className?: string
  children?: any
}

let sectionData: any

export const Section: FC<SectionProps> = ({ data, className, children }) => {
  console.log('rendering:', data)
  let queryParams = {
    collection: data.collection,
    id: data.id,
    pages_id: data.pages_id,
  }

  sectionData = SwrSection(queryParams)
  console.log('sectionData -- ', sectionData)
  // switch (section.collection) {
  //   case 'Hero':
  //     return <Sections.Hero data={sectionData ? sectionData : null} />
  //     break
  //   case 'Slider':
  //     return <Sections.Slider data={sectionData ? sectionData : null} />
  //     break
  //   case 'Features':
  //     return <FeatureMajor data={sectionData ? sectionData : null} />
  //     break

  //   case 'Banner':
  //     return <ProductsFeatured data={sectionData ? sectionData : null} />
  //     break

  //   case 'BasicContent':
  //     return <Sections.BasicContent data={sectionData ? sectionData : null} />
  //     break
  //   case 'CallToAction':
  //     return <Sections.CallToAction data={sectionData ? sectionData : null} />
  //     break

  //   case 'FeaturedProducts':
  //     return <ProductsFeatured data={sectionData ? sectionData : null} />
  //     break

  //   case 'Form':
  //     return <ProductsFeatured data={sectionData ? sectionData : null} />
  //     break

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
  //   case 'SeenOn':
  //     return <ProductsFeatured data={sectionData ? sectionData : null} />
  //     break
  //   case 'Testimonials':
  //     return <ProductsFeatured data={sectionData ? sectionData : null} />
  //     break

  //   default:
  //     return <></>
  // }

  return <></>
}
export default Section
