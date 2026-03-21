import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const {
    help_type,
    current_job,
    years_experience,
    top_skills,
    work_values,
    risk_tolerance,
    life_goals,
    onboarding_completed,
  } = body

  const { error } = await supabase
    .from('profiles')
    .update({
      help_type,
      current_job,
      years_experience,
      top_skills,
      work_values,
      risk_tolerance,
      life_goals,
      onboarding_completed,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Onboarding save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
