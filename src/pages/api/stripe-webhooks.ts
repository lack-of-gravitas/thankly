import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { Readable } from 'node:stream'
import {
  upsertProductRecord,
  upsertPriceRecord,
  managePurchases,
} from '@/lib/supabase-admin'

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: Readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const relevantEvents = new Set([
  'customer.created',
  'customer.updated',
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'payment_intent.succeeded',
  'checkout.session.completed',
])

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
      process.env.STRIPE_WEBHOOK_SECRET
    let event: Stripe.Event

    try {
      if (!sig || !webhookSecret) return
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err: any) {
      console.log(`! Error message: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    console.log('stripe triggered event --- ', event)

    // if (relevantEvents.has(event.type)) {
    //   try {
    //     switch (event.type) {
    //       case 'product.created':
    //         // get directusid from metadata and update stripeId for product record in Supabase
    //         await upsertProductRecord(event.data.object as Stripe.Product)

    //       case 'product.updated':
    //         await upsertProductRecord(event.data.object as Stripe.Product)
    //         break
    //       case 'price.created':
    //       case 'price.updated':
    //         await upsertPriceRecord(event.data.object as Stripe.Price)
    //         break
    //       case 'checkout.session.completed':
    //         const checkoutSession = event.data.object as Stripe.Checkout.Session
    //         await managePurchases(
    //           // event.data.object as Stripe.Checkout.Session,
    //           checkoutSession.mode === 'subscription'
    //             ? (checkoutSession.subscription as string)
    //             : checkoutSession.payment_intent,
    //           checkoutSession.customer as string,
    //           checkoutSession.metadata,
    //           checkoutSession.mode as string
    //         )
    //         break

    //       // case 'customer.subscription.created':
    //       // case 'customer.subscription.updated':
    //       // case 'customer.subscription.deleted':
    //       //   const subscription = event.data.object as Stripe.Subscription
    //       //   await managePurchases(
    //       //     // event.data.object
    //       //     subscription.id,
    //       //     subscription.customer as string,
    //       //   )
    //       //   break

    //       default:
    //         throw new Error('Unhandled relevant event!')
    //     }
    //   } catch (error) {
    //     console.log(error)
    //     return res
    //       .status(400)
    //       .send(
    //         'Webhook error: "Webhook handler failed. View logs."' +
    //           JSON.stringify(error)
    //       )
    //   }
    // }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default webhookHandler

// // price deleted

// stripe triggered event ---  {
//   id: 'evt_1Lt4weEvc4dteT8lr5EU7xFz',
//   object: 'event',
//   api_version: '2022-08-01',
//   created: 1665819488,
//   data: {
//     object: {
//       id: 'prod_MWetI5m6pENs5e',
//       object: 'product',
//       active: true,
//       attributes: [],
//       created: 1664514926,
//       default_price: null,
//       description: null,
//       images: [],
//       livemode: false,
//       metadata: {},
//       name: 'DEMO Thank You Card',
//       package_dimensions: null,
//       shippable: null,
//       statement_descriptor: null,
//       tax_code: 'txcd_99999999',
//       type: 'service',
//       unit_label: null,
//       updated: 1665819488,
//       url: null
//     },
//     previous_attributes: { updated: 1665819487 }
//   },
//   livemode: false,
//   pending_webhooks: 1,
//   request: {
//     id: 'req_ynVUz8saN49EtZ',
//     idempotency_key: '761de9ce-3a99-4eb7-93a0-cab3e8fb56dc'
//   },
//   type: 'product.updated'
// }

// // price created
// stripe triggered event ---  {
//   id: 'evt_1Lt4xaEvc4dteT8l5gVlzKBF',
//   object: 'event',
//   api_version: '2022-08-01',
//   created: 1665819546,
//   data: {
//     object: {
//       id: 'prod_MWetI5m6pENs5e',
//       object: 'product',
//       active: true,
//       attributes: [],
//       created: 1664514926,
//       default_price: 'price_1Lt4xZEvc4dteT8lk9D7MZY8',
//       description: null,
//       images: [],
//       livemode: false,
//       metadata: {},
//       name: 'DEMO Thank You Card',
//       package_dimensions: null,
//       shippable: null,
//       statement_descriptor: null,
//       tax_code: 'txcd_99999999',
//       type: 'service',
//       unit_label: null,
//       updated: 1665819546,
//       url: null
//     },
//     previous_attributes: { updated: 1665819545 }
//   },
//   livemode: false,
//   pending_webhooks: 1,
//   request: {
//     id: 'req_9nEUHvS0KJa0XU',
//     idempotency_key: '152c8c13-7cfc-46ec-8471-7a37df33328e'
//   },
//   type: 'product.updated'
// }

// // product updated
// stripe triggered event ---  {
//   id: 'evt_1Lt4yjEvc4dteT8lOT28a9qn',
//   object: 'event',
//   api_version: '2022-08-01',
//   created: 1665819616,
//   data: {
//     object: {
//       id: 'prod_MWetI5m6pENs5e',
//       object: 'product',
//       active: true,
//       attributes: [],
//       created: 1664514926,
//       default_price: null,
//       description: null,
//       images: [],
//       livemode: false,
//       metadata: {},
//       name: 'Thank You Card',
//       package_dimensions: null,
//       shippable: null,
//       statement_descriptor: null,
//       tax_code: 'txcd_99999999',
//       type: 'service',
//       unit_label: null,
//       updated: 1665819616,
//       url: null
//     },
//     previous_attributes: { name: 'DEMO Thank You Card', updated: 1665819577 }
//   },
//   livemode: false,
//   pending_webhooks: 1,
//   request: {
//     id: 'req_cA11RdnXR9hIO2',
//     idempotency_key: '00615750-c76b-4444-8f24-763bc3abc45c'
//   },
//   type: 'product.updated'
// }

// // customer created

// stripe triggered event ---  {
//   id: 'evt_1Lt4zWEvc4dteT8ld7OAIeYm',
//   object: 'event',
//   api_version: '2022-08-01',
//   created: 1665819666,
//   data: {
//     object: {
//       id: 'cus_McJcOuxkwEhUeT',
//       object: 'customer',
//       address: null,
//       balance: 0,
//       created: 1665819666,
//       currency: null,
//       default_source: null,
//       delinquent: false,
//       description: null,
//       discount: null,
//       email: 'info@tausigma.co',
//       invoice_prefix: 'D064860E',
//       invoice_settings: [Object],
//       livemode: false,
//       metadata: {},
//       name: 'DEMO Customer',
//       next_invoice_sequence: 1,
//       phone: null,
//       preferred_locales: [],
//       shipping: null,
//       tax_exempt: 'none',
//       test_clock: null
//     }
//   },
//   livemode: false,
//   pending_webhooks: 1,
//   request: {
//     id: 'req_GXUG6yUfQXICbE',
//     idempotency_key: '0d622f33-3546-4600-9ea7-2798814f26bc'
//   },
//   type: 'customer.created'
// }
