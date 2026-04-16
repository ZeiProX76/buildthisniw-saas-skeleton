import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { HtmlLangSync } from "./html-lang-sync";

/**
 * Async server component that reads the locale cookie and provides
 * NextIntlClientProvider. Must be rendered inside a <Suspense> boundary
 * because cookies() is a dynamic API under cacheComponents / PPR.
 */
export async function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSync locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
