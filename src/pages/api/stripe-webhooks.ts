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

    console.log('stripe triggered event --- ', event.data)


    // if (relevantEvents.has(event.type)) {
    //   try {
    //     switch (event.type) {
    //       case 'product.created':
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

    //         // case 'customer.subscription.created':
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



// price created