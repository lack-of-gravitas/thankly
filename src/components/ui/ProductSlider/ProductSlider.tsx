import React, {
  useState,
  useRef,
  useEffect,
} from 'react'

import EmblaCarousel from "./EmblaCarousel";

interface ProductSliderProps {
  children?: React.ReactNode[]
  className?: string[]
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  children,
  className = '',
}) => {

  const SLIDE_COUNT = 5;
  const slides = Array.from(Array(SLIDE_COUNT).keys());

  return (
   <> <EmblaCarousel slides={slides} />

   
   </>
  )
}

export default ProductSlider