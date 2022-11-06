import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from 'next/future/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useRouter } from 'next/router'

import cn from 'clsx'
import Fuse from 'fuse.js'
// core imports
// lib imports
// ui imports
import { SwrBrand, SwrCards, SwrGifts, SwrProducts } from '@/lib/swr-helpers'
import { Store } from '@/lib/Store'

const Icon = dynamic(() => import('@/components/common/Icon'))
const ProductCard = dynamic(() => import('@/components/ui/Product'))

export default function AddGift() {
  const { state, dispatch } = useContext(Store)

  let fuse: any
  let products = SwrCards()

  const searchOptions = {
    includeScore: false,
    shouldSort: true,
    minMatchCharLength: 3,
    threshold: 0.3,
    keys: [
      { name: 'name', weight: 0.7 },
      // { name: 'description', weight: 0.3 },
      { name: 'type', weight: 1 },
      { name: 'tags', weight: 0.7 },
      { name: 'brand', weight: 0.3 },
      { name: 'categories.item.name', weight: 0.5 },
    ],
  }
  const [searchResults, updateSearchResults]: any = useState()
  const [query, updateQuery] = useState('')

  // useEffect(() => {

  //   if ()
  //   products ? products = products.filter((item: any) => item.type === 'card'):null
  // }, [])

  products ? (fuse = new Fuse(products, searchOptions)) : null
  // console.log('products -- ', products)

  function onSearch({ currentTarget }: any) {
    currentTarget.value === '' || query === ''
      ? updateQuery('card')
      : updateQuery(currentTarget.value)

    let response = fuse.search(query)
    let newResult = response.map((item: any) => {
      return item.item
    })
    if (currentTarget.value === '') {
      response = fuse.search('card')
      newResult = response.map((item: any) => {
        return item.item
      })
    }
    console.log('new result', newResult)
    updateSearchResults(newResult)

    // updateResult(fuse.search(query))
  }
  // State & Variable Declarations
  // Function Declarations
  // Component Return
  return (
    <div className="max-w-2xl py-2 mx-auto sm:py-5 lg:max-w-7xl ">
      <h2 className="sr-only">Products</h2>
      <div className="border rounded-md border-gray-150 bg-gray-50">
        <div className="relative flex flex-row px-3 py-3 justify-items-center focus-within:z-10">
          <div className="grow basis-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 ml-2 pointer-events-none grow ">
              <Icon name={'search'} />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="flex max-w-full min-w-full pl-10 font-medium tracking-tight border-gray-300 rounded-md txt-slate-500 grow focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              placeholder="Start searching here..."
              onChange={
                // (e: any) => {
                // console.log('e.target.value >', e.target.value)
                onSearch
                // }
              }
            />
          </div>
          {/* <div className="basis-1/8">
              <Switch.Group
                as="div"
                className="relative flex items-center ml-3 tracking-tight"
              >
                <Switch
                  checked={enabled}
                  onChange={() => {
                    let response: any
                    let newResult: any
                    if (enabled === true) {
                      setEnabled(false)
                      response = fuse.search('gift')
                    }
                    if (enabled === false) {
                      setEnabled(true)
                      response = fuse.search('card')
                    }
                    newResult = response.map((item: any) => {
                      return item.item
                    })
                    updateSearchResults(newResult)
                  }}
                  className={cn(
                    enabled ? 'bg-slate-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      enabled ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
                
              </Switch.Group>
            </div> */}
        </div>
        {/* <div className="px-4 py-2 text-sm italic leading-tight text-gray-500 grow">
          <p>
            <Icon
              className="hidden mb-1 mr-3 font-medium align-middle md:inline"
              name={`shopping_basket`}
            />
            {`You can add more than one product to your Thankly by choosing multiple items. Or simply search for and select from one of our thoughtfully designed cards.`}
          </p>
        </div> */}
      </div>

      <div className="grid grid-cols-1 pt-5 mx-auto tracking-snug gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-4 xl:grid-cols-4 xl:gap-x-4">
        {searchResults
          ? searchResults?.map((product: any) => (
              <ProductCard key={product.name} product={product} />
            ))
          : products?.map((product: any) => (
              <ProductCard key={product.name} product={product} />
            ))}
      </div>
    </div>
  )
}
