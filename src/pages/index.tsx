import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getPage } from '@/lib/queries'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Section = dynamic(() => import('@/components/ui/Section'))

export default function Home({ slug, preview, prefetchedData }: any) {
  console.log('prefetchedData->', prefetchedData)
  const router = useRouter()
  if (!prefetchedData) {
    router.push('/404')
  }

  return (
    <>
    <Example />
      {/* {prefetchedData?.sections?.map((section: any) => (
        <Section key={section.sort} data={section} />
      ))} */}
    </>
  )
}

Home.Layout = Layout

export async function getStaticProps(context: any) {
  const data = await getPage('home')
  // console.log('server data->', data)
  // return props with data to component
  return {
    props: {
      slug: 'home',
      preview: context.preview ? true : null,
      prefetchedData: data && data.data?.length > 0 ? data.data[0] : null,
    },
    revalidate: 28800, // In seconds. False means page is cached until next build, 28800 = 8 hours
  }
}




const favorites = [
  {
    id: 1,
    name: 'Black Basic Tee',
    price: '$32',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg',
    imageAlt: "Model wearing women's black cotton crewneck tee.",
  },
  {
    id: 2,
    name: 'Off-White Basic Tee',
    price: '$32',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-02.jpg',
    imageAlt: "Model wearing women's off-white cotton crewneck tee.",
  },
  {
    id: 3,
    name: 'Mountains Artwork Tee',
    price: '$36',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-03.jpg',
    imageAlt:
      "Model wearing women's burgundy red crewneck artwork tee with small white triangle overlapping larger black triangle.",
  },
]
const categories = [


  {
    name: 'New Arrivals',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-01.jpg',
  },
  {
    name: 'Productivity',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-02.jpg',
  },
  {
    name: 'Workspace',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-04.jpg',
  },
  {
    name: 'Accessories',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-05.jpg',
  },
  { name: 'Sale', href: '#', imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-03.jpg' },
]

export  function Example() {

  return (
    <div className="bg-white">
     
     <div className="relative bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img
            src="https://tailwindui.com/img/ecommerce-images/home-page-01-hero-full-width.jpg"
            alt=""
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

       

        <div className="relative flex flex-col items-center max-w-3xl px-6 py-32 mx-auto text-center sm:py-64 lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">New arrivals are here</h1>
          <p className="mt-4 text-xl text-white">
            The new arrivals have, well, newly arrived. Check out the latest options from our summer small-batch release
            while theyre still in stock.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-3 mt-8 text-base font-medium text-gray-900 bg-white border border-transparent rounded-md hover:bg-gray-100"
          >
            Shop New Arrivals
          </a>
        </div>
      </div>

      <main>

      <section aria-labelledby="category-heading" className="pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8">
          <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
            <h2 id="category-heading" className="text-2xl font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <a href="#" className="hidden text-sm font-semibold text-slate-500 hover:text-indigo-500 sm:block">
              Browse all categories<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="flow-root mt-4">
            <div className="-my-2">
              <div className="box-content relative py-2 overflow-x-auto h-80 xl:overflow-visible">
                <div className="absolute flex px-4 space-x-8 min-w-screen-xl sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="relative flex flex-col w-56 p-6 overflow-hidden rounded-md h-80 hover:opacity-75 xl:w-auto"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        <img src={category.imageSrc} alt="" className="object-cover object-center w-full h-full" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 opacity-50 h-2/3 bg-gradient-to-t from-gray-800"
                      />
                      <span className="relative mt-auto text-xl font-bold text-center text-white">{category.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mt-6 sm:hidden">
            <a href="#" className="block text-sm font-semibold text-slate-500 hover:text-indigo-500">
              Browse all categories<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </section>
        {/* Favorites section */}
        <section aria-labelledby="favorites-heading">
          <div className="px-4 py-24 mx-auto max-w-7xl sm:py-32 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-gray-900">
                Our Favorites
              </h2>
              <a href="#" className="hidden text-sm font-semibold text-slate-500 hover:text-indigo-500 sm:block">
                Browse all favorites<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            <div className="grid grid-cols-1 mt-6 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:gap-x-6 lg:gap-x-8">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <div className="w-full overflow-hidden rounded-md h-96 group-hover:opacity-75 sm:h-auto sm:aspect-w-2 sm:aspect-h-3">
                    <img
                      src={favorite.imageSrc}
                      alt={favorite.imageAlt}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">
                    <a href={favorite.href}>
                      <span className="absolute inset-0" />
                      {favorite.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{favorite.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <a href="#" className="block text-sm font-semibold text-slate-500 hover:text-indigo-500">
                Browse all favorites<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </section>
        {/* Featured section */}
        <section aria-labelledby="cause-heading">
          <div className="relative px-6 py-32 bg-gray-800 sm:py-40 sm:px-12 lg:px-16">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg"
                alt=""
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gray-900 bg-opacity-50" />
            <div className="relative flex flex-col items-center max-w-3xl mx-auto text-center">
              <h2 id="cause-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Long-term thinking
              </h2>
              <p className="mt-3 text-xl text-white">
                Were committed to responsible, sustainable, and ethical manufacturing. Our small-scale approach allows
                us to focus on quality and reduce our impact. Were doing our best to delay the inevitable heat-death of
                the universe.
              </p>
              <a
                href="#"
                className="block w-full px-8 py-3 mt-8 text-base font-medium text-gray-900 bg-white border border-transparent rounded-md hover:bg-gray-100 sm:w-auto"
              >
                Read our story
              </a>
            </div>
          </div>
        </section>

       

      
      </main>

     
    </div>
  )
}
