import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

const deleteOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    console.log('deleteOrder req >', req)
    let id: any = req.body

    try {
      console.log('deleting order..')

      await (
        await fetch(`${process.env.NEXT_PUBLIC_REST_API}/orders/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS}`,
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
        })
      ).json()
      // console.log ('deleteOrder data > ', data)

      return res.status(200).json(id)
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default deleteOrder
