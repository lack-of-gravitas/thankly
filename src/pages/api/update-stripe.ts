import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'

const updateStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log(req.body)
const data = req.body

console.log("Prices: ", data.prices);
console.log("Name: ", data.name);
console.log("Type: ", data.type);
    // update quantity, update main image, name, description, pricing
    // 'prices' in JSON.parse(req.body) ? console.log('prices upserted') : null

    // check what was updated & call relevant Stripe API

    return res.status(200).json({ message: 'Hello from Next.js!' })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default updateStripe

// create new product
// req-> [Object: null prototype]
// {
//     "name": "DEMO New Upsert",
//     "type": "card",
//     "images": {
//       "create": [
//         {
//           "products_id": " ",
//           "directus_files_id": {
//             "id": "ddc12764-9313-4f4c-a422-0de80fb90071"
//           }
//         }
//       ],
//       "update": [],
//       "delete": []
//     },
//     "stockQty": 3,
//     "description": "This is an awesome card",
//     "brand": "Thankly",
//     "status": "active"
//   }

// add image
// req-> [Object: null prototype] {
//     '"{"images":{"create":[{"products_id":"12","directus_files_id":{"id":"5be8ed7b-4000-409d-885f-599c532e97ea"}}],"update":[],"delete":[]}}"': ''
//   }

// update existing field
// req-> [Object: null prototype] { '"{"name":"DEMO UpsertStripe"}"': '' }

// create price(s)
// req-> [Object: null prototype] {
//     '"{"prices":[{"active":true,"currency":"USD","unit_amount":1234}]}"': ''
//   }

// update price(s)
// req-> [Object: null prototype] {
//     '"{"prices":[{"active":true,"currency":"AUD","unit_amount":12.35}]}"': ''
//   }
