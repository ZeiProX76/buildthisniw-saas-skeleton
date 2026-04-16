"use client";

import { useEffect } from "react";

/**
 * Syncs the <html lang> attribute to match the active locale.
 * The root layout renders lang="en" statically for PPR; this
 * component corrects it on the client once the locale streams in.
 */
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
