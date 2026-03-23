import Link from 'next/link'

const coaches = [
  {
    emoji: '🌅',
    name: 'Ray',
    role: 'Life Coach',
    description: 'Warm and empathetic. Helps you find clarity, hope, and permission to change.',
    free: true,
  },
  {
    emoji: '🧠',
    name: 'Sage',
    role: 'Career Strategist',
    description: 'Analytical and precise. Builds you a clear, realistic career transition roadmap.',
    free: false,
  },
  {
    emoji: '🚀',
    name: 'Nova',
    role: 'Startup Coach',
    description: 'Energetic and visionary. Turns your background into a real startup idea.',
    free: false,
  },
  {
    emoji: '🃏',
    name: 'Ace',
    role: 'Street-Smart Advisor',
    description: 'No fluff, real talk. Tells you how things actually work and what to do this week.',
    free: false,
  },
]

const faqs = [
  {
    q: 'Is it really free to start?',
    a: 'Yes — no credit card required. You get 5 sessions per month with Ray, our life coach AI, completely free.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'Dayryz knows you. You complete a quick profile and your coach uses it from message one. Pro users get persistent memory — your coach remembers every conversation and holds you accountable. ChatGPT starts from zero every time.',
  },
  {
    q: 'What if I refer a friend?',
    a: 'Both you and your friend get 7 days of Pro free when they sign up with your link. No catches.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel anytime from your dashboard. No contracts, no cancellation fees.',
  },
  {
    q: "I'm not sure what I want — is that okay?",
    a: "That's exactly who Dayryz is for. Start a conversation with Ray and let him help you figure it out. You don't need to have it figured out first.",
  },
]

