import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
// import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
// import { createOrRetrieveCustomer } from '@/lib/supabase-admin'

// API called via Directus / Supabase and receives Price / Product Data which is used to create Stripe Product / Price and then return stripeId to update Directus / Supabase

const updateStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('req->', req.body)

    return res.status(200)
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default updateStripe
