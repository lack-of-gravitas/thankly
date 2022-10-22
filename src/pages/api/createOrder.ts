import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('createOrder ->', req.body)
    const cart = req.body

    // Customer Object
    const customer = {
      name: '',
      username: '',
      email: '',
      orders: [],
      preferences: {},
      orderCount: 0,
      totalSpend: 0,
      aov: 0,
    }

    const order = {
      // fk: customer
      // ... cart         // all cart items
      // std dates,
      id: '',
      status: '', // draft, placed, processing, completed/cancelled
    }
    // create customer
    // create order
    // create order line items
    // update order status
    // update stock qty
    //
    // trigger email
    //
    try {
      // directus api - https://docs.directus.io/reference/items.html
      // create order
      
      // create customer

      // link order to customer (if createAccount is selected else leave it as orphan)

      return res.status(200).json({ orderId: order.id })
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
// export default withApiAuth(createCheckoutSession)

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// EXAMPLE CODE FROM STRIPE
// export default async function handler( req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {

//     try {
//     console.log('checkout session request ->', req.body)

//       // Create Checkout Sessions from body params.
//       const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//             // price: '{{PRICE_ID}}',
//             price: `price_1LtM0gEvc4dteT8lK0IcPvmg`,
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${req.headers.origin}/?success=true`,
//         cancel_url: `${req.headers.origin}/?canceled=true`,
//         automatic_tax: {enabled: false},
//       });
//       res.redirect(303, session.url);
//     } catch (err) {
//       res.status(err.statusCode || 500).json(err.message);
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }
