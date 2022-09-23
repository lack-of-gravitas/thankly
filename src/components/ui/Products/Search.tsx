import { SwrBrand } from '@/lib/swr-helpers'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Icon = dynamic(() => import('@/components/common/Icon'))

interface ProductsProps {
  // children?: React.ReactNode[]
  className?: string
  data?: any
}


const Products: React.FC<ProductsProps> = ({
  // children,
  className,
  data,
}) => {
  const brand = SwrBrand()

  return (
    <>

      {data.map((product: any) => (
        <div
          key={product.id}
          className={` relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white`}
        >
          <div className="bg-gray-200 aspect-w-3 aspect-h-4 sm:aspect-none sm:h-96">
            <img
              src={
                'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg'
              }
              className="object-cover object-center w-full h-full sm:h-full sm:w-full"
            />
          </div>

          <div className="flex flex-col flex-1 p-4 space-y-2">
            <div className="flex items-center justify-between mt-4 space-x-8 text-base font-medium text-gray-900">
              <h3>
                <a href="#">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </a>
              </h3>
              <p>{product.price}</p>
            </div>

            <p className="text-sm text-gray-500">{product.description}</p>
          </div>

          <div className="mt-3">
            <a
              href={product.href}
              className="relative flex items-center justify-center px-8 py-2 text-xs font-semibold tracking-wider text-gray-900 uppercase bg-gray-100 border border-transparent hover:bg-gray-200"
            >
              <Icon className="mr-2" name={'loyalty'} />
              Choose<span className="sr-only">, {product.name}</span>
            </a>
          </div>
        </div>
      ))}
    </>
  )
}

export default Products
