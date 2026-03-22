import { createClient } from '@/lib/supabase/server'
import { getPersona, type PersonaId } from '@/lib/personas'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Load user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, conversations_this_week, week_reset_at, trial_ends_at, onboarding_completed, current_job, years_experience, top_skills, work_values, risk_tolerance, life_goals, help_type, daily_messages, daily_messages_reset_at')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.plan === 'pro'
  const isOnTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()

  // Check monthly limit for free users (5 sessions/month)
  if (!isPaid && !isOnTrial) {
    const monthlyLimit = 5
    const now = new Date()
    const weekReset = profile?.week_reset_at ? new Date(profile.week_reset_at) : new Date(0)
    const daysSinceReset = (now.getTime() - weekReset.getTime()) / (1000 * 60 * 60 * 24)

    // Reset monthly count if 30 days have passed
    if (daysSinceReset >= 30) {
      await supabase
        .from('profiles')
        .update({ conversations_this_week: 0, week_reset_at: now.toISOString() })
        .eq('id', user.id)
    } else if ((profile?.conversations_this_week || 0) >= monthlyLimit) {
      return NextResponse.json({
        error: 'Monthly limit reached',
        limitReached: true,
        upgradeUrl: '/pricing',
      }, { status: 429 })
    }
  }

  // ── Daily token cost cap (max $1/user/day) ──────────────────────────────────
  // gpt-4o (paid): ~$0.015/msg → cap at 50 msgs/day
  // gpt-4o-mini (free): ~$0.0003/msg → cap at 100 msgs/day
  const now = new Date()
  const dailyResetAt = profile?.daily_messages_reset_at ? new Date(profile.daily_messages_reset_at) : new Date(0)
  const hoursSinceReset = (now.getTime() - dailyResetAt.getTime()) / (1000 * 60 * 60)
  const dailyMessages = hoursSinceReset >= 24 ? 0 : (profile?.daily_messages || 0)
  // gpt-4o (paid): ~$0.015/msg × 100 = ~$1.50/day max — generous for paying users
  // gpt-4o-mini (free): ~$0.0003/msg × 20 = ~$0.006/day — free users already capped at 5 sessions/month anyway
  const dailyLimit = isPaid ? 100 : 20

  if (dailyMessages >= dailyLimit) {
    return NextResponse.json({
      error: 'Daily message limit reached. Come back tomorrow — your coach will be here! 🌅',
      dailyLimitReached: true,
    }, { status: 429 })
  }

  const { messages, personaId } = await request.json()

  // Enforce persona access — free users only get Ray
  if (!isPaid && !isOnTrial && personaId !== 'ray') {
    return NextResponse.json({
      error: 'Upgrade required for this coach',
      upgradeRequired: true,
    }, { status: 403 })
  }

  const persona = getPersona(personaId as PersonaId)

  // Build user profile context — available to all users (free: session only, paid: persisted)
  let profileContext = ''
  if (profile?.onboarding_completed) {
    const riskLabels: Record<string, string> = { low: 'prefers stability and gradual change', medium: 'open to calculated risks with a plan', high: 'ready to take bold leaps' }
    profileContext = `
## About this user (from their onboarding profile):
- **What they need help with:** ${profile.help_type?.replace('_', ' ') || 'not specified'}
- **Current role:** ${profile.current_job || 'not specified'}
- **Years of experience:** ${profile.years_experience || 'not specified'}
- **Top skills & strengths:** ${profile.top_skills || 'not specified'}
- **What they value most in work:** ${profile.work_values || 'not specified'}
- **Risk tolerance:** ${riskLabels[profile.risk_tolerance] || profile.risk_tolerance || 'not specified'}
- **Their ideal life / 3-year vision:** ${profile.life_goals || 'not specified'}

Use this context naturally throughout the conversation. Don't robotically recite it — weave it in as a coach who already knows this person well.${!isPaid ? '\n\nNote: This is a free user. Their profile was set up for this session only.' : ''}
`
  }

  const systemPrompt = profileContext
    ? `${persona.systemPrompt}\n\n${profileContext}`
    : persona.systemPrompt

  // Use better model for paid users
  const model = isPaid ? 'gpt-4o' : 'gpt-4o-mini'

  try {
    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    // Update usage count and last_conversation_at
    const updates: Record<string, unknown> = {
      last_conversation_at: new Date().toISOString(),
      daily_messages: dailyMessages + 1,
      ...(hoursSinceReset >= 24 && { daily_messages_reset_at: new Date().toISOString() }),
    }
    if (!isPaid && !isOnTrial) {
      updates.conversations_this_week = (profile?.conversations_this_week || 0) + 1
    }
    await supabase.from('profiles').update(updates).eq('id', user.id)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
