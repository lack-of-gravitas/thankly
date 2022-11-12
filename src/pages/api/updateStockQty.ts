import { NextApiRequest, NextApiResponse } from 'next'

const updateStock = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    let { items } = req.body
    console.log('updating stock ...')

    try {
      console.log('updating stock ...')
      items?.map(async (product: any) => {
        // get current stock for product

        let data = await (
          await fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/products` +
              `?fields=stockQty` +
              `&filter[id][_eq]=${product.products_id}` + 
              `&filter[live][_eq]=true` // TODO: REMOVE IN PROD
          )
        ).json()
        data = data.data[0]

        await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/products/` + product.products_id,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${process.env.DIRECTUS}`,
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              stockQty: data.stockQty * 1 - product.qty,
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
