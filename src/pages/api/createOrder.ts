import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { postData } from '@/lib/api-helpers'
import { v4 as uuidv4 } from 'uuid'
import { getVoucher } from '@/lib/queries'

// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('createOrder ->', req.body)
    let results: any
    let product: Stripe.Product
    const { cart, status } = req.body

    try {
      // directus api - https://docs.directus.io/reference/items.html
      // create customer - https://docs.directus.io/reference/system/users.html
      // authn - https://docs.directus.io/self-hosted/sso-examples.html
      // check if customer already exists before doing below
      let customer: any
      let order: any = {}

      // create order
      console.log('creating order...')

      let line_items: any = []
      cart.items.map((item: any) => {
        // loop through and create custom object for products ordered
        line_items = [
          ...line_items,
          {
            products_id: item.id,
            unit_amount: item.unit_amount,
            currency: item.currency,
            qty: 1,
          },
        ]
      })

      // loop and add ribbon as product
      if (Object.keys(cart.options.ribbon).length > 0) {
        line_items = [
          ...line_items,
          {
            products_id: cart.options.ribbon.id,
            unit_amount: 0, //cart.options.ribbon.unit_amount,
            currency: 'aud', //item.currency,
            qty: 1,
          },
        ]
      }

      // just pull order id and chuck into orders_products intersection table
      order = await (
        await fetch(`${process.env.NEXT_PUBLIC_REST_API}/orders`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS}`,
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            id: uuidv4(),
            status: status, // draft, placed, processing, completed/cancelled

            // totals
            gross: cart.totals.items * 1,
            discount: cart.totals.discount * 1,
            shipping: cart.totals.shipping * 1,
            subtotal: cart.totals.subtotal * 1,
            voucher: cart.totals.voucher * 1,
            net: cart.totals.net * 1,

            // product(s) snapshot
            items: [...line_items],

            // recipient
            message: cart.cardContent.message,
            writingStyle: cart.options.writingStyle.name,
            instructions: cart.cardContent.specialInstructions,
            firstname: cart.recipient.firstname,
            lastname: cart.recipient.lastname,
            company: cart.recipient.company,
            fullAddress: cart.recipient.address.fulladdress,
            line2: cart.recipient.address.line2,
            suburb: cart.recipient.address.suburb,
            state: cart.recipient.address.state,
            postcode: cart.recipient.address.postcode,

            // full cart dump
            cart: { ...cart },
          }),
        })
      ).json()
      console.log('order created --', order)

      return res.status(200).json({ ...order.data })
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default createOrder
