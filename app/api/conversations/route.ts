import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — list conversations for the user (paid only)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    return NextResponse.json({ conversations: [], locked: true })
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, persona_id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ conversations: conversations || [] })
}

// POST — create a new conversation (paid only)
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    return NextResponse.json({ error: 'Paid plan required' }, { status: 403 })
  }

  const { persona_id, title } = await request.json()

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, persona_id, title: title || 'New conversation' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ conversation })
}
