import { cacheLife, cacheTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAvatarUrl, getEmail, getName, getPlan } from "@/lib/auth/utils"
import { getORPCCaller } from "@/lib/orpc/server"
import { ProfilePage } from "./profile-page"
import { Suspense } from "react"
import { ProfileSkeleton } from "./profile-skeleton"

async function getProfileData() {
  "use cache: private"
  cacheLife("minutes")
  cacheTag("profile")
  const caller = await getORPCCaller()
  return caller.protected.onboarding.getProfile()
}

export function ProfileServer() {
  const profilePromise = getProfileData()

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileServerInner profilePromise={profilePromise} />
    </Suspense>
  )
}

async function ProfileServerInner({
  profilePromise,
}: {
  profilePromise: ReturnType<typeof getProfileData>
}) {
  const [profile, claims] = await Promise.all([
    profilePromise,
    getClaimsData(),
  ])

  return (
    <ProfilePage
      initialData={{
        email: claims.email,
        name: claims.name,
        avatarUrl: claims.avatarUrl,
        plan: claims.plan,
      }}
      profile={profile}
    />
  )
}

async function getClaimsData() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = (data?.claims ?? {}) as Record<string, unknown>

  return {
    email: getEmail(claims),
    name: getName(claims),
    avatarUrl: getAvatarUrl(claims),
    plan: getPlan(claims),
  }
}
