import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
// create separate endpoint for Customer / Price Updates

const updateStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log(JSON.stringify(req.body))
    // const { event, payload, key, keys } = req.body

    // try {
    //   switch (event) {
    //     case 'items.create':
    //         const product = await stripe.products.create ({
    //             name: payload.name ?? 'NAME NOT SET',
    //             active: payload.status === 'active' ? true: false,
    //             description: payload.description ?? '',
    //             images: [payload.images.create[0]]
    //             metadata: key
    //         })
    //       break
    //     case 'items.update':
    //       break
    //     case 'items.delete':
    //       break
    //     default:
    //       throw new Error('Unhandled event. Check webhook.')
    //   }
    // } catch (error) {
    //   console.log(error)
    //   return res
    //     .status(400)
    //     .send(
    //       'Webhook error: "Webhook handler failed. View logs."' +
    //         JSON.stringify(error)
    //     )
    // }
  }

  // 'prices' in JSON.parse(req.body) ? console.log('prices upserted') : null

  return res.status(200).json({ received: true })
}

export default updateStripe

// create product
// {
//     event: 'items.create',
//     accountability: {
//       user: 'eee90e7e-69c1-4824-8dbd-5cee8f279ad3',
//       role: 'bc0d61b1-ba8b-495f-a3fb-9db4c92b6668'
//     },
//     payload: {
//       name: 'DEMO Stripe Product',
//       type: 'card',
//       images: { create: [Array], update: [], delete: [] },
//       prices: [ [Object] ],
//       description: 'test description',
//       stockQty: 5,
//       brand: 'Thankly',
//       status: 'active'
//     },
//     key: 13,
//     collection: 'products'
//   }

// batch edit products (chaneg to gift)
// {
//     event: 'items.update',
//     accountability: {
//       user: 'eee90e7e-69c1-4824-8dbd-5cee8f279ad3',
//       role: 'bc0d61b1-ba8b-495f-a3fb-9db4c92b6668'
//     },
//     payload: { type: 'gift' },
//     keys: [ 10, 13, 9 ],
//     collection: 'products'
//   }

// delete product
// {
//     event: 'items.delete',
//     accountability: {
//       user: 'eee90e7e-69c1-4824-8dbd-5cee8f279ad3',
//       role: 'bc0d61b1-ba8b-495f-a3fb-9db4c92b6668'
//     },
//     payload: [ 13 ],
//     keys: [ 13 ],
//     collection: 'products'
//   }
