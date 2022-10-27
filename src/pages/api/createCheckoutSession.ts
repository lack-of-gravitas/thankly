import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '@/lib/stripe'
import { verify } from 'crypto'
// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    console.log('stripe checkout ->', req.body)
    const { cart, orderId } = req.body

    // create a temp coupon for the exact amount of the difference
    let coupon: any
    if (cart.totals.voucher > 0 && cart.totals.net > 0) {
      coupon = await stripe.coupons.create({
        name: 'Thankly Voucher Used',
        amount_off: cart.totals.voucher * 100,
        currency: 'aud',
        duration: 'once',
      })
    }

    // check shipping rate supplied is valid so not breaking checkout
    let shippingRate: any = await stripe.shippingRates.retrieve(
      cart.options.shipping.id
    )

    // put all products into checkout session
    let line_items: any[] = []
    cart.items.map((item: any) => {
      line_items = line_items.concat({ price: item.priceId, quantity: 1 })
    })

    const session = await stripe.checkout.sessions.create({
      line_items: [
        ...line_items,
        // {
        //   price: `price_1LtM0gEvc4dteT8lK0IcPvmg`,
        //   quantity: 1,
        // },
      ],
      discounts:
        cart.totals.voucher > 0 ? [{ coupon: `${coupon.id}` }] : undefined,
      shipping_options: shippingRate != undefined ? [shippingRate.id] : undefined,
      mode: 'payment',
      success_url: `${req.headers.origin}/order?id=${orderId}&status='${true}'`,
      cancel_url: `${req.headers.origin}/order?id=${orderId}&status=${false}`,
      automatic_tax: { enabled: false },
    })

    // delete coupon once used and order is successful
    if (
      cart.totals.voucher > 0 &&
      cart.totals.net > 0 &&
      coupon?.id != undefined
    ) {
      const deleted = await stripe.coupons.del(coupon.id)
    }

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
