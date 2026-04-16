import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { locales, defaultLocale } from './routing';
import { loadMessages } from '../messages';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is populated when using i18n routing (e.g. [locale] segment
  // or rootParams). For cookie-based setups it will be undefined, so we fall
  // back to reading the NEXT_LOCALE cookie.
  let requested = await requestLocale;

  if (!requested) {
    const store = await cookies();
    requested = store.get('NEXT_LOCALE')?.value;
  }

  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
