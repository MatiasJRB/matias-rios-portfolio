import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { i18n, type Locale } from './i18n/config'

function getLocale(request: NextRequest): string {
  // 1. Verificar si hay una cookie de preferencia de idioma
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
    return cookieLocale
  }

  // 2. Si no hay cookie, detectar del header Accept-Language
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, i18n.locales, i18n.defaultLocale)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar archivos estáticos y API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images')
  ) {
    return
  }

  // Verificar si ya tiene un locale en el path
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Si ya tiene locale en la URL, asegurar que la cookie coincida
    const currentLocale = i18n.locales.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    
    if (currentLocale) {
      const response = NextResponse.next()
      // Actualizar cookie si el idioma cambió
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
      if (cookieLocale !== currentLocale) {
        response.cookies.set('NEXT_LOCALE', currentLocale, {
          maxAge: 365 * 24 * 60 * 60, // 1 año
          path: '/',
        })
      }
      return response
    }
    return
  }

  // Redirigir con locale detectado
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(request.nextUrl)
  
  // Establecer cookie con el idioma detectado
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 año
    path: '/',
  })
  
  return response
}

export const config = {
  matcher: ['/((?!_next|api|icons|images|.*\\..*).*)'],
}
