import { NextApiRequest, NextApiResponse } from 'next'


const updateStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('req->', req)
    console.log('res->', res)
    
     // DO SOME STUFF HERE LATER
     // I DID SOME STUFF HERE YOU DONT CARE ABOUT SO SET 200

    return res.status(200).json({ message: 'Hello from Next.js!' })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default updateStripe
