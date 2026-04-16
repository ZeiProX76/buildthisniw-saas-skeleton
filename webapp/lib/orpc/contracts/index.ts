import publicContract from './public.contract'
import authContract from './auth.contract'
import onboardingContract from './onboarding.contract'
import stripeContract from './stripe.contract'
import creditsContract from './credits.contract'
import userContract from './user.contract'

/**
 * Root API contract — single source of truth for the entire API shape.
 * OpenAPI spec is generated from this. Routers implement it.
 */
export const contract = {
  public: {
    ...publicContract,
  },
  auth: authContract,
  protected: {
    me: userContract.me,
    updateProfile: userContract.updateProfile,
    stripe: stripeContract,
    onboarding: onboardingContract,
    credits: creditsContract,
  },
}

export type AppContract = typeof contract
