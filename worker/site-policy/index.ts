export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self'",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "manifest-src 'self'",
  "media-src 'self' blob:",
  "object-src 'none'",
  // vinext currently serializes the RSC payload into inline hydration scripts.
  // Keep inline scripts/styles scoped to this origin until nonce support lands.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");


export function siteHeaders(secure: boolean): Headers {
  const headers = new Headers({
    "Content-Security-Policy": CONTENT_SECURITY_POLICY,
    "Permissions-Policy": "camera=(), display-capture=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Permitted-Cross-Domain-Policies": "none",
  });
  if (secure) headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  return headers;
}

export function canonicalRedirect(url: URL): URL | undefined {
  if (["granttap.serhiiright.chatgpt.site", "www.granttap.com"].includes(url.hostname)
    || (url.hostname === "granttap.com" && url.protocol === "http:")) {
    return new URL(url.pathname + url.search, "https://granttap.com");
  }
}

export function withSecurityHeaders(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  headers.delete("Strict-Transport-Security");
  siteHeaders(new URL(request.url).protocol === "https:").forEach((value, key) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
