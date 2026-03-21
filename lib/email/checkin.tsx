import * as React from 'react'

interface CheckinEmailProps {
  userName: string
  coachName: string
  coachEmoji: string
  lifeGoal: string
  helpType: string
}

const helpLabels: Record<string, string> = {
  career_change: 'changing careers',
  startup: 'starting a business',
  life_redesign: 'redesigning your life',
  figuring_out: 'figuring out your next move',
}

export function CheckinEmail({ userName, coachName, coachEmoji, lifeGoal, helpType }: CheckinEmailProps) {
  const firstName = userName?.split('@')[0] || 'there'
  const goal = helpLabels[helpType] || 'finding your direction'

  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: '560px', margin: '0 auto', color: '#1a1a1a' }}>
      {/* Header */}
      <div style={{ background: '#f97316', padding: '32px 40px', borderRadius: '16px 16px 0 0' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌅</div>
        <div style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>Dayryz</div>
        <div style={{ color: '#fed7aa', fontSize: '13px', marginTop: '4px' }}>Every Dayryz is a new beginning.</div>
      </div>

      {/* Body */}
      <div style={{ background: '#fffbf7', padding: '40px', border: '1px solid #fed7aa', borderTop: 'none' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: 0 }}>
          Hey {firstName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          It's {coachEmoji} {coachName} checking in.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          You came to Dayryz because you wanted to work on <strong>{goal}</strong>. 
          {lifeGoal && ` You told me you're working toward: "${lifeGoal}"`}
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          I'm just curious — how's it going? Did anything shift this week? Even small things count.
        </p>

        <div style={{ margin: '32px 0', textAlign: 'center' as const }}>
          <a
            href="https://dayryz.com/chat"
            style={{
              background: '#f97316',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              display: 'inline-block',
            }}
          >
            Continue our conversation →
          </a>
        </div>

        <p style={{ fontSize: '14px', color: '#9a6a4a', lineHeight: '1.6' }}>
          I'll be here whenever you're ready to talk. No pressure, no judgment — just whenever it feels right.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          — {coachEmoji} {coachName}
        </p>
      </div>

      {/* Footer */}
      <div style={{ background: '#fff7ed', padding: '20px 40px', borderRadius: '0 0 16px 16px', border: '1px solid #fed7aa', borderTop: 'none' }}>
        <p style={{ fontSize: '12px', color: '#c2855a', margin: 0, textAlign: 'center' as const }}>
          Dayryz · <a href="https://dayryz.com" style={{ color: '#f97316' }}>dayryz.com</a>
          {' · '}
          <a href="https://dayryz.com/dashboard" style={{ color: '#f97316' }}>Manage preferences</a>
        </p>
      </div>
    </div>
  )
}
