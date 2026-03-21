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
    .select('plan, conversations_this_week, week_reset_at, trial_ends_at')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.plan === 'growth' || profile?.plan === 'pro'
  const isOnTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()

  // Check weekly limit for free users
  if (!isPaid && !isOnTrial) {
    const weeklyLimit = 10
    const now = new Date()
    const weekReset = profile?.week_reset_at ? new Date(profile.week_reset_at) : new Date(0)
    const daysSinceReset = (now.getTime() - weekReset.getTime()) / (1000 * 60 * 60 * 24)

    // Reset weekly count if 7 days have passed
    if (daysSinceReset >= 7) {
      await supabase
        .from('profiles')
        .update({ conversations_this_week: 0, week_reset_at: now.toISOString() })
        .eq('id', user.id)
    } else if ((profile?.conversations_this_week || 0) >= weeklyLimit) {
      return NextResponse.json({
        error: 'Weekly limit reached',
        limitReached: true,
        upgradeUrl: '/pricing',
      }, { status: 429 })
    }
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

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: persona.systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    // Increment conversation count
    if (!isPaid && !isOnTrial) {
      await supabase
        .from('profiles')
        .update({ conversations_this_week: (profile?.conversations_this_week || 0) + 1 })
        .eq('id', user.id)
    }

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
