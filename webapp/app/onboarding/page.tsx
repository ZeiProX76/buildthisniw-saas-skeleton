import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { OnboardingFlow } from '@/features/onboarding'
import { OnboardingSkeleton } from '@/features/onboarding/components/onboarding-skeleton'
import type { Profile } from '@/features/onboarding/types'

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingServer />
    </Suspense>
  )
}

async function OnboardingServer() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialProfile: Profile | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select(
        'full_name, avatar_url, preference_motivation, preference_experience, preference_interest, onboarding_completed',
      )
      .eq('id', user.id)
      .single()

    let google_name: string | null = null
    if (data && !data.full_name && user.user_metadata?.full_name) {
      google_name = user.user_metadata.full_name as string
    }

    if (data) {
      initialProfile = {
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        preference_motivation: data.preference_motivation,
        preference_experience: data.preference_experience,
        preference_interest: data.preference_interest,
        onboarding_completed: data.onboarding_completed ?? false,
        google_name,
      }
    }
  }

  return <OnboardingFlow initialProfile={initialProfile} />
}
