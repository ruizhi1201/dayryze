'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { personas, type PersonaId } from '@/lib/personas'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  persona_id: string
  title: string
  updated_at: string
}

function ChatPageInner() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('ray')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [lockedModal, setLockedModal] = useState<{ name: string; emoji: string; description: string; tagline: string } | null>(null)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserEmail(user.email || '')

      // Check onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, plan')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_completed) { router.push('/onboarding'); return }

      // If returning from Stripe success — force upgrade the plan directly
      let planStatus = profile?.plan
      if (searchParams.get('upgrade') === 'success') {
        // Update plan directly — webhook is backup, this ensures instant unlock
        await supabase
          .from('profiles')
          .update({ plan: 'pro', plan_updated_at: new Date().toISOString() })
          .eq('id', user.id)
        planStatus = 'pro'
        setUpgradeSuccess(true)
        router.replace('/chat')
      }

      const paid = planStatus === 'pro'
      setIsPaid(paid)

      // Load conversation history for paid users
      if (paid) {
        const res = await fetch('/api/conversations')
        const data = await res.json()
        setConversations(data.conversations || [])
      }

      // Trigger greeting on first load
      await sendGreeting('ray', paid)
    }
    init()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const currentPersona = personas.find(p => p.id === selectedPersona)!

  const sendGreeting = async (personaId: PersonaId, paid: boolean) => {
    setLoading(true)
    try {
      const res = await fetch('/api/chat/greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId }),
      })
      if (!res.ok) return

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let text = ''

      setMessages([{ role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value)
        setMessages([{ role: 'assistant', content: text }])
      }

      // Save greeting to DB for paid users
      if (paid && text) {
        const convRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona_id: personaId, title: 'New conversation' }),
        })
        const convData = await convRes.json()
        if (convData.conversation?.id) {
          setActiveConversationId(convData.conversation.id)
          await fetch(`/api/conversations/${convData.conversation.id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'assistant', content: text }] }),
          })
          const updatedConvs = await fetch('/api/conversations')
          setConversations((await updatedConvs.json()).conversations || [])
        }
      }
    } catch (err) {
      console.error('Greeting error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (conv: Conversation) => {
    setActiveConversationId(conv.id)
    setSelectedPersona(conv.persona_id as PersonaId)
    setShowHistory(false)

    const res = await fetch(`/api/conversations/${conv.id}/messages`)
    const data = await res.json()
    setMessages(data.messages || [])
  }

  const startNewChat = async () => {
    setMessages([])
    setActiveConversationId(null)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Create conversation if paid and no active one
    let convId = activeConversationId
    if (isPaid && !convId) {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona_id: selectedPersona,
          title: input.trim().slice(0, 60),
        }),
      })
      const data = await res.json()
      convId = data.conversation?.id || null
      setActiveConversationId(convId)
      if (convId) {
        setConversations(prev => [data.conversation, ...prev])
      }
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, personaId: selectedPersona }),
      })

      if (res.status === 429) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "You've reached your 5 sessions limit for this month. [Upgrade to Pro →](/pricing) to get unlimited sessions + persistent memory.",
        }])
        setLoading(false)
        return
      }

      if (!res.ok) throw new Error('Failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantMessage += decoder.decode(value)
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantMessage },
        ])
      }

      // Save to DB for paid users
      if (isPaid && convId) {
        const allMessages = [...newMessages, { role: 'assistant' as const, content: assistantMessage }]
        await fetch(`/api/conversations/${convId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages }),
        })
        // Refresh conversation list
        const convRes = await fetch('/api/conversations')
        const convData = await convRes.json()
        setConversations(convData.conversations || [])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <img src="/logo.png" alt="Dayryz" className="h-8 w-auto" />
          <p className="text-xs text-gray-400 mt-1">Every Dayryz is a new beginning.</p>
        </div>

        {/* Persona selector */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Choose your coach</p>
          <div className="space-y-2">
            {personas.map(persona => {
              const locked = !isPaid && persona.id !== 'ray'
              return (
                <button
                  key={persona.id}
                  onClick={() => {
                    if (locked) {
                      setLockedModal({ name: persona.name, emoji: persona.emoji, description: persona.description, tagline: persona.tagline })
                    } else {
                      setSelectedPersona(persona.id)
                      startNewChat()
                      sendGreeting(persona.id, isPaid)
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl transition ${
                    selectedPersona === persona.id ? 'bg-orange-50 border border-orange-200' :
                    locked ? 'opacity-60 cursor-pointer hover:bg-gray-50 border border-transparent' :
                    'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{persona.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${selectedPersona === persona.id ? 'text-orange-600' : 'text-gray-700'}`}>
                        {persona.name} {locked && '🔒'}
                      </p>
                      <p className="text-xs text-gray-400">{persona.tagline}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Conversation history (paid only) */}
        <div className="px-4 py-2 flex-1 overflow-y-auto">
          {isPaid && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">History</p>
                <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-orange-400">
                  {showHistory ? 'hide' : 'show'}
                </button>
              </div>
              {showHistory && (
                <div className="space-y-1">
                  {conversations.length === 0 && (
                    <p className="text-xs text-gray-300 italic">No past conversations yet</p>
                  )}
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition ${
                        activeConversationId === conv.id ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium truncate">{conv.title}</div>
                      <div className="text-gray-300 mt-0.5">{new Date(conv.updated_at).toLocaleDateString()}</div>
                    </button>
                  ))}
                </div>
              )}
              {!showHistory && !isPaid && (
                <div className="text-xs text-gray-300 italic px-1">
                  <Link href="/pricing" className="text-orange-400 hover:underline">Upgrade to Pro</Link> to unlock memory & history
                </div>
              )}
            </>
          )}
          {!isPaid && (
            <div className="mt-2 bg-orange-50 rounded-xl p-3 text-xs text-gray-500">
              <p className="font-semibold text-orange-500 mb-1">🔒 Memory locked</p>
              <p>Your coach forgets you after each session.</p>
              <Link href="/pricing" className="text-orange-500 font-medium hover:underline mt-1 block">Upgrade to Pro →</Link>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate mb-2">{userEmail}</p>
          <div className="flex gap-3">
            <Link href="/dashboard" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Account</Link>
            <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Upgrade success banner */}
        {upgradeSuccess && (
          <div className="bg-orange-500 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
            🎉 Welcome to Pro! All coaches and memory are now unlocked.
            <button onClick={() => setUpgradeSuccess(false)} className="ml-2 text-orange-200 hover:text-white">✕</button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentPersona.emoji}</span>
            <div>
              <h2 className="font-semibold text-gray-800">{currentPersona.name}</h2>
              <p className="text-xs text-gray-400">{currentPersona.description}</p>
            </div>
          </div>
          <button onClick={startNewChat} className="text-sm text-orange-500 hover:text-orange-600 font-medium transition">
            + New chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">{currentPersona.emoji}</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Hey, I&apos;m {currentPersona.name}</h3>
              <p className="text-gray-400 max-w-sm">{currentPersona.description}</p>
              <p className="text-gray-400 mt-2 text-sm">What&apos;s on your mind?</p>
              {isPaid && (
                <p className="text-xs text-orange-400 mt-3">✨ I remember you — this conversation will be saved</p>
              )}
              {!isPaid && (
                <p className="text-xs text-gray-300 mt-3">Session only — I won&apos;t remember this next time</p>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <span className="text-xl mr-2 mt-1 flex-shrink-0">{currentPersona.emoji}</span>
              )}
              <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm'
              }`}>
                {msg.content || (
                  <span className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-6 py-4">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${currentPersona.name}...`}
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-400 max-h-32"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl px-4 py-2 text-sm font-medium transition flex-shrink-0"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-gray-300 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      {/* Locked coach modal */}

      {lockedModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setLockedModal(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{lockedModal.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800">{lockedModal.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{lockedModal.tagline}</p>
            </div>
            <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
              {lockedModal.description}
            </p>
            <div className="bg-orange-50 rounded-2xl p-4 mb-6 text-center">
              <p className="text-sm text-orange-700 font-medium">🔒 Available on Pro plan</p>
              <p className="text-xs text-orange-500 mt-1">Unlock {lockedModal.name} + memory + unlimited sessions</p>
            </div>
            <Link
              href="/pricing"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-2xl font-semibold text-sm transition"
            >
              Upgrade to Pro — $19/mo →
            </Link>
            <button
              onClick={() => setLockedModal(null)}
              className="block w-full text-center text-gray-400 text-sm mt-3 hover:text-gray-600"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <ChatPageInner />
    </Suspense>
  )
}