const testimonials = [
  {
    quote: "I'd been stuck at the same level for 3 years. In my first conversation with Dayryz, I figured out exactly why — and had a 90-day plan to fix it. Got promoted 4 months later.",
    name: 'Sarah K.',
    title: 'Senior Marketing Manager',
  },
  {
    quote: "I always thought switching from engineering to PM was impossible without an MBA. Dayryz helped me see my transferable skills and gave me a week-by-week transition plan. Made the switch in 6 months.",
    name: 'James T.',
    title: 'Software Engineer → Product Manager',
  },
  {
    quote: "I had a startup idea but no co-founder and no technical skills. The Nova coach helped me validate the idea, find the right first hire, and build a lean MVP plan. Finally stopped thinking and started building.",
    name: 'Priya M.',
    title: 'Entrepreneur',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Nav */}
      <nav className="px-8 py-5 flex justify-between items-center border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur z-10">
        <img src="/logo.png" alt="Dayryz" className="h-8 w-auto" />
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">Pricing</Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">Sign in</Link>
          <Link href="/signup" className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-block bg-orange-50 text-orange-500 text-sm font-semibold px-4 py-2 rounded-full mb-6">
          🌅 AI Career Coaching — Free to Start
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Find out exactly what&apos;s holding your career back.<br />
          <span className="text-orange-500">Then fix it.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Answer 10 questions. Get a personalized career plan, your blind spots, and one concrete action to take this week — in under 10 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">
            Get my free career plan →
          </Link>
          <a href="#how-it-works" className="bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition">
            See how it works
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card · 5 free sessions/month · 2,400+ professionals coached</p>

        {/* Mock Chat UI */}
        <div className="max-w-lg mx-auto mt-16 rounded-3xl shadow-2xl overflow-hidden" style={{ background: '#1a1a2e', border: '1px solid rgba(249,115,22,0.3)' }}>
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-xl">🌅</span>
            <span className="text-orange-400 font-semibold text-sm">Ray</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-green-400"></span>
          </div>
          <div className="px-5 py-6 text-left">
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
              <p className="text-white text-sm leading-relaxed">
                Based on your profile, I can see you tend to undervalue yourself in salary negotiations. Here&apos;s the one thing I&apos;d work on this week...
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-gray-500 text-sm">Reply to Ray...</div>
              <button className="bg-orange-500 rounded-xl px-4 py-3 text-white text-sm font-semibold">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-orange-50 py-6 px-6 text-center">
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Join <strong className="text-gray-800">2,400+ professionals</strong> who&apos;ve used Dayryz to navigate career changes, land promotions, and find work they actually love.
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-gray-400 text-lg">Three steps. No fluff.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Tell us about yourself', desc: 'A quick 4-question onboarding so your coach knows who you are from the very first message. No generic advice.' },
            { step: '02', title: 'Your coach speaks first', desc: 'Based on your profile, your AI coach opens with a personalized insight — and one focused question to get you moving.' },
            { step: '03', title: 'Walk away with a plan', desc: 'Every conversation ends with concrete next steps — not vague advice, but real things you can do this week.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="text-4xl font-extrabold text-orange-100 mb-3">{item.step}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dayryz vs Generic AI */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why not just use ChatGPT?</h2>
          <p className="text-gray-400 text-lg">Generic AI is helpful. Dayryz is built for your career.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Generic AI card */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-500 mb-6">Generic AI</h3>
            <ul className="space-y-4">
              {[
                'Starts from zero every session',
                'No career context',
                'Generic advice for everyone',
                'No accountability',
                'No action plan',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-gray-500">
                  <span className="text-gray-300 text-lg">✗</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Dayryz card */}
          <div className="bg-orange-500 rounded-2xl p-8 shadow-lg shadow-orange-100">
            <h3 className="text-xl font-bold text-white mb-6">Dayryz</h3>
            <ul className="space-y-4">
              {[
                'Remembers your full story (Pro)',
                'Knows your goals, skills & values',
                'Advice specific to YOUR situation',
                'Holds you accountable week to week',
                'Concrete plan every session',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-white">
                  <span className="text-orange-200 text-lg">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Real career transformations</h2>
            <p className="text-gray-400 text-lg">What professionals say after working with their Dayryz coach</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-orange-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet your coaches</h2>
            <p className="text-gray-400 text-lg">Four personalities. One mission — help you find what&apos;s next.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {coaches.map(coach => (
              <div key={coach.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4 items-start">
                <span className="text-4xl">{coach.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{coach.name}</h3>
                    <span className="text-xs text-gray-400">{coach.role}</span>
                    {coach.free && (
                      <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">Free</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{coach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Affordable. Honest. No tricks.</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Start free — no credit card. Upgrade when you&apos;re ready to go all in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="bg-gray-50 rounded-2xl px-8 py-5 text-center">
            <p className="text-3xl font-extrabold text-gray-800">$0</p>
            <p className="text-sm text-gray-400 mt-1">Free forever</p>
          </div>
          <div className="text-gray-300 text-2xl hidden sm:block">·</div>
          <div className="bg-orange-500 rounded-2xl px-8 py-5 text-center shadow-lg shadow-orange-100">
            <p className="text-3xl font-extrabold text-white">$19<span className="text-lg font-normal text-orange-100">/mo</span></p>
            <p className="text-sm text-orange-100 mt-1">Pro plan</p>
          </div>

        </div>
        <div className="mt-8">
          <Link href="/pricing" className="text-orange-500 font-medium hover:underline text-sm">
            See full plan comparison →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions?</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-24 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">Every Dayryz is a new beginning.</h2>
        <p className="text-orange-100 text-lg mb-10 max-w-lg mx-auto">
          Join 2,400+ professionals who stopped waiting and started moving. Your first session is free.
        </p>
        <Link href="/signup" className="bg-white text-orange-500 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-orange-50 transition shadow-lg">
          Start for free →
        </Link>
        <p className="text-orange-200 text-sm mt-4">No credit card · Cancel anytime</p>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <img src="/logo.png" alt="Dayryz" className="h-7 w-auto" />
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/login" className="hover:text-gray-600">Sign in</Link>
          <Link href="/signup" className="hover:text-gray-600">Sign up</Link>
        </div>
        <p>© 2026 Dayryz by Snapinno LLC</p>
      </footer>

    </div>
  )
}
