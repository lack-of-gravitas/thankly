import { createClient } from '@supabase/supabase-js'
import { stripe } from './stripe'
import { toDateTime } from './api-helpers'
import { Customer, UserDetails, Price, Product, Purchase } from '@/lib/types'
import Stripe from 'stripe'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  }

  const { error } = await supabaseAdmin
    .from<Product>('products')
    .upsert([productData])
  if (error) throw error
  console.log(`Product inserted/updated: ${product.id}`)
}

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  }

  const { error } = await supabaseAdmin
    .from<Price>('prices')
    .upsert([priceData])
  if (error) throw error
  console.log(`Price inserted/updated: ${price.id}`)
}

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string
  uuid: string
}) => {
  const { data, error } = await supabaseAdmin
    .from<Customer>('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single()
  if (error) {
    // No customer record found, let's create one.
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      }
    if (email) customerData.email = email
    const customer = await stripe.customers.create(customerData)
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }])
    if (supabaseError) throw supabaseError
    console.log(`New customer created and inserted for ${uuid}.`)
    return customer.id
  }
  if (data) return data.stripe_customer_id
}

const managePurchases = async (
  // data:any
  identifier: any,
  customerId: any,
  metadata?: any,
  mode?: any
) => {
  console.log('identifier --', identifier)
  console.log('customerId --', customerId)
  console.log('metadata --', metadata)

  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from<Customer>('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  if (noCustomerError) throw noCustomerError
  const { id: uuid } = customerData || {}
  console.log('customer uuid --', uuid)

  let purchaseData: Purchase | any | undefined = undefined

  if (mode === 'subscription' || mode === null) {
    const subscription = await stripe.subscriptions.retrieve(identifier)
    console.log('subscription --', subscription)

    if (subscription) {
      purchaseData = {
        id: subscription.id,
        status: subscription.status,
        user_id: uuid,
        mode: 'subscription',
        // price_id: subscription ? subscription.items.data[0].price.id:,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at
          ? toDateTime(subscription.cancel_at)
          : null,
        canceled_at: subscription.canceled_at
          ? toDateTime(subscription.canceled_at)
          : null,
        current_period_start: toDateTime(subscription.current_period_start),
        current_period_end: toDateTime(subscription.current_period_end),
        created: toDateTime(subscription.created),
        ended_at: subscription.ended_at
          ? toDateTime(subscription.ended_at)
          : null,

        metadata: metadata,
      }
      console.log('purchaseData --', purchaseData)
    }
  }

  if (mode === 'payment') {
    const payment_intent = await stripe.paymentIntents.retrieve(identifier)
    console.log('payment_intent --', payment_intent)

    if (payment_intent) {
      purchaseData = {
        id: payment_intent.id,
        status: payment_intent.status,
        user_id: uuid,
        mode: 'payment_intent',
        // price_id: subscription ? subscription.items.data[0].price.id:,

        metadata: metadata,
      }
    }
    console.log('purchaseData --', purchaseData)
  }

  if (purchaseData) {
    const { error } = await supabaseAdmin
      .from('purchases')
      .upsert([purchaseData])
    if (error) throw error
    console.log(
      `Inserted/updated purchase [${
        purchaseData ? purchaseData.id : null
      }] for user [${uuid}]`
    )
  }
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  managePurchases,
}
