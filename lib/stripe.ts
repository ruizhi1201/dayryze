import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    sessionsPerMonth: 5,
    personas: ['ray'],
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    sessionsPerMonth: Infinity,
    personas: ['ray', 'sage', 'nova', 'ace'],
  },
}
