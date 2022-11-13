import { NextApiRequest, NextApiResponse } from 'next'

const updateVoucher = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    let { cart } = req.body
    let voucher = cart.options.voucher

    try {
      let used = cart.totals.voucher * 1
      let data = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/vouchers/${voucher.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS}`,
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            used: voucher.used * 1 + used * 1,
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

export default updateVoucher
