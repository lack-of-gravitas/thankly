import { Dialog, Transition } from '@headlessui/react'
import { FC, ReactNode, Component, Children } from 'react'
import { Fragment } from 'react'
import { Store } from '@/lib/Store'
import { SwrBrand } from '@/lib/swr-helpers'
import { useContext, useEffect, useState } from 'react'
import cn from 'clsx'
import dynamic from 'next/dynamic'

const Icon = dynamic(() => import('@/components/common/Icon'))
const ProductCarousel = dynamic(
  () => import('@/components/ui/Send/ProductCarousel')
)

interface ProductCardProps {
  className?: string
  product?: any
  carousel?: boolean
}

const ProductCard: FC<ProductCardProps> = ({ className, product }) => {
  const brand: any = SwrBrand()
  const { state, dispatch } = useContext(Store)
  const [productAdded, setProductAdded] = useState(
    inCart(product.stripeId) ? true : false
  )

  return (
    <div
      key={product.id}
      className={cn(
        className,
        `relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white`
      )}
    >
      <ProductCarousel data={product.images} />

      <div className="flex flex-col flex-1 p-4 space-y-2">
        <div className="flex items-center justify-between mt-4 space-x-8 text-gray-900">
          <h3 className="text-base font-bold text-slate-700">{product.name}</h3>
          <p>{product.price}</p>
        </div>

        <p className="text-sm text-gray-500">{product.description}</p>
      </div>

      <div className="mt-3">
        {productAdded === false ? (
          <button
            onClick={() => {
              addItem(product)
              setProductAdded(true)
            }}
            className="relative flex items-center justify-center w-full px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase bg-gray-100 border border-transparent hover:bg-gray-200"
          >
            <Icon className="mr-2" name={'loyalty'} />
            Add
            <span className="sr-only">, {product.name}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              removeItem(product)
              setProductAdded(false)
            }}
            className="relative flex items-center justify-center w-full px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase bg-gray-100 border border-transparent hover:bg-gray-200"
          >
            <Icon className="mr-2" name={'close'} />
            Remove
            <span className="sr-only">, {product.name}</span>
          </button>
        )}
      </div>
    </div>
  )

  // cart functions
  function addItem(product: any) {
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...product },
    })
  }

  function removeItem(product: any) {
    dispatch({ type: 'REMOVE_ITEM', payload: { ...product } })
  }

  function inCart(stripeId: any) {
    const existItem = state.cart.items?.find(
      (x: any) => x.stripeId === stripeId
    )
    return existItem ? true : false
  }
}

export default ProductCard
