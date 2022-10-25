import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { postData } from '@/lib/api-helpers'
import { v4 as uuidv4 } from 'uuid'

// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    console.log('getOrder ->', req.body)
    let results: any
    let order: any = {}
    const { id } = req.body

    try {
      // create order
      console.log('getting order...')

      order = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/orders?fields=*&filter[id][_eq]=${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.DIRECTUS}`,
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
          }
        )
      ).json()
      // TODO: ERROR HANDLING IF NO ORDER RETURNED
      return res.status(200).json({ ...order.data[0] })
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default getOrder
