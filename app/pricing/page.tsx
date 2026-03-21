'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started and explore',
    features: [
      '5 sessions per month',
      'Structured onboarding — AI knows you from day one',
      'Career change guidance',
      'Basic action plans',
    ],
    cta: 'Get started free',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    description: 'For serious career changers',
    features: [
      'Unlimited sessions',
      'Persistent memory — AI remembers you across sessions',
      'All 4 AI coaches (Ray, Sage, Nova, Ace)',
      'Career change + startup + life redesign',
      'Weekly accountability check-ins',
      'Conversation history',
    ],
    cta: 'Start Pro plan',
    highlight: true,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      router.push('/signup')
      return
    }

    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })

      if (res.status === 401) {
        router.push('/signup')
        return
      }

      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Nav */}
      <nav className="px-8 py-5 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-orange-500">🌅 Dayryz</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/login" className="text-gray-500 hover:text-gray-700">Sign in</Link>
          <Link href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600">Get started</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center pt-16 pb-12 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Simple, honest pricing</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">Start free. Upgrade when you&apos;re ready to go all in on your career change.</p>
      </div>

      {/* Plans */}
      <div className="max-w-3xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`rounded-2xl p-8 ${
              plan.highlight
                ? 'bg-orange-500 text-white shadow-xl scale-105'
                : 'bg-white text-gray-800 shadow-sm border border-gray-100'
            }`}
          >
            {plan.highlight && (
              <div className="text-xs font-bold uppercase tracking-wider bg-white text-orange-500 inline-block px-3 py-1 rounded-full mb-4">
                Most popular
              </div>
            )}
            <h2 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-800'}`}>
              {plan.name}
            </h2>
            <p className={`text-sm mb-4 ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>
              {plan.description}
            </p>
            <div className="mb-6">
              <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-800'}`}>
                ${plan.price}
              </span>
              {plan.price > 0 && (
                <span className={`text-sm ml-1 ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>/month</span>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={plan.highlight ? 'text-white' : 'text-orange-500'}>✓</span>
                  <span className={plan.highlight ? 'text-orange-50' : 'text-gray-600'}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading === plan.id}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50 ${
                plan.highlight
                  ? 'bg-white text-orange-500 hover:bg-orange-50'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {loading === plan.id ? 'Loading...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Referral note */}
      <div className="text-center pb-16 text-gray-400 text-sm">
        🎁 Refer a friend → both of you get 7 days of Pro free
      </div>
    </div>
  )
}
