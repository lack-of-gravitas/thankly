import { stripe } from './stripe'

// brand
export async function getBrand() {
  let brand = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/brands?fields=` +
        `*,banner.*,header.*,header.item.id,header.item.name,header.item.slug,seo.*,footer.*,footer.item.*,footer.item.links.*,footer.item.links.item.slug,footer.item.links.item.name` +
        `&filter[domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}`
    )
  ).json()
  brand = brand.data[0]

  let shippingRates = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/products?fields=*&filter[status][_eq]=true&filter[type][_eq]=shipping` +
        `&filter[live][_eq]=${
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
            ? false
            : true
        }`
    )
  ).json()
  shippingRates = shippingRates.data

  brand.shippingRates = shippingRates
  // console.log('brand query--', brand)

  return brand
}

export async function getOrder(order: any) {
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/orders?fields=*,items.*&filter[id][_eq]=${order}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.DIRECTUS}`,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      }
    )
  ).json()

  data.data?.length > 0 ? (data = data.data[0]) : data
  // console.log('order query--', data)

  return data
}

export async function getVoucher(voucher: any) {
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/vouchers?fields=*` +
        `&filter[code][_eq]=${voucher}` +
        `&filter[status][_eq]=published`
    )
  ).json()
  data = data.data
  // console.log('voucher query--', data)

  return data
}

export async function updateVoucher(cart: any) {
  let voucher = cart.options.voucher
  let used = cart.totals.voucher * 1
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_REST_API}/vouchers/${voucher.id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS}`,
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        used: voucher.used * 1 + used * 1,
      }),
    }
  )

  return data
}

export async function upsertCustomer(voucher: any) {
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/vouchers?fields=*` +
        `&filter[code][_eq]=${voucher}` +
        `&filter[status][_eq]=published`
    )
  ).json()
  data = data.data
  // console.log('voucher query--', data)

  return data
}

// colors
export const getBrandColors = async () =>
  await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/brands` +
        `?fields=primaryColor,accentColor` +
        `&filter[domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}`
    )
  ).json()

// core
export async function getPage(path: any) {
  // console.log('getPage->', path)

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/pages` +
        `?fields=id,slug,name,` + // key fields
        `sections.*` + // sections fields
        `&filter[brand][domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}` +
        `&filter[slug][_eq]=${path}`
    )
  ).json()

  // get sections for the page
}

export async function getPurchases() {
  return ''
}

export async function getPost(path: any) {
  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/posts` +
        `?fields=slug,name,image,description,content,status,date_created` +
        `&filter[slug][_eq]=${path}`
    )
  ).json()
}

export async function getSection(params: any) {
  let section: any = {}
  let posts: any
  let products: any

  switch (params.collection) {
    case 'pageContent':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.id,item.content,item.name` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      // console.log('section --', section)
      return section.data[0].item
      break

    case 'banner':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.name,item.icon,item.content` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'hero':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*, item.buttons.*,item.buttons.item.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'slider':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*,item.slides.*,item.slides.item.*,item.slides.item.buttons.*,item.slides.item.buttons.item.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'features':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*,item.buttons.*,item.buttons.item.*,item.items.*,item.items.item.*,item.items.item.buttons.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'seenOn':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*,item.images.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'form':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'featuredProducts':
      // console.log('params ', params)
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*,item.buttons.*,item.buttons.item.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item

      products = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/products` +
            `?fields=*,images.directus_files_id` +
            `&filter[featured][_eq]=true` +
            `&filter[status][_eq]=true` +
            `&filter[live][_eq]=${
              process.env.NODE_ENV === 'development' ||
              process.env.NODE_ENV === 'test'
                ? false
                : true
            }` +
            `&filter[stockQty][_gt]=0` +
            `&filter[type][_in]=${
              section.type ? section.type.toString() : `card,gift`
            }` +
            `&sort=-date_created` +
            `&limit=${section.limit ? section.limit : 3}`
        )
      ).json()

      section.products = products.data

      return section
      break

    case 'PostsRecent':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=item.id,item.text,item.section_name,item.limit` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item

      posts = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/posts` +
            `?fields=id,slug,name,description,date_created,image` +
            `&filter[brands][brands_id][domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}` +
            `&filter[status][_eq]=published` +
            `&sort[]=-date_created&limit=${section.limit ? section.limit : 3}`
        )
      ).json()
      section.posts = posts.data
      return section
      break
    case 'ProductsAll':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=item.id,item.text,item.section_name,item.filter,item.pagination` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item

      return section

    case 'PostsAll':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=item.id,item.text,item.section_name,item.limit` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item

      posts = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/posts` +
            `?fields=id,slug,name,description,date_created,image` +
            `&filter[brands][brands_id][domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}` +
            `&filter[status][_eq]=published` +
            `&sort[]=-date_created`
        )
      ).json()
      section.posts = posts.data
      return section
      break
  }
}

export async function getProducts(type: string) {
  // console.log('query', path)
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/products` +
        `?fields=*,categories.item.*,images.directus_files_id` + // key fields
        `&filter[status][_eq]=true` +
        `&filter[stockQty][_gt]=0` +
        `&filter[live][_eq]=${
          process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test'
            ? false
            : true
        }` +
        `&filter[type][_in]=${type}`
    )
  ).json()
  data = data.data
  // console.log(data)
  return data
}

export async function getWritingStyles() {
  // console.log('query', path)
  let data = await (
    await fetch(`${process.env.NEXT_PUBLIC_REST_API}/writingStyle`)
  ).json()
  data = data.data
  return data
}

export async function getRibbons() {
  // console.log('query', path)
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/products` +
        `?fields=*,categories.item.*,images.directus_files_id` + // key fields
        `&filter[status][_eq]=true` +
        `&filter[stockQty][_gt]=0` +
        `&filter[type][_in]=ribbon`
    )
  ).json()
  data = data.data
  // console.log(data)
  return data
}

export async function getFeaturedProducts(type: any, limit: any) {
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/products` +
        `?fields=*,images.*` +
        `&filter[featured][_eq]=true` +
        `&filter[status][_eq]=true` +
        `&filter[stockQty][_gt]=0` +
        `&filter[type][_in]=${type ? type.toString() : `card,gift`}` +
        `&sort=-date_created` +
        `&limit=${limit ? limit : 3}`
    )
  ).json()
  data = data.data

  return data
}

export async function getPosts(id: any, type: any) {
  let section = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/${type}` +
        `?fields=item.id,item.text,item.section_name,item.limit` +
        `&filter[id][_eq]=${id}`
    )
  ).json()
  section = section.data[0].item

  let posts = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/posts` +
        `?fields=id,slug,name,description,date_created,image` +
        `&filter[brands][brands_id][domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}` +
        `&filter[status][_eq]=published` +
        `&sort[]=-date_created`
    )
  ).json()
  section.posts = posts.data
  return section
}
