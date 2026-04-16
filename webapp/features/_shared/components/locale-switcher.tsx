"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { locales, type Locale } from "@/i18n/routing";

function useLocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return { locale, t, switchLocale };
}

/**
 * Compact locale switcher for headers/toolbars — icon-only trigger.
 */
function LocaleSwitcher(): React.ReactElement {
  const { locale, t, switchLocale } = useLocaleSwitcher();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          {locales.map((loc) => (
            <DropdownMenuRadioItem key={loc} value={loc}>
              {t(loc)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Sidebar-native locale switcher — uses SidebarMenuButton so it
 * collapses to just the icon when the sidebar is in "icon" mode.
 */
function SidebarLocaleSwitcher(): React.ReactElement {
  const { locale, t, switchLocale } = useLocaleSwitcher();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip={t("label")}>
          <Globe />
          <span>{t(locale as Locale)}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" side="top" align="start" sideOffset={4}>
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          {locales.map((loc) => (
            <DropdownMenuRadioItem key={loc} value={loc}>
              {t(loc)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { LocaleSwitcher, SidebarLocaleSwitcher };
