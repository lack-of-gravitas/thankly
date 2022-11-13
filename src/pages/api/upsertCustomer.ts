import { NextApiRequest, NextApiResponse } from 'next'

const updateStock = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    let { stripeCustomer, orderId } = req.body

    try {
      console.log('upserting customer ...')

      // check if customer already exists

      let customer = await (
        await fetch(
          `https://thankly.fly.dev/users?fields=*&filter[email][_eq]==${stripeCustomer.email}`,
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
      customer = customer.data[0]

      if (
        customer &&
        customer != undefined &&
        Object.keys(customer).length > 0
      ) {
        // customer exists, just update order
      } else {
        // customer doesnt exist, create customer then update order
        customer = await fetch(`https://thankly.fly.dev/users`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS}`,
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            email: stripeCustomer.email,
            first_name: stripeCustomer.first_name,
            last_name: stripeCustomer.last_name,
            role: `32a2785c-037a-4b09-bd9a-c29ec2ae9de3`,
          }),
        })
        customer = customer.data[0]
      }

      let order = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/orders/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS}`,
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            customer: customer.id,
          }),
        }
      )

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
