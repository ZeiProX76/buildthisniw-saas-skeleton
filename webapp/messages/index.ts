// PROTECTED — APPEND ONLY. Add new namespace imports when creating a feature.
// Each import loads one namespace JSON from the locale directory.
// Feature agents: add your import + spread below when adding translations.

import type { AbstractIntlMessages } from 'next-intl';

export async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  const [common, localeSwitcher, marketing] = await Promise.all([
    import(`./${locale}/common.json`),
    import(`./${locale}/locale-switcher.json`),
    import(`./${locale}/marketing.json`),
    // — NEW FEATURE IMPORTS GO ABOVE THIS LINE —
  ]);

  return {
    ...common.default,
    ...localeSwitcher.default,
    ...marketing.default,
    // — NEW FEATURE SPREADS GO ABOVE THIS LINE —
  };
}
