import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { Readable } from 'node:stream'

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
  'payment_intent.succeeded',
  'checkout.session.completed', // TODO: Delete Voucher Coupon
])

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
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

    if (relevantEvents.has(event.type)) {
      try {
        // directus api - https://docs.directus.io/reference/items.html
        let product
        let price
        let results: any

        switch (event.type) {
          case 'product.created':
            product = event.data.object as Stripe.Product
            console.log('product.created --- ', event)

            results = await fetch(
              `${process.env.NEXT_PUBLIC_REST_API}/products`,
              {
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
                  status: product.active,
                  priceId:product.default_price,
                }),
              }
            )
            break
          case 'product.updated':
            product = event.data.object as Stripe.Product
            console.log('product.updated --- ', event)

            results = await fetch(
              `${process.env.NEXT_PUBLIC_REST_API}/products/` + product.id,
              {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${process.env.DIRECTUS}`,
                  'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                  name: product.name,
                  description: product.description,
                  status: product.active,
                  priceId:product.default_price,
                }),
              }
            )
            break
          case 'price.created':
            price = event.data.object as Stripe.Price
            console.log('price.created PRICE OBJECT FROM STRIPE --- ', event)

            results = await fetch(
              `${process.env.NEXT_PUBLIC_REST_API}/products/` + price.product,
              {
                method: 'PATCH',
                redirect: 'follow',
                headers: {
                  Authorization: `Bearer ${process.env.DIRECTUS}`,
                  'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                  priceId: price.id,
                  currency: price.currency,
                  unit_amount:
                    price.unit_amount === 0 || price.unit_amount === null
                      ? 0
                      : (price.unit_amount / 100).toFixed(2),
                }),
              }
            )
            break

          case 'price.updated':
            price = event.data.object as Stripe.Price
            console.log('price.updated PRICE OBJECT FROM STRIPE --- ', event)

            results = await fetch(
              `${process.env.NEXT_PUBLIC_REST_API}/products` + price.product,
              {
                method: 'PATCH',
                redirect: 'follow',
                headers: {
                  Authorization: `Bearer ${process.env.DIRECTUS}`,
                  'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                  priceId: price.id,
                  currency: price.currency,
                  unit_amount:
                    price.unit_amount === 0 || price.unit_amount === null
                      ? 0
                      : (price.unit_amount / 100).toFixed(2),
                }),
              }
            )
            break
          case 'price.deleted':
            price = event.data.object as Stripe.Price
            console.log('price.deleted --- ', event)

            results = await fetch(
              `${process.env.NEXT_PUBLIC_REST_API}/products/` + price.product,
              {
                method: 'PATCH',
                redirect: 'follow',
                headers: {
                  Authorization: `Bearer ${process.env.DIRECTUS}`,
                  'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                  priceId: '',
                  currency: '',
                  unit_amount: 0,
                }),
              }
            )
            break
          case 'customer.created':
            break
          case 'customer.updated':
            break
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
