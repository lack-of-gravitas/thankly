import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '@/lib/stripe'
// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    console.log('req->', req.body)

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          // price: '{{PRICE_ID}}',
          price: `price_1LtM0gEvc4dteT8lK0IcPvmg`,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      automatic_tax: { enabled: false },
    })

    //     try {
    //       // const { user } = await getUser({ req, res })
    //       // const customer = await createOrRetrieveCustomer({
    //       //   uuid: user?.id || '',
    //       //   email: user?.email || '',
    //       // })

    //       const session = await stripe.checkout.sessions.create({
    //         // customer,
    //         // line_items: [{ price: price.id, quantity }],
    //         line_items: [{ price: `price_1LtM0gEvc4dteT8lK0IcPvmg`, quantity:1 }],
    //         mode: `payment`, // price.type === 'one_time' ? 'payment' : 'subscription', // "payment" or "subscription",,
    //         allow_promotion_codes: true,
    //         billing_address_collection: 'auto',
    // automatic_tax: { enabled: false },
    //         metadata: { cart: req.body },

    //         cancel_url:
    //           (process.env.NEXT_PUBLIC_SITE_URL
    //             ? process.env.NEXT_PUBLIC_SITE_URL
    //             : 'http://localhost:3000') + `/orderconfirmation?canceled=true`,
    //         success_url:
    //           (process.env.NEXT_PUBLIC_SITE_URL
    //             ? process.env.NEXT_PUBLIC_SITE_URL
    //             : 'http://localhost:3000') +
    //           `/account?success=true&session_id={CHECKOUT_SESSION_ID}`,

    //         // {CHECKOUT_SESSION_ID} is a string literal; do not change it! the actual Session ID is returned in the query parameter when your customer is redirected to the success page.  // go to account page after success
    //       })

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
