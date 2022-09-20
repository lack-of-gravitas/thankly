import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getPage } from '@/lib/queries'
import Fuse from 'fuse.js'

const Layout = dynamic(() => import('@/components/common/Layout'))
const Section = dynamic(() => import('@/components/ui/Section'))

export default function Home({ slug, preview, prefetchedData }: any) {
  console.log('prefetchedData->', prefetchedData)
  const router = useRouter()
  const list = [
    {
      "title": "Old Man's War",
      "author": "John Scalzi",
      "tags": ["fiction"]
    },
    {
      "title": "The Lock Artist",
      "author": "John Steven",
      "tags": ["thriller"]
    }
  ]
  const options = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: ['author', 'tags']
  }
  
  const fuse = new Fuse(list, options)
  
  const result = fuse.search('john')
  console.log(result)
  //   if (!prefetchedData) {
  //     router.push('/404')
  //   }

  return (
    <>
      

      {/* <Example className="sticky top-0 "/> */}
    </>
  )
}

Home.Layout = Layout
