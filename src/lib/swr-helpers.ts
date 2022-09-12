import useSWR from 'swr'
import { getBrand, getBrandColors, getSection, getProduct,getFeaturedProducts } from '@/lib/queries'

export function SwrBrand() {
  let { data } = useSWR('brand', () => getBrand(), {
    revalidateOnReconnect: false,
  })
  return data
}


export function SwrFeaturedProducts(type:any,limit:any) {
  let { data } = useSWR('featuredProducts', () => getFeaturedProducts(type,limit), {
    revalidateOnReconnect: false,
  })

  return data
}

export function SwrSection(queryParams: any) {
  let { data } = useSWR(
    [queryParams.collection, queryParams.id],
    () => getSection(queryParams),
    {
      revalidateOnReconnect: false,
    }
  )
  // console.log('data->', data)
  return data
}

export function SwrGetProduct(slug: string) {
  let { data } = useSWR([slug], () => getProduct(slug), {
    revalidateOnReconnect: false,
  })
  // console.log('data->', data)
  return data
}
