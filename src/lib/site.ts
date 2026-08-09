import { i18n, type Locale } from "@/i18n/config";

export const SITE_URL = "https://www.matiasjrb.com.ar";
export const SITE_HOST = "www.matiasjrb.com.ar";

function normalizePath(pathname = ""): string {
  if (!pathname) {
    return "";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocalizedUrl(locale: Locale, pathname = ""): string {
  return `${SITE_URL}/${locale}${normalizePath(pathname)}`;
}

export function getAlternateLanguageUrls(pathname = ""): Record<string, string> {
  return {
    ...Object.fromEntries(
      i18n.locales.map((locale) => [locale, getLocalizedUrl(locale, pathname)])
    ),
    "x-default": getLocalizedUrl(i18n.defaultLocale, pathname),
  };
}

export function getPreferredLocale(localeCookie?: string): Locale {
  if (localeCookie && i18n.locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  return i18n.defaultLocale;
}

export function getPreviewImagePath(): string {
  return "/images/og-image.png";
}

export function getPreviewImageUrl(): string {
  return `${SITE_URL}${getPreviewImagePath()}`;
}
