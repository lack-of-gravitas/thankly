import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { Readable } from 'node:stream'
import deleteCoupon from './deleteCoupon'

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

const handleStripeWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']
    const webhookSecret =
      (process.env.NODE_ENV === 'development' ||process.env.NODE_ENV === 'test')
        ? process.env.DEV_STRIPE_WHK_SEC
        : process.env.PRD_STRIPE_WHK_SEC
    let event: Stripe.Event

    try {
      if (!sig || !webhookSecret) return
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err: any) {
      console.log(`! Error message: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
      // directus api - https://docs.directus.io/reference/items.html
      let product: Stripe.Product
      let price: Stripe.Price
      let session: Stripe.Checkout.Session
      let results: any

      if (event.type === 'checkout.session.completed') {
        session = event.data.object as Stripe.Checkout.Session

        // get order from client_reference_id
        const orderId: any = session.client_reference_id
        const customerId: any = session.customer // id of the customer

        // find and update the order
        console.log('finding Order...')
        let order: any = await (
          await fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/orders?fields=*,items.*&filter[id][_eq]=${orderId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.DIRECTUS}`,
                'Content-Type': 'application/json',
              },
              credentials: 'same-origin',
            }
          )
        ).json()
        order.data?.length > 0 ? (order = order.data[0]) : order

        if (order && order != undefined && Object.keys(order).length > 0) {
          console.log('update stock...')
          fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/api/updateStockQty?items=${order.cart.items}`
          )

          console.log('update voucher...')
          if (Object.keys(order.cart.options.voucher).length != 0) {
            fetch(
              `${process.env.NEXT_PUBLIC_REST_API}/api/updateVoucher?cart=${order.cart}`
            )
          }

          console.log('delete stripe coupon...')
          fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/api/deleteCoupon?id=${order.id}`
          )

          // update order email & customer associated
          console.log('upsert customer...')
          fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/api/upsertCustomer?stripeCustomer=${session.customer_details}&order=${order.id}`
            //            `${process.env.NEXT_PUBLIC_REST_API}/api/upsertCustomer?customer=${order.sender}`
          )
        } else {
          // empty order
        }
      }

      if (event.type === 'product.created') {
        product = event.data.object as Stripe.Product
        results = await fetch(`${process.env.NEXT_PUBLIC_REST_API}/products`, {
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
            priceId: product.default_price,
          }),
        })
        console.log('product.created')
      }

      if (event.type === 'product.updated') {
        product = event.data.object as Stripe.Product
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
              priceId: product.default_price,
            }),
          }
        )
        console.log('product.updated results', results)
      }

      if (event.type === 'product.deleted') {
        product = event.data.object as Stripe.Product
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
              //name: product.name,
              // description: product.description,
              status: false,
              //priceId: product.default_price,
            }),
          }
        )
        console.log('product.updated results', results)
      }

      if (event.type === 'price.created' || event.type === 'price.updated') {
        price = event.data.object as Stripe.Price
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
                  : price.unit_amount / 100,
            }),
          }
        )
        console.log('price.upserted results', results)
      }

      if (event.type === 'price.deleted') {
        price = event.data.object as Stripe.Price
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
        console.log('price.deleted results', results)
      }

      if (event.type === 'customer.created') {
        price = event.data.object as Stripe.Price
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
        console.log('price.deleted results', results)
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

    res.json({ received: true }) // acknowledge receipt of webhook and appropriate processing
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handleStripeWebhook
