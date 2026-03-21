import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — load messages for a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: messages } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('conversation_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ messages: messages || [] })
}

// POST — save messages to a conversation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, title } = await request.json()

  // Save messages
  const rows = messages.map((m: { role: string; content: string }) => ({
    conversation_id: id,
    user_id: user.id,
    role: m.role,
    content: m.content,
  }))

  await supabase.from('messages').insert(rows)

  // Update conversation title and timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString(), ...(title ? { title } : {}) })
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
