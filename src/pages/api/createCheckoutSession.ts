import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '@/lib/stripe'
// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    console.log('stripe checkout ->', req.body)
    const { cart, orderId } = req.body

    // have to create a Discount for the exact amount of the difference and auto apply that to the product
    const coupon = await stripe.coupons.create({
      name: 'Thankly Voucher Used',
      amount_off: cart.totals.voucher * 100,
      currency: 'aud',
      duration: 'once',
    })
    let line_items: any
    cart.items.map((item: any) => {
      line_items = [...line_items, { price: item.priceId, quantity: 1 }]
    })
    console.log('coupon --', coupon)

    const session = await stripe.checkout.sessions.create({
      line_items: [
        ...line_items,
        // {
        //   price: `price_1LtM0gEvc4dteT8lK0IcPvmg`,
        //   quantity: 1,
        // },
      ],
      discounts: [{ coupon: `${coupon}` }],
      mode: 'payment',
      success_url: `${req.headers.origin}/order?id=${orderId}&status='${true}'`,
      cancel_url: `${req.headers.origin}/order?id=${orderId}&status=${false}`,
      automatic_tax: { enabled: false },
    })

    const deleted = await stripe.coupons.del(coupon.id) // delete coupon once used and order is successful

    return res.status(200).json({ sessionId: session.id })
    // } catch (err: any) {
    //   console.log(err)
    //   res.status(500).json({ error: { statusCode: 500, message: err.message } })
    // }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default createCheckoutSession
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
