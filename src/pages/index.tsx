import dynamic from 'next/dynamic'
import Head from 'next/head'

import { useRouter } from 'next/router'
import { Layout } from '@/components/common'
import { getPage } from '@/lib/queries'

// import { Section } from '@/components/ui'

export default function Home({ slug, preview, prefetchedData }: any) {
  // console.log('prefetchedData->', prefetchedData)
  const router = useRouter()
  if (!prefetchedData) {
    router.push('/404')
  }

  return (
    <>
      {/* {prefetchedData?.sections?.map((section: any) => (
        <Section key={section.sort} section={section} />
      ))} */}
    </>
  )
}

Home.Layout = Layout

export async function getStaticProps(context: any) {
  const data = await getPage('home')
  console.log('server data->', data)
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
