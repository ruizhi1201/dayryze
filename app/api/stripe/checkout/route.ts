import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan, utm } = await request.json()
  const planData = PLANS.pro // Only one paid plan

  // Build metadata including UTM params for ad attribution
  const metadata: Record<string, string> = {
    userId: user.id,
    plan,
    ...(utm || {}),
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: user.email,
    line_items: [
      {
        price: planData.priceId,
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  })

  return NextResponse.json({ url: session.url })
}
