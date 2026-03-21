'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  email: string
  plan: string
  conversations_this_week: number
  trial_ends_at: string | null
  referral_code: string
  created_at: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpgrade = async (plan: string) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const referralLink = profile?.referral_code
    ? `${window.location.origin}/signup?ref=${profile.referral_code}`
    : ''

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Referral link copied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  const isPaid = profile?.plan === 'growth' || profile?.plan === 'pro'
  const weeklyLimit = 10
  const used = profile?.conversations_this_week || 0
  const remaining = Math.max(0, weeklyLimit - used)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/chat" className="text-xl font-bold text-orange-500">🌅 Dayryze</Link>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="text-sm text-orange-500 font-medium hover:text-orange-600">
            → Go to chat
          </Link>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Account</h1>
          <p className="text-gray-400 text-sm mt-1">{profile?.email}</p>
        </div>

        {/* Plan card */}
        <div className={`rounded-2xl p-6 ${isPaid ? 'bg-orange-500 text-white' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isPaid ? 'text-orange-100' : 'text-gray-400'}`}>Current plan</p>
              <h2 className={`text-2xl font-bold mt-1 capitalize ${isPaid ? 'text-white' : 'text-gray-800'}`}>
                {profile?.plan || 'Free'}
                {profile?.plan === 'growth' && ' — $19/mo'}
                {profile?.plan === 'pro' && ' — $49/mo'}
              </h2>
            </div>
            {!isPaid && (
              <span className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">Free tier</span>
            )}
            {isPaid && (
              <span className="bg-white text-orange-500 text-xs font-bold px-3 py-1 rounded-full">Active</span>
            )}
          </div>

          {!isPaid && (
            <>
              {/* Usage bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Conversations this week</span>
                  <span>{used} / {weeklyLimit}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (used / weeklyLimit) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{remaining} conversations remaining this week</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleUpgrade('growth')}
                  className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Upgrade to Growth — $19/mo
                </button>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
                >
                  Go Pro — $49/mo
                </button>
              </div>
            </>
          )}

          {isPaid && (
            <p className={`text-sm ${isPaid ? 'text-orange-100' : 'text-gray-400'}`}>
              Unlimited conversations · All 4 AI coaches unlocked
            </p>
          )}
        </div>

        {/* Trial notice */}
        {profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date() && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-green-700 font-semibold text-sm">🎁 Free Pro trial active</p>
            <p className="text-green-600 text-sm mt-1">
              Your trial ends on {new Date(profile.trial_ends_at).toLocaleDateString()}. Enjoy all Pro features!
            </p>
          </div>
        )}

        {/* Referral */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-1">🎁 Refer a friend</h3>
          <p className="text-sm text-gray-400 mb-4">
            Share your link — both of you get <strong>7 days of Pro free</strong> when they sign up.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none"
            />
            <button
              onClick={copyReferral}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">Account details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="text-gray-700">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Member since</span>
              <span className="text-gray-700">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Plan</span>
              <span className="text-gray-700 capitalize">{profile?.plan || 'Free'}</span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="text-center pt-4">
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Sign out of Dayryze
          </button>
        </div>

      </div>
    </div>
  )
}
