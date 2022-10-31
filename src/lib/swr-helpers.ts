import useSWR from 'swr'
import {
  getBrand,
  getRibbons,
  getSection,
  getWritingStyles,
  getProducts,
  getFeaturedProducts,
  getVoucher,
} from '@/lib/queries'

export function SwrBrand() {
  let { data } = useSWR('brand', () => getBrand(), {
    revalidateOnReconnect: false,
  })
  return data
}


export function SwrVoucher(voucher: any) {
  let { data } = useSWR(['voucher', voucher], () => getVoucher(voucher), {
    revalidateOnReconnect: false,
  })
  return data.length === 1 ? data.data[0] : null
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

export function SwrProducts() {
  let { data } = useSWR('products', () => getProducts(), {
    revalidateOnReconnect: false,
  })
  // console.log('data --', data)
  // add key to manage state of "choose / chosen button"
  if (data) data = data.map((v: any) => ({ ...v, chosen: false }))
  // console.log('data --', data)

  return data
}

export function SwrFeaturedProducts(type: any, limit: any) {
  let { data } = useSWR(
    'featuredProducts',
    () => getFeaturedProducts(type, limit),
    {
      revalidateOnReconnect: false,
    }
  )

  return data
}

export function SwrWritingStyles() {
  let { data } = useSWR('writingStyles', () => getWritingStyles(), {
    revalidateOnReconnect: false,
  })
  // console.log('getWritingStyles->', data)
  return data
}

export function SwrRibbons() {
  let { data } = useSWR('ribbons', () => getRibbons(), {
    revalidateOnReconnect: false,
  })
  // console.log('getWritingStyles->', data)
  return data
}
