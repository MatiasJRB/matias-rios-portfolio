import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/llms.txt", request.url), 308);

  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return response;
}
