import { type NextRequest, NextResponse } from "next/server";

function getPreferredLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale === "en" || cookieLocale === "es") return cookieLocale;

  const primaryLanguage = request.headers
    .get("accept-language")
    ?.split(",", 1)[0]
    ?.trim()
    .toLowerCase();

  return primaryLanguage?.startsWith("en") ? "en" : "es";
}

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL(`/${getPreferredLocale(request)}`, request.url),
    307,
  );

  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Accept-Language, Cookie");

  return response;
}
