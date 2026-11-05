import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  if ((url.hostname === "granttap.com" || url.hostname === "www.granttap.com") && forwarded === "http") {
    return NextResponse.redirect(new URL(url.pathname + url.search, "https://granttap.com"), 308);
  }
  const headers = new Headers(request.headers);
  headers.set("x-granttap-locale", url.pathname.startsWith("/guide") || url.searchParams.get("lang") === "ru" ? "ru" : "en");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api/|_next/|assets/|.*\\..*).*)"] };
