import { parseAsInteger } from 'nuqs/server'

export const onboardingParsers = {
  step: parseAsInteger.withDefault(1),
}
