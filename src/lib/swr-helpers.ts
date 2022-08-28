import useSWR from 'swr'
import { getBrand, getBrandColors, getSection, getProduct } from '@/lib/queries'

export function SwrBrand() {
  let { data } = useSWR('brand', () => getBrand(), {
    revalidateOnReconnect: false,
  })
  // console.log('swr brand -- ', data)
  // const { data: brandColors } = useSWR('brandColors', () => getBrandColors(), {
  //   revalidateOnReconnect: false,
  // })

  // if (brand && brandColors) {
  //   brand = { ...brand.data[0], ...brandColors.data[0] }
  //   // console.log('brand->', brand)
  //   // console.log('brandColors->', brandColors)
  // }
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
