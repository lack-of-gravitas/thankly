import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { postData } from '@/lib/api-helpers'
import { v4 as uuidv4 } from 'uuid'

const createStripeProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('createOrder ->', req.body)
    let results: any
    let product: Stripe.Product
    const { cart, status } = req.body

    try {
      console.log('req.body --', req.body)

      return res.status(200).json({ pass: true })
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default createStripeProduct
