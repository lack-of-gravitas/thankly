import { Dialog, Transition } from '@headlessui/react'
import { FC, ReactNode, Component, Children } from 'react'
import { Fragment } from 'react'
import { Store } from '@/lib/Store'
import { SwrBrand } from '@/lib/swr-helpers'
import { useContext, useEffect, useState } from 'react'
import cn from 'clsx'
import dynamic from 'next/dynamic'
import { set } from 'lodash'

const Icon = dynamic(() => import('@/components/common/Icon'))
const ProductCarousel = dynamic(
  () => import('@/components/ui/Product/ProductCarousel')
)
const Notification = dynamic(() => import('@/components/ui/Notification'))

interface ProductCardProps {
  className?: string
  product?: any
  carousel?: boolean
}

const ProductCard: FC<ProductCardProps> = ({ className, product }) => {
  const { state, dispatch } = useContext(Store)
  const [productAdded, setProductAdded] = useState(false)

  // check if product in cart and flip to remove button
  useEffect(() => {
    const found = state.cart?.items?.filter(
      (item: any) => item.id === product.id
    )

    if (found && found != undefined && found.length > 0) {
      setProductAdded(true)
    } else {
      setProductAdded(false)
    }
  }, [state.cart])

  // console.log('currentCart ->',state.cart)

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
          <h3 className="text-base font-bold leading-tight text-slate-700">{product.name}</h3>
          <p className="text-base font-bold leading-tight text-slate-700">
            ${(product.unit_amount * 1).toFixed(2)}
          </p>
        </div>

        <p className="text-sm leading-tight text-gray-500">{product.description}</p>
      </div>

      <div className="mt-3">
        {productAdded === false ? (
          <button
            onClick={(e: any) => {
              // addItem(product)
              dispatch({ type: 'ADD_ITEM', payload: { ...product } })
              setProductAdded(true)
            }}
            className="relative flex items-center justify-center w-full px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase border border-transparent hover:bg-gray-200"
          >
            {product.type === 'card' && <Icon className="mr-2" name={'mark_email_unread'} />}
            {product.type === 'gift' && <Icon className="mr-2" name={'view_in_ar'} />}
            Add
            <span className="sr-only">, {product.name}</span>
          </button>
        ) : (
          <button
            onClick={(e: any) => {
              dispatch({ type: 'REMOVE_ITEM', payload: { ...product } })
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
}

export default ProductCard
