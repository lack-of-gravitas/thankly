import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { postData } from '@/lib/api-helpers'
import { v4 as uuidv4 } from 'uuid'

const createStripeProduct = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    // console.log('createStripeProduct ->', req.body)
    let results: any
    let product: any
    let price: Stripe.Price

    // Supabase Webhooks ftw https://supabase.com/docs/guides/database/webhooks
    try {
      if (req.body.type === 'INSERT') {
        // create product
        product = req.body.record
        console.log('creating product...')
        // req.body -- {  type: 'INSERT',  table: 'products',  record: {    id: 'test12314',    name: 'test',    tags: null,    type: 'gift',    brand: null,    status: true,    priceId: null,    currency: 'AUD',    featured: false,    stockQty: 0,    description: 'test',    unit_amount: 0,    date_created: '2022-10-31T10:27:16.785+00:00',    date_updated: null  },  schema: 'public',  old_record: null}

        results = await stripe.products.create({
          id: product.id,
          name: product.name,
          description: product.description,
          images: [product.image],
          default_price_data: {
            currency: 'aud',
            unit_amount: product.unit_amount,
          },
        })

        console.log('product.created results', results)
      }

      if (req.body.type === 'DELETE') {
        console.log('archiving product...')
        product = req.body.old_record
        results = await stripe.products.update(product.id, { active: false })
      }

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

// req.body -- {  type: 'DELETE',  table: 'products',  record: null,  schema: 'public',  old_record: {    id: 'test12314',    name: 'test',    tags: null,    type: 'gift',    brand: null,    status: true,    priceId: null,    currency: 'AUD',    featured: false,    stockQty: 0,    description: 'test',    unit_amount: 0,    date_created: '2022-10-31T10:27:16.785+00:00',    date_updated: null  }}
