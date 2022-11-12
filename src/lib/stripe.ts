import Stripe from 'stripe'

const key: any =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_STRIPE_SEC_KEY
    : process.env.PRD_STRIPE_SEC_KEY

export const stripe = new Stripe(key, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-08-01',
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'thankly',
    version: '0.1.0',
  },
})
