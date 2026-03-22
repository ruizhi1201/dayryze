'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const steps = [
  {
    id: 'help_type',
    question: "What brings you to Dayryz?",
    subtitle: "Pick the one that fits best.",
    type: 'choice',
    options: [
      { value: 'career_change', label: '🔄 Change careers', desc: 'Find a new path that fits me' },
      { value: 'startup', label: '🚀 Start a business', desc: 'Turn an idea into something real' },
      { value: 'life_redesign', label: '🌿 Redesign my life', desc: 'My work no longer fits who I am' },
      { value: 'figuring_out', label: '🤔 Not sure yet', desc: 'I just know something needs to change' },
    ],
  },
  {
    id: 'current_job',
    question: "What do you do right now?",
    subtitle: "Brief is fine — just enough for your coach to know where you're starting from.",
    type: 'text',
    placeholder: 'e.g. Marketing manager at a tech company, 6 years experience',
  },
  {
    id: 'values',
    question: "What matters most to you in work?",
    subtitle: "Pick up to 3.",
    type: 'multi',
    options: [
      { value: 'autonomy', label: '🗽 Autonomy', desc: 'Flexible, own boss' },
      { value: 'impact', label: '💡 Impact', desc: 'Work that means something' },
      { value: 'income', label: '💰 Income', desc: 'Financial growth' },
      { value: 'creativity', label: '🎨 Creativity', desc: 'Making things, new ideas' },
      { value: 'stability', label: '⚓ Stability', desc: 'Predictable, reliable' },
      { value: 'balance', label: '⚖️ Balance', desc: 'Life outside work' },
    ],
  },
  {
    id: 'life_goals',
    question: "Where do you want to be in 3 years?",
    subtitle: "Dream a little — your coach will use this as your north star.",
    type: 'text',
    placeholder: 'e.g. Running my own business, working remotely, making $150k...',
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // If already completed onboarding, go straight to chat
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push('/chat')
        return
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  const progress = ((currentStep) / steps.length) * 100

  const currentAnswer = answers[step.id]
  const canContinue = step.type === 'multi'
    ? (currentAnswer as string[] || []).length > 0
    : !!currentAnswer

  const handleChoice = (value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }))
  }

  const handleMulti = (value: string) => {
    const current = (answers[step.id] as string[]) || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : current.length < 3 ? [...current, value] : current
    setAnswers(prev => ({ ...prev, [step.id]: updated }))
  }

  const handleText = (value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }))
  }

  const handleNext = async () => {
    if (!canContinue) return

    if (!isLast) {
      setCurrentStep(prev => prev + 1)
      return
    }

    // Last step — save directly via client Supabase (most reliable)
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const valuesArr = answers['values'] as string[]
      const payload = {
        help_type: answers['help_type'] as string,
        current_job: answers['current_job'] as string,
        work_values: Array.isArray(valuesArr) ? valuesArr.join(', ') : valuesArr,
        life_goals: answers['life_goals'] as string,
        onboarding_completed: true,
      }

      // Upsert — works whether or not the profile row exists
      const { error: saveError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          help_type: payload.help_type,
          current_job: payload.current_job,
          work_values: payload.work_values,
          life_goals: payload.life_goals,
          onboarding_completed: true,
        }, { onConflict: 'id' })

      if (saveError) {
        alert(`Save error: ${saveError.message}`)
        return
      }

      router.push('/chat')
    } catch (err) {
      console.error(err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <img src="/logo.png" alt="Dayryz" className="h-8 w-auto" />
        <div className="text-sm text-gray-400">{currentStep + 1} of {steps.length}</div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{step.question}</h1>
          <p className="text-gray-400 text-sm mb-8">{step.subtitle}</p>

          {/* Choice */}
          {step.type === 'choice' && (
            <div className="space-y-3">
              {step.options!.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleChoice(opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                    currentAnswer === opt.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-orange-200'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Multi-select */}
          {step.type === 'multi' && (
            <div className="grid grid-cols-2 gap-3">
              {step.options!.map(opt => {
                const selected = ((currentAnswer as string[]) || []).includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleMulti(opt.value)}
                    className={`text-left p-4 rounded-2xl border-2 transition ${
                      selected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-100 bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                  </button>
                )
              })}
              <p className="col-span-2 text-xs text-gray-400 text-center mt-1">
                {((currentAnswer as string[]) || []).length}/3 selected
              </p>
            </div>
          )}

          {/* Text input */}
          {step.type === 'text' && (
            <textarea
              value={(currentAnswer as string) || ''}
              onChange={(e) => handleText(e.target.value)}
              placeholder={step.placeholder}
              rows={3}
              className="w-full bg-white border-2 border-gray-100 focus:border-orange-400 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-300 outline-none resize-none transition text-sm"
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`text-sm text-gray-400 hover:text-gray-600 transition ${currentStep === 0 ? 'invisible' : ''}`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canContinue || loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-8 py-3 rounded-2xl font-semibold text-sm transition"
            >
              {loading ? 'Saving...' : isLast ? 'Start my coaching →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
