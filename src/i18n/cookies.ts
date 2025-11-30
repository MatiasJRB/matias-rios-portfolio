import type { Locale } from '@/i18n/config'

export function setLocaleCookie(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
  }
}

export function getLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='))
  
  if (!localeCookie) return null
  
  return localeCookie.split('=')[1] as Locale
}
