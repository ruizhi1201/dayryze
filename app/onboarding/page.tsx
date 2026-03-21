'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const steps = [
  {
    id: 'help_type',
    question: "What brings you to Dayryz?",
    subtitle: "Pick the one that fits best — you can explore others later.",
    type: 'choice',
    options: [
      { value: 'career_change', label: '🔄 I want to change careers', desc: 'Find a new path that actually fits me' },
      { value: 'startup', label: '🚀 I want to start a business', desc: 'Turn my idea (or find one) into something real' },
      { value: 'life_redesign', label: '🌿 I want to redesign my life', desc: 'My work no longer fits who I am' },
      { value: 'figuring_out', label: '🤔 I\'m not sure yet', desc: 'I just know something needs to change' },
    ],
  },
  {
    id: 'current_job',
    question: "What do you do right now?",
    subtitle: "Be specific — 'I'm a senior accountant at a mid-size firm' is better than 'finance'.",
    type: 'text',
    placeholder: 'e.g. Senior software engineer at a healthcare startup',
  },
  {
    id: 'years_experience',
    question: "How many years of work experience do you have?",
    subtitle: "Total years in the workforce, not just your current role.",
    type: 'choice',
    options: [
      { value: '0-2', label: '0–2 years', desc: 'Early career' },
      { value: '3-5', label: '3–5 years', desc: 'Building momentum' },
      { value: '6-10', label: '6–10 years', desc: 'Mid-career' },
      { value: '10+', label: '10+ years', desc: 'Senior / veteran' },
    ],
  },
  {
    id: 'top_skills',
    question: "What are your top skills or strengths?",
    subtitle: "Think beyond your job title — include soft skills, side projects, anything.",
    type: 'text',
    placeholder: 'e.g. Data analysis, clear communication, building relationships, writing',
  },
  {
    id: 'values',
    question: "What matters most to you in work?",
    subtitle: "Pick up to 3 that feel most true right now.",
    type: 'multi',
    options: [
      { value: 'autonomy', label: '🗽 Autonomy', desc: 'Being my own boss / flexible' },
      { value: 'impact', label: '💡 Impact', desc: 'Work that means something' },
      { value: 'income', label: '💰 Income', desc: 'Financial security & growth' },
      { value: 'creativity', label: '🎨 Creativity', desc: 'Making things, new ideas' },
      { value: 'stability', label: '⚓ Stability', desc: 'Predictable, reliable work' },
      { value: 'growth', label: '📈 Growth', desc: 'Constantly learning & advancing' },
      { value: 'balance', label: '⚖️ Balance', desc: 'Time for life outside work' },
      { value: 'community', label: '🤝 Community', desc: 'Team, belonging, relationships' },
    ],
  },
  {
    id: 'risk_tolerance',
    question: "How do you feel about risk?",
    subtitle: "Be honest — there's no right answer. Your coach adapts to where you are.",
    type: 'choice',
    options: [
      { value: 'low', label: '🛡️ Play it safe', desc: 'I need stability — transition slowly' },
      { value: 'medium', label: '⚖️ Calculated risk', desc: 'I\'ll take smart risks with a plan' },
      { value: 'high', label: '🔥 All in', desc: 'I\'m ready to leap — let\'s go' },
    ],
  },
  {
    id: 'life_goals',
    question: "One last thing — what does your ideal life look like?",
    subtitle: "Dream a little. Where do you want to be in 3 years?",
    type: 'text',
    placeholder: 'e.g. Running my own design studio, working remotely from anywhere, making $150k, spending more time with family...',
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

    // Last step — save and go to chat
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Format values array as string
      const valuesArr = answers['values'] as string[]
      const payload = {
        help_type: answers['help_type'] as string,
        current_job: answers['current_job'] as string,
        years_experience: answers['years_experience'] as string,
        top_skills: answers['top_skills'] as string,
        values: Array.isArray(valuesArr) ? valuesArr.join(', ') : valuesArr,
        risk_tolerance: answers['risk_tolerance'] as string,
        life_goals: answers['life_goals'] as string,
        onboarding_completed: true,
      }

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        // Not authenticated — go to login
        router.push('/login')
        return
      }

      if (res.ok) {
        router.push('/chat')
      } else {
        // Save failed but user is auth'd — try direct Supabase update as fallback
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true, ...payload })
          .eq('id', user.id)
        router.push('/chat')
      }
    } catch {
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
        <div className="text-xl font-bold text-orange-500">🌅 Dayryz</div>
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
