import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { CheckinEmail } from '@/lib/email/checkin'
import { NextResponse } from 'next/server'
import * as React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

// This endpoint sends weekly check-in emails to all paid users
// Trigger via cron job or manually — protected by CRON_SECRET
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Get all paid users who have completed onboarding
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, help_type, life_goals, plan')
    .eq('plan', 'pro')
    .eq('onboarding_completed', true)

  if (error || !users) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  const results = []

  for (const user of users) {
    try {
      const { data, error: sendError } = await resend.emails.send({
        from: 'Ray from Dayryz <coach@dayryz.com>',
        to: user.email,
        subject: 'Checking in on your progress 🌅',
        react: React.createElement(CheckinEmail, {
          userName: user.email,
          coachName: 'Ray',
          coachEmoji: '🌅',
          lifeGoal: user.life_goals || '',
          helpType: user.help_type || 'figuring_out',
        }),
      })

      if (sendError) {
        results.push({ email: user.email, status: 'failed', error: sendError.message })
      } else {
        results.push({ email: user.email, status: 'sent', id: data?.id })
      }
    } catch (err) {
      results.push({ email: user.email, status: 'error' })
    }
  }

  return NextResponse.json({ sent: results.length, results })
}

// Send a single test email — for preview/testing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const to = searchParams.get('to')

  if (!to) return NextResponse.json({ error: 'Missing ?to= param' }, { status: 400 })

  const { data, error } = await resend.emails.send({
    from: 'Ray from Dayryz <coach@dayryz.com>',
    to,
    subject: 'Checking in on your progress 🌅',
    react: React.createElement(CheckinEmail, {
      userName: to,
      coachName: 'Ray',
      coachEmoji: '🌅',
      lifeGoal: 'running my own business and working remotely',
      helpType: 'career_change',
    }),
  })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true, id: data?.id })
}
