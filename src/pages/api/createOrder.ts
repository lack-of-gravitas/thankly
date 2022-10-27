import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { postData } from '@/lib/api-helpers'
import { v4 as uuidv4 } from 'uuid'

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

            // link to customer -- BELOW LINE DOESN"T WORK
            // customer: customer?.id ?? '',

            // recipient
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

      // update product qty
      console.log('updating qty --')

      cart.items.map(async (product: any) => {
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/products/` + product.id,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${process.env.DIRECTUS}`,
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              stockQty: product.stockQty - 1,
            }),
          }
        )
      })

      // update voucher used balance
      await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/vouchers/` +
          cart.options.voucher.code,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS}`,
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            used: cart.totals.voucher * 1,
          }),
        }
      )

      // // create customer move this to Order Confirmation Page
      // if (cart.options.createAccount === true) {
      //   // create customer record
      //   console.log(`${process.env.VERCEL_URL}/users`)
      //   customer = await fetch(`${process.env.VERCEL_URL}/users`, {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${process.env.DIRECTUS}`,
      //       'Content-Type': 'application/json',
      //     },
      //     credentials: 'same-origin',
      //     body: JSON.stringify({
      //       first_name: '',
      //       last_name: '',
      //       email: '',
      //       // password: '',
      //       role: '32a2785c-037a-4b09-bd9a-c29ec2ae9de3',
      //     }),
      //   })
      //   console.log('customer created -- ', customer.id)

      //   results = await fetch(
      //     `${process.env.NEXT_PUBLIC_REST_API}/orders/${order.id}`,
      //     {
      //       method: 'PATCH',
      //       headers: {
      //         Authorization: `Bearer ${process.env.DIRECTUS}`,
      //         'Content-Type': 'application/json',
      //       },
      //       credentials: 'same-origin',
      //       body: JSON.stringify({ customer: customer.id }),
      //     }
      //   )
      // }

      // trigger email
      // const { emailSent } = await postData({
      //   url: '/api/sendEmail',
      //   data: state.cart,
      // })

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
