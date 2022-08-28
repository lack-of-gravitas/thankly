import cn from 'clsx'

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
  return (
    <>
      <div className={cn(`fixed inset-x-0 `, className)}>
        <div className='px-2 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='p-2 rounded-md shadow-lg bg-slate-500 sm:p-3'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex items-center flex-1 w-0'>
                {icon && icon}

                <p className='ml-3 font-medium text-white '>
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
