import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { i18n, type Locale } from "./i18n/config";

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) {
    return i18n.defaultLocale;
  }

  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();

  return match(languages, [...i18n.locales], i18n.defaultLocale);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/[ENG]_Matias_Rios_CV_Jan_25.pdf" ||
    pathname === "/%5BENG%5D_Matias_Rios_CV_Jan_25.pdf"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/cv/matias-rios-en.pdf";
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/time-machine") ||
    pathname.includes(".") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images")
  ) {
    return;
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const currentLocale = i18n.locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (currentLocale) {
      const response = NextResponse.next();
      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
      if (cookieLocale !== currentLocale) {
        response.cookies.set("NEXT_LOCALE", currentLocale, {
          maxAge: 365 * 24 * 60 * 60,
          path: "/",
        });
      }
      return response;
    }
    return;
  }

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  const response = NextResponse.redirect(url, 308);

  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|icons|images|time-machine).*)"],
};
