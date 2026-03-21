import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    conversationsPerWeek: 10,
    personas: ['ray'],
  },
  growth: {
    name: 'Growth',
    price: 19,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    conversationsPerWeek: Infinity,
    personas: ['ray', 'sage', 'nova', 'ace'],
  },
  pro: {
    name: 'Pro',
    price: 49,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    conversationsPerWeek: Infinity,
    personas: ['ray', 'sage', 'nova', 'ace'],
  },
}
