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
}

const ProductCard: FC<ProductCardProps> = ({ className, product }) => {
  const brand: any = SwrBrand()
  const { state, dispatch } = useContext(Store)
  const [added, setAdded] = useState(true)
  console.log( state.cart)
  // ADD TO CART HANDLER
  const addToCartHandler = (product: any) => {
    const existItem = state.cart.cartItems.find(
      (x: any) => x.stripeId === product.stripeId
    )

    if (existItem && product.stockQty < existItem.quantity) {
      alert('Sorry. Product is out of stock')
      return
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } })
  }

  const removeFromCartHandler = (product: any) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { ...product } })
  }
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
        <div className="flex items-center justify-between mt-4 space-x-8 text-base font-medium text-gray-900">
          <h3>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </h3>
          <p>{product.price}</p>
        </div>

        <p className="text-sm text-gray-500">{product.description}</p>
      </div>

      <div className="mt-3">
        {added ? (
          <button
            onClick={() => {
              // check if product is in the cart, if yes then show
              addToCartHandler(product)
              setAdded(false)
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
              // check if product is in the cart, if yes then show
              removeFromCartHandler(product)
              setAdded(true)
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
}

export default ProductCard
