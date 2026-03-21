import { createClient } from '@/lib/supabase/server'
import { getPersona, type PersonaId } from '@/lib/personas'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { personaId } = await request.json()

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_job, work_values, life_goals, help_type, plan, last_conversation_at')
    .eq('id', user.id)
    .single()

  // Update last_conversation_at
  await supabase
    .from('profiles')
    .update({ last_conversation_at: new Date().toISOString() })
    .eq('id', user.id)

  const persona = getPersona(personaId as PersonaId)

  const helpLabels: Record<string, string> = {
    career_change: 'changing careers',
    startup: 'starting a business',
    life_redesign: 'redesigning their life',
    figuring_out: 'figuring out what they want',
  }

  // Check if returning user (3+ days since last conversation)
  const lastConvo = profile?.last_conversation_at ? new Date(profile.last_conversation_at) : null
  const daysSinceLastConvo = lastConvo
    ? (Date.now() - lastConvo.getTime()) / (1000 * 60 * 60 * 24)
    : null
  const isReturning = daysSinceLastConvo !== null && daysSinceLastConvo >= 3

  const greetingPrompt = isReturning
    ? `${persona.systemPrompt}

This user is returning after ${Math.floor(daysSinceLastConvo!)} days away. Here's their profile:
- What they're working on: ${helpLabels[profile?.help_type || ''] || 'finding direction'}
- Current role: ${profile?.current_job || 'not specified'}
- 3-year vision: ${profile?.life_goals || 'not specified'}

Write a warm returning-user greeting as ${persona.name}. In your own voice:
- Acknowledge they've been away for a few days (casually, not dramatically)
- Reference their goal or what they were working on
- Ask how it's been going — did anything happen or shift since last time?
- Make it feel like a real coach checking in, not an automated message

Keep it under 80 words. Warm and genuine.`
    : `${persona.systemPrompt}

The user just completed their onboarding. Here's what they shared:
- What they need help with: ${helpLabels[profile?.help_type || ''] || 'finding direction'}
- Current role: ${profile?.current_job || 'not specified'}
- Values: ${profile?.work_values || 'not specified'}
- 3-year vision: ${profile?.life_goals || 'not specified'}

Write a warm, personalized opening message as ${persona.name}. Do NOT say "Hello" or "Hi" generically.
- Introduce yourself briefly in your unique voice (1 sentence)
- Acknowledge 1-2 specific things from their profile that stand out to you
- Share a quick insight or observation based on what they said
- End with ONE focused question to kick off the conversation

Keep it under 100 words. Make them feel like you actually read their answers.`

  const stream = await openai.chat.completions.create({
    model: profile?.plan === 'pro' ? 'gpt-4o' : 'gpt-4o-mini',
    stream: true,
    messages: [{ role: 'system', content: greetingPrompt }],
    max_tokens: 200,
    temperature: 0.9,
  })

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
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  })
}
