import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    const key: any =
  process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEV_STRIPE_PUB_KEY
        : process.env.NEXT_PUBLIC_PRD_STRIPE_PUB_KEY
        
    stripePromise = loadStripe(key)
  }

  return stripePromise
}
