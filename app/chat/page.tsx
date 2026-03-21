'use client'

import { useState, useRef, useEffect } from 'react'
import { personas, type PersonaId } from '@/lib/personas'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('ray')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')

      // Check if onboarding is done — redirect if not
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_completed) {
        router.push('/onboarding')
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const currentPersona = personas.find(p => p.id === selectedPersona)!

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          personaId: selectedPersona,
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')

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
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const startNewChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-orange-500">🌅 Dayryz</h1>
          <p className="text-xs text-gray-400 mt-1">Your career coach</p>
        </div>

        {/* Persona selector */}
        <div className="p-4 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Choose your coach</p>
          <div className="space-y-2">
            {personas.map(persona => (
              <button
                key={persona.id}
                onClick={() => {
                  setSelectedPersona(persona.id)
                  startNewChat()
                }}
                className={`w-full text-left p-3 rounded-xl transition ${
                  selectedPersona === persona.id
                    ? 'bg-orange-50 border border-orange-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{persona.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${selectedPersona === persona.id ? 'text-orange-600' : 'text-gray-700'}`}>
                      {persona.name}
                    </p>
                    <p className="text-xs text-gray-400">{persona.tagline}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate mb-2">{userEmail}</p>
          <div className="flex gap-3">
            <Link href="/dashboard" className="text-xs text-orange-500 hover:text-orange-600 transition font-medium">
              Account
            </Link>
            <button
              onClick={handleSignOut}
              className="text-xs text-gray-400 hover:text-gray-600 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentPersona.emoji}</span>
            <div>
              <h2 className="font-semibold text-gray-800">{currentPersona.name}</h2>
              <p className="text-xs text-gray-400">{currentPersona.description}</p>
            </div>
          </div>
          <button
            onClick={startNewChat}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition"
          >
            + New chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">{currentPersona.emoji}</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Hey, I&apos;m {currentPersona.name}
              </h3>
              <p className="text-gray-400 max-w-sm">{currentPersona.description}</p>
              <p className="text-gray-400 mt-2 text-sm">What&apos;s on your mind?</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <span className="text-xl mr-2 mt-1 flex-shrink-0">{currentPersona.emoji}</span>
              )}
              <div
                className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}
              >
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
    </div>
  )
}
