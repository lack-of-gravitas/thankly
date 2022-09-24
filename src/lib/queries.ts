// brand

export async function getBrand() {
  let brand = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/brands` +
        `?fields=name,tagline,logo,homepage.slug,` + //  brand fields
        `banner.*,` +
        `textColour, backgroundColour, firstAccentColour, secondAccentColour,thirdAccentColour,` +
        `header.item.id,header.item.slug,header.collection,header.item.name,` + // header fields
        `footer.id,footer.sort,footer.item.id,footer.item.name,` + // footer columns
        `footer.item.links.item.slug,footer.item.links.collection,footer.item.links.sort,footer.item.links.item.name` + // footer fields
        `&filter[domain][_eq]=${process.env.NEXT_PUBLIC_BRAND}`
    )
  ).json()
  brand = brand.data[0]
  // console.log('brand query--', brand)

  return brand
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
            `?fields=*` +
            `&filter[featured][_eq]=true` +
            `&filter[status][_eq]=active` +
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
    case 'ProductComponents':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=item.id,item.text,item.section_name,item.items.*,` +
            `item.items.item.id,item.items.item.name,item.items.item.description,` + // products
            `item.items.item.modules.item.id,item.items.item.modules.item.name,item.items.item.modules.item.description,item.items.item.modules.sort` + // modules
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item

      return section
      break
    case 'ProductFAQs':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=item.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      return section.data[0].item
      break

    case 'ProductPricing':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=item.id,item.text,item.section_name,item.prices.*,products_id.stripeId` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item
      // console.log('pricing section', section)
      // console.log('product_id', params.product_id)

      let { data: stripePrices } = await (
        await fetch(
          `https://api.stripe.com/v1/search/prices?query=product:'${params.product_id}' AND active:'true'`,
          {
            method: 'GET',
            headers: {
              'Stripe-Version': '2020-08-27',
              search_api_beta: 'v1',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PRODUCTINFO}`,
              'Content-Type': 'application/json',
            },
          }
        )
      ).json()
      // console.log('stripe prices', stripePrices)

      let consolidatedPrices: any = []

      section.prices?.map((price: any) => {
        stripePrices?.map((stripePrice: any) => {
          // find price in stripePrices
          if (stripePrice.id === price.stripeId) {
            consolidatedPrices.push({
              ...price,
              ...stripePrice,
            })
            // console.log('consolidatedPrices', consolidatedPrices)
          }
        })
      })

      section.prices = consolidatedPrices
      // console.log('section + prices', section)

      return section
    case 'ProductReviews':
      section = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/pages_sections` +
            `?fields=*,item.*,item.items.*,item.items.ReviewId.*` +
            `&filter[id][_eq]=${params.id}`
        )
      ).json()
      section = section.data[0].item
      // console.log('section', section)
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

export async function getProducts() {
  // console.log('query', path)
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/products` +
        `?fields=*,categories.item.*,images.directus_files_id` + // key fields
        `&filter[status][_eq]=active` +
        `&filter[stockQty][_gt]=0` +
        `&filter[type][_in]=card,gift`
    )
  ).json()
  data = data.data
  return data
}

export async function getFeaturedProducts(type: any, limit: any) {
  let data = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/products` +
        `?fields=*` +
        `&filter[status][_eq]=active` +
        `&filter[stockQty][_gt]=0` +
        `&filter[type][_in]=${type ? type.toString() : `card,gift`}` +
        `&sort=-date_created` +
        `&limit=${limit ? limit : 3}`
    )
  ).json()
  data = data.data[0]
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
