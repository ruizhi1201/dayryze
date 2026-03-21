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
    a: 'Yes — no credit card required. You get 10 conversations per week with Ray, our life coach AI, completely free.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'Dayryze is purpose-built for career transitions. Our coaches have deep, specialized prompting for career change, startup ideation, and life redesign — not generic answers.',
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
    a: "That's exactly who Dayryze is for. Start a conversation with Ray and let him help you figure it out. You don't need to have it figured out first.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Nav */}
      <nav className="px-8 py-5 flex justify-between items-center border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="text-xl font-bold text-orange-500">🌅 Dayryze</div>
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
          🌅 Your career. Reimagined.
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Stuck in the wrong career?<br />
          <span className="text-orange-500">Let&apos;s change that.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Dayryze is your AI career coach — available 24/7, brutally honest, and actually helpful. Find a new career, discover your startup idea, or just figure out what you actually want.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">
            Start for free →
          </Link>
          <Link href="/pricing" className="bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition">
            See pricing
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card required · 10 free conversations/week</p>
      </section>

      {/* Social proof bar */}
      <section className="bg-orange-50 py-6 px-6 text-center">
        <p className="text-gray-500 text-sm">
          <strong className="text-gray-700">59% of professionals</strong> want a career change — most just don&apos;t know where to start.
          <span className="mx-3 text-gray-300">|</span>
          <strong className="text-gray-700">Dayryze</strong> helps you figure it out.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-gray-400 text-lg">Three steps. No fluff.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Pick your coach', desc: 'Choose the AI coach that fits your mood — warm & supportive, analytical, entrepreneurial, or straight-talking.' },
            { step: '02', title: 'Have a real conversation', desc: 'No forms. No quizzes. Just talk. Your coach asks the right questions and actually listens.' },
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

      {/* Coaches */}
      <section className="bg-gray-50 py-24 px-6">
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
            <p className="text-sm text-orange-100 mt-1">Growth plan</p>
          </div>
          <div className="text-gray-300 text-2xl hidden sm:block">·</div>
          <div className="bg-gray-800 rounded-2xl px-8 py-5 text-center">
            <p className="text-3xl font-extrabold text-white">$49<span className="text-lg font-normal text-gray-400">/mo</span></p>
            <p className="text-sm text-gray-400 mt-1">Pro plan</p>
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
        <h2 className="text-4xl font-extrabold text-white mb-4">Your next chapter starts today.</h2>
        <p className="text-orange-100 text-lg mb-10 max-w-lg mx-auto">
          Thousands of people are stuck in the wrong career. You don&apos;t have to be one of them.
        </p>
        <Link href="/signup" className="bg-white text-orange-500 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-orange-50 transition shadow-lg">
          Start for free →
        </Link>
        <p className="text-orange-200 text-sm mt-4">No credit card · Cancel anytime</p>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <div className="font-bold text-orange-500">🌅 Dayryze</div>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/login" className="hover:text-gray-600">Sign in</Link>
          <Link href="/signup" className="hover:text-gray-600">Sign up</Link>
        </div>
        <p>© 2026 Dayryze by Snapinno LLC</p>
      </footer>

    </div>
  )
}
