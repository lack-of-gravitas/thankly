import { NextApiRequest, NextApiResponse } from 'next'

const updateStock = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    let { customer,orderId } = req.body

    try {
      console.log('upserting customer ...')


// create or update customer




      // // create customer move this to Order Confirmation Page
      // if (cart.options.createAccount === true) {
      //   // create customer record
      //   console.log(`${process.env.VERCEL_URL}/users`)
      //   customer = await fetch(`${process.env.VERCEL_URL}/users`, {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${process.env.DIRECTUS}`,
      //       'Content-Type': 'application/json',
      //     },
      //     credentials: 'same-origin',
      //     body: JSON.stringify({
      //       first_name: '',
      //       last_name: '',
      //       email: '',
      //       // password: '',
      //       role: '32a2785c-037a-4b09-bd9a-c29ec2ae9de3',
      //     }),
      //   })
      //   console.log('customer created -- ', customer.id)

      //   results = await fetch(
      //     `${process.env.NEXT_PUBLIC_REST_API}/orders/${order.id}`,
      //     {
      //       method: 'PATCH',
      //       headers: {
      //         Authorization: `Bearer ${process.env.DIRECTUS}`,
      //         'Content-Type': 'application/json',
      //       },
      //       credentials: 'same-origin',
      //       body: JSON.stringify({ customer: customer.id }),
      //     }
      //   )
      // }

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
