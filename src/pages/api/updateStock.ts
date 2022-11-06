import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

const updateStock = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    let { items } = req.body

    try {
      console.log('updating stock ...')
      items?.map(async (product: any) => {
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
              stockQty: product.stockQty * 1 - 1,
            }),
          }
        )
      })

      return res.status(200).json({ status: `done` })
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
