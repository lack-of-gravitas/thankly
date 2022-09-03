import Stripe from 'stripe'

export interface Customer {
  id: string /* primary key */
  stripe_customer_id?: string
}

export interface UserDetails {
  id: string /* primary key */
  first_name: string
  last_name: string
  full_name?: string
  avatar_url?: string
  billing_address?: Stripe.Address
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type]
}

export interface Purchase {
  id: string /* primary key */ // subscription id or payment intent from stripe
  status: string
  user_id: string
  mode: string //Stripe.Checkout.Session.Mode
  // price_id?: string /* foreign key to prices.id */
  // prices?: Price

  created?: Date | null;
  current_period_start?: Date | null;
  current_period_end?: Date | null;
  ended_at?: Date | null;
  cancel_at?: Date | null;
  canceled_at?: Date | null;
  cancel_at_period_end?: boolean;

  metadata?: Stripe.Metadata
}

export interface Product {
  id: string /* primary key */
  active?: boolean
  name?: string
  description?: string
  image?: string
  metadata?: Stripe.Metadata
  category?: string
}

export interface Price {
  id: string /* primary key */
  product_id?: string /* foreign key to products.id */
  active?: boolean
  description?: string
  unit_amount?: number
  currency?: string
  type?: string
  interval?: Stripe.Price.Recurring.Interval
  interval_count?: number
  trial_period_days?: number | null
  metadata?: Stripe.Metadata
  product?: Product
}

export interface ProductWithPrice extends Product {
  prices?: Price[]
}
