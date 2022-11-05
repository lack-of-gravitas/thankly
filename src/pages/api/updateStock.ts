import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'


const updateStock = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    let coupon: any = req.body

    try {
      console.log('deleting coupon..')

      let deleted: any
      if (coupon != undefined && coupon != '') {
        deleted = await stripe.coupons.del(coupon)
      }

      return res.status(200).json(deleted)
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default updateStock
