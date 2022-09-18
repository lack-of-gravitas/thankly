import cn from 'clsx'
import { SwrBrand } from '@/lib/swr-helpers'

interface FeatureBarProps {
  className?: string
  hide?: boolean

  // title: string
  // description?: string
  icon?: React.ReactNode
  content?: React.ReactNode
  action?: React.ReactNode
  dismiss?: React.ReactNode
}

const FeatureBar: React.FC<FeatureBarProps> = ({
  // title,
  // description,
  className,
  hide,
  icon,
  content,
  action,
  dismiss,
}) => {
  const brand: any = SwrBrand()

  return (
    <>
      <div className={cn(`fixed inset-x-0 `, className)}>
        <div className='px-2 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div 
          
          style={{
            backgroundColor: brand.secondAccentColour
              ? brand.secondAccentColour
              : '#fff',
          }}
          className='p-2 rounded-xs shadow-md sm:p-3'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex items-center flex-1 w-0'>
                {icon && icon}

                <p 
                style={{
                  color: brand.textColour
                    ? brand.textColour
                    : '#64748b',
                }}
                className='ml-3 font-medium'>
                  {content && content}
                </p>
              </div>
              <div className='flex-shrink-0 order-3 w-full mt-2 sm:order-2 sm:mt-0 sm:w-auto'>
                {action && action}
              </div>
              <div className='flex-shrink-0 order-2 sm:order-3 sm:ml-2'>
                {dismiss && dismiss}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeatureBar
