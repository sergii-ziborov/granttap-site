/** Same-origin account API calls. The session lives in an HttpOnly cookie; no token reaches this code. */
export type Device = { type: "session" | "computer"; id: string;
  kind: "browser" | "iphone" | "ipad" | "mac" | "app" | "unknown" | "computer"; name: string;
  signIn: "passkey" | "password" | "qr" | "token" | "invite" | null; createdAt: number | null;
  lastSeenAt: number | null; expiresAt: number | null; current: boolean; delegated: boolean;
  /** Signed in before sessions recorded their details; `createdAt` then comes from its 30-day expiry. */
  older?: boolean; encryptionKeyId?: string | null };
export type Summary = { accountId: string; createdAt: number;
  session: { id: string | null; signIn: Device["signIn"]; delegated: boolean };
  methods: { passkeys: number; password: string | null; signInTokens: number } };
export type WebKeyStatus = { stored: false } | { stored: true; createdAt: number; storedFrom: string;
  computers: Array<{ computerId: string; name: string | null; recipientKeyId: string }> };
export type ApiResult<T> = { ok: boolean; status: number; body: T };

export const ACCOUNT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function accountApi<T>(path: string, init: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<ApiResult<T>> {
  const response = await fetch("/api/account/" + path, { method: init.method ?? "GET", credentials: "same-origin",
    signal: init.signal, ...(init.body === undefined ? {} : {
      headers: { "content-type": "application/json" }, body: JSON.stringify(init.body) }) });
  let body: unknown = null;
  try { body = await response.json(); } catch { body = null; }
  return { ok: response.ok, status: response.status, body: body as T };
}

export async function loadSignedIn<T>(path: string, signal?: AbortSignal): Promise<T> {
  const result = await accountApi<T>(path, { signal });
  if (!result.ok || !result.body) throw new Error(`Account request ${path}: ${result.status}`);
  return result.body;
}

/** "3 minutes ago" style text in the page's language, from a millisecond timestamp. */
export function relativeTime(value: number, locale: "en" | "ru", now = Date.now()): string {
  const seconds = Math.round((value - now) / 1000), format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const steps: Array<[number, Intl.RelativeTimeFormatUnit]> = [[60, "second"], [3600, "minute"], [86_400, "hour"], [2_592_000, "day"], [31_536_000, "month"]];
  for (const [limit, unit] of steps) {
    if (Math.abs(seconds) < limit) {
      const divisor = unit === "second" ? 1 : unit === "minute" ? 60 : unit === "hour" ? 3600 : unit === "day" ? 86_400 : 2_592_000;
      return format.format(Math.round(seconds / divisor), unit);
    }
  }
  return format.format(Math.round(seconds / 31_536_000), "year");
}

export function shortDate(value: number, locale: "en" | "ru"): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(value);
}
