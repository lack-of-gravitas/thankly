import dynamic from 'next/dynamic'
import { SwrBrand } from '@/lib/swr-helpers'
import { SwrSection } from '@/lib/swr-helpers'

let sectionData: any

export const Section = ({ section }: any) => {
  console.log('rendering:', section)
  const brand: any = SwrBrand()
  // console.log('brand ->', brand)
  let colors = {
    primaryColor: brand.primaryColor,
    accentColor: brand.accentColor,
  }
  let queryParams = {
    collection: section.collection,
    id: section.id,
    pages_id: section.pages_id,
  }
  // console.log('queryParams:', queryParams)
  sectionData = SwrSection(queryParams)
  // console.log('sectionData:', sectionData)

  switch (section.collection) {
    default:
      return 
  }
}

export { default as Hero } from './Hero'
export { default as Logo } from './Logo'
export { default as Button } from './Button'
export { default as Sidebar } from './Sidebar'
export { default as Marquee } from './Marquee'
export { default as Container } from './Container'
export { default as LoadingDots } from './Loading'
export { default as Skeleton } from './Skeleton'
export { default as Text } from './Text'
export { default as Input } from './Input'
export { default as Quantity } from './Quantity'
