import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    // console.log('stripe checkout ->', req.body)
    const { cart, orderId } = req.body
    const { items } = cart
    // create a temp coupon if Voucher is used
    let coupon: any

    if (
      ((cart.totals.voucher > 0 && cart.options.voucher) ||
        cart.totals.discount > 0) &&
      cart.totals.net > 0
    ) {
      coupon = await stripe.coupons.create({
        name: `Used Discounts & Vouchers`,
        id: orderId,
        amount_off: cart.totals.voucher * 100 + cart.totals.discount * 100,
        currency: 'aud',
        // duration: 'forever',
      })
    }

    // console.log('coupon created ', JSON.stringify(coupon))

    // put all products into checkout session
    let line_items: any[] = []
    items.map((product: any) => {
      line_items = line_items.concat({ price: product.priceId, quantity: 1 })
    })

    // add extra product for Shipping
    if (cart.options.shipping.id != '') {
      line_items = line_items.concat({
        price: cart.options.shipping.priceId,
        quantity: 1,
      })
    }

    // create checkout session with info
    const session = await stripe.checkout.sessions.create({
      line_items: [...line_items],
      discounts:
        cart.totals.voucher > 0 || cart.totals.discount > 0
          ? [{ coupon: `${coupon.id}` }]
          : undefined,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {enabled: true},
      success_url: `${req.headers.origin}/order?id=${orderId}&status=true`,
      cancel_url: `${req.headers.origin}/order?id=${orderId}&status=false`,
      automatic_tax: { enabled: false }
    },)

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
