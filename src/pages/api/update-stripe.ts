import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
// create separate endpoint for Customer / Price Updates

// /flows/trigger/:this-webhook-trigger-id

const updateStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('', JSON.stringify(req.body))
    const { event, payload, key, keys } = req.body

    try {
      switch (event) {
        case 'products.items.create':
          let product:any = {
            
            name: payload.name ?? 'NAME NOT SET',
            active: payload.status === 'active' ? true : false,
            description: payload.description ?? '',
            images: [
              `${process.env.NEXT_PUBLIC_ASSETS_URL}/${payload.images.create[0].directus_files_id.id}`,
            ],
          }

          // payload.prices
          //   ? (product = {
          //       ...product,
          //       ...{ default_price_data: [...payload.prices] },
          //     })
          //   : null

          product = await stripe.products.create(product)
          console.log('product -- ', product)


          // update stripeId into Product
          // create prices if there were prices associated
          if (payload.prices && product) {
            const price = await stripe.prices.create({
              unit_amount: payload.prices[0].unit_amount,
              currency: payload.prices[0].currency,
              // recurring: { interval: 'month' },
              product: product.id ?? 'prod_MdOV0ZLqD3hZYF',
            })
            console.log('price -- ', price)

          }

          break
        case 'items.update':
          break
        case 'items.delete':
          break
        default:
          throw new Error('Unhandled event. Check webhook.')
      }
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .send(
          'Webhook error: "Webhook handler failed. View logs."' +
            JSON.stringify(error)
        )
    }
  }

  // 'prices' in JSON.parse(req.body) ? console.log('prices upserted') : null

  return res.status(200).json({ received: true })
}

export default updateStripe

// create product
// {
//   "event": "items.create",
//   "accountability": {
//     "user": "eee90e7e-69c1-4824-8dbd-5cee8f279ad3",
//     "role": "bc0d61b1-ba8b-495f-a3fb-9db4c92b6668"
//   },
//   "payload": {
//     "name": "DEMO Product",
//     "type": "card",
// "prices": [
//   {
//     "currency": "aud",
//     "unit_amount": 123
//   }
// ]
//     "images": {
//       "create": [
//         {
//           "products_id": "+",
//           "directus_files_id": {
//             "id": "1ec15772-2bcc-498f-a63f-a2dc7ca3a44e"
//           }
//         },
//         {
//           "products_id": "+",
//           "directus_files_id": {
//             "id": "ddc12764-9313-4f4c-a422-0de80fb90071"
//           }
//         }
//       ],
//       "update": [],
//       "delete": []
//     }
//   },
//   "key": 14,
//   "collection": "products"
// }

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
