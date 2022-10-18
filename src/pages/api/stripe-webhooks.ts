import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { Readable } from 'node:stream'
import { postData } from '@/lib/api-helpers'

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
  'checkout.session.completed', // TODO: Delete Voucher Coupon
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

    if (relevantEvents.has(event.type)) {
      try {
        // directus api - https://docs.directus.io/reference/items.html
        let product
        let price
        let results: any

        switch (event.type) {
          case 'product.created':
            product = event.data.object as Stripe.Product

            results = await (
              await fetch(`${process.env.NEXT_PUBLIC_REST_API}/products`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${process.env.DIRECTUS}`,
                  'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  status: product.active === true ? 'active' : 'draft',
                }),
              })
            ).json()

            console.log('directus product created results -- ', results)
            break
          case 'product.updated':
            product = event.data.object as Stripe.Product
            results = await postData({
              url: `${process.env.NEXT_PUBLIC_REST_API}/products/` + product.id,
              data: {
                name: product.name,
                description: product.description,
                status: product.active === true ? 'active' : 'draft',
              },
              token: `${process.env.DIRECTUS}`,
            })

            console.log('directus product created results -- ', results)
            break

          case 'price.created':
            price = event.data.object as Stripe.Price
            results = await postData({
              url: `${process.env.NEXT_PUBLIC_REST_API}/products`,
              data: {
                priceId: price.id,
                currency: price.currency,
                // product: price.product,
                unit_amount: ((price.unit_amount ?? 0) / 100).toFixed(2),
              },
              token: `${process.env.DIRECTUS}`,
            })

            console.log('directus price created results -- ', results)
            break

          case 'price.updated':
            price = event.data.object as Stripe.Price
            results = await postData({
              url:
                `${process.env.NEXT_PUBLIC_REST_API}/products/` + price.product,
              data: {
                priceId: price.id,
                currency: price.currency,
                //product: price.product,
                unit_amount: ((price.unit_amount ?? 0) / 100).toFixed(2),
              },
              token: `${process.env.DIRECTUS}`,
            })

            console.log('directus price created results -- ', results)
            break
          // case 'checkout.session.completed':
          //   const checkoutSession = event.data.object as Stripe.Checkout.Session
          //   await managePurchases(
          //     // event.data.object as Stripe.Checkout.Session,
          //     checkoutSession.mode === 'subscription'
          //       ? (checkoutSession.subscription as string)
          //       : checkoutSession.payment_intent,
          //     checkoutSession.customer as string,
          //     checkoutSession.metadata,
          //     checkoutSession.mode as string
          //   )
          //   break

          // default:
          //   throw new Error('Unhandled relevant event!')
        }
      } catch (error) {
        console.log(error)
        return res
          .status(400)
          .send(
            'Webhook error: "Webhook handler failed. View logs."' +
              JSON.stringify(error)
          )
      }
    }

    res.json({ received: true }) // acknowledge receipt of webhook and appropriate processing
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default webhookHandler
