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
    .select('current_job, work_values, life_goals, help_type, plan')
    .eq('id', user.id)
    .single()

  const persona = getPersona(personaId as PersonaId)

  const helpLabels: Record<string, string> = {
    career_change: 'changing careers',
    startup: 'starting a business',
    life_redesign: 'redesigning their life',
    figuring_out: 'figuring out what they want',
  }

  const greetingPrompt = `${persona.systemPrompt}

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

Keep it under 100 words. Make them feel like you actually read their answers and you're genuinely interested in helping them.`

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
