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
    revalidateOnReconnect: true,
  })
  return data
}

export function SwrVoucher(voucher: any) {
  let { data } = useSWR(['voucher', voucher], () => getVoucher(voucher), {
    revalidateOnReconnect: true,
  })
  return data.length === 1 ? data.data[0] : null
}

export function SwrSection(queryParams: any) {
  let { data } = useSWR(
    [queryParams.collection, queryParams.id],
    () => getSection(queryParams),
    {
      revalidateOnReconnect: true,
    }
  )
  // console.log('data->', data)
  return data
}

export function SwrProducts() {
  let { data } = useSWR('products', () => getProducts('card,gift'), {
    revalidateOnReconnect: true,
    refreshInterval: 120000,
  })
  // console.log('data --', data)
  // add key to manage state of "choose / chosen button"
  if (data) data = data.map((v: any) => ({ ...v, chosen: false }))
  // console.log('data --', data)

  return data
}


export function SwrCards() {
  let { data } = useSWR('cards', () => getProducts('card'), {
    revalidateOnReconnect: true,
    refreshInterval: 120000,
  })
  // console.log('data --', data)
  // add key to manage state of "choose / chosen button"
  if (data) data = data.map((v: any) => ({ ...v, chosen: false }))
  // console.log('data --', data)

  return data
}


export function SwrGifts() {
  let { data } = useSWR('gifts', () => getProducts('gift'), {
    revalidateOnReconnect: true,
    refreshInterval: 120000,
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
      revalidateOnReconnect: true,
    }
  )

  return data
}

export function SwrWritingStyles() {
  let { data } = useSWR('writingStyles', () => getWritingStyles(), {
    revalidateOnReconnect: true,
  })
  // console.log('getWritingStyles->', data)
  return data
}

export function SwrRibbons() {
  let { data } = useSWR('ribbons', () => getRibbons(), {
    revalidateOnReconnect: true,
  })
  // console.log('getWritingStyles->', data)
  return data
}
