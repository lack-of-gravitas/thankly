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
    const { cart } = req.body
    const { items, sender } = cart
    // create a temp coupon if Voucher is used
    let coupon: any

    if (
      ((cart.totals.voucher > 0 && cart.options.voucher) ||
        cart.totals.discount > 0) &&
      cart.totals.net > 0
    ) {
      coupon = await stripe.coupons.create({
        name: `Used Discounts & Vouchers`,
        id: cart.id,
        amount_off: cart.totals.voucher * 100 + cart.totals.discount * 100,
        currency: 'aud',
      })
    }

    let customer: any

    if (cart.customerId === '') {
      // no customer in cart, search for customer and create one if not existing
      let { data } = await stripe.customers.search({
        query: `email:"${sender.email}"`,
      })
      console.log('customer stripeData >', data)

      data.length > 0
        ? (customer = data[0])
        : (customer = await stripe.customers.create({
            email: sender.email,
            name: sender.name,
          }))
    }
    
    console.log('customer >', customer)


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
      customer: customer ? customer.id : cart.customerId, //sender.email ?? '',
      // customer_creation: 'always',
      // phone_number_collection: { enabled: true },
      client_reference_id: cart.id,
      success_url: `${req.headers.origin}/order?id=${cart.id}&status=true`,
      cancel_url: `${req.headers.origin}/order?id=${cart.id}&status=false`,
      automatic_tax: { enabled: false },
    })

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
