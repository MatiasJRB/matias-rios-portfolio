'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/i18n/config'
import { setLocaleCookie } from '@/i18n/cookies'
import { motion } from 'framer-motion'

export default function LanguageSwitcher({ 
  currentLocale 
}: { 
  currentLocale: Locale 
}) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: Locale) => {
    if (!pathname || newLocale === currentLocale) return
    
    const segments = pathname.split('/')
    segments[1] = newLocale
    
    // Guardar preferencia en cookie
    setLocaleCookie(newLocale)
    
    // Navegar a la nueva ruta
    router.push(segments.join('/'))
  }

  return (
    <motion.div 
      className="flex gap-2 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-2 py-1 text-xs font-medium rounded transition-all duration-300 ${
            currentLocale === locale 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
          }`}
          aria-label={`Switch to ${locale === 'en' ? 'English' : 'Español'}`}
          aria-current={currentLocale === locale ? 'true' : 'false'}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </motion.div>
  )
}
