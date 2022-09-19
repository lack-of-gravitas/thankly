import cn from 'clsx'
import parse from 'html-react-parser'
import { FC } from 'react'

interface ContentProps {
  className?: string
  data?: any
  // variant?: 'primary' | 'secondary'
}

const Content: FC<ContentProps> = ({ className = '', data }) => {
  // console.log('content --', data)
  return (
    <>
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-lg max-w-prose">
          <article className="max-w-4xl pt-10 text-base prose text-slate-700 prose-a:text-blue-600 prose-img:rounded-md md:pt-5">
            {parse(data.content)}
          </article>
        </div>
      </div>
    </>
  )
}

export default Content
