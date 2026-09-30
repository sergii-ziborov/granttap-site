import { AccountAuth } from "./auth";
import type { D1Database } from "@cloudflare/workers-types";
import { D1AccountStore } from "./d1-store";

const COOKIE = "granttap_session";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(status: number, body: unknown, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(body), { status, headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "referrer-policy": "no-referrer",
    ...extra,
  } });
}

async function boundedJSON(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16_384) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const value = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown> : null;
  } catch { return null; }
}

function sessionToken(request: Request): string {
  const bearer = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{43})$/);
  if (bearer) return bearer[1];
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)granttap_session=([A-Za-z0-9_-]{43})(?:;|$)/);
  return cookie?.[1] ?? "";
}

function sessionCookie(token: string, expires = 30 * 24 * 60 * 60): string {
  return `${COOKIE}=${token}; Path=/api/account; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires}`;
}

export async function routeAccountApi(request: Request, auth: AccountAuth): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/account/")) return null;
  const action = url.pathname.slice("/api/account/".length);
  const isMutation = request.method !== "GET";
  const origin = request.headers.get("origin");
  if (isMutation && origin && origin !== "https://granttap.com") {
    return json(403, { error: "Origin not allowed." });
  }

  if (request.method === "POST" && action === "registration/options") {
    return json(200, await auth.registrationOptions());
  }
  if (request.method === "POST" && action === "authentication/options") {
    return json(200, await auth.authenticationOptions());
  }
  if (request.method === "POST" && (action === "registration/verify" || action === "authentication/verify")) {
    const body = await boundedJSON(request);
    const ceremonyId = body?.ceremonyId;
    const response = body?.response;
    if (typeof ceremonyId !== "string" || !UUID.test(ceremonyId)
      || !response || typeof response !== "object" || Array.isArray(response)
      || typeof (response as Record<string, unknown>).id !== "string") {
      return json(400, { error: "Invalid passkey response." });
    }
    const credential = response as { id: string };
    const result = action === "registration/verify"
      ? await auth.completeRegistration(ceremonyId, credential)
      : await auth.completeAuthentication(ceremonyId, credential);
    if (!result) return json(401, { error: "Passkey verification failed or expired." });
    const nativeClient = !origin && !request.headers.has("sec-fetch-site");
    return json(200, nativeClient
      ? { accountId: result.accountId, token: result.token }
      : { accountId: result.accountId },
      { "set-cookie": sessionCookie(result.token) });
  }
  if (request.method === "GET" && action === "me") {
    const accountId = await auth.accountForToken(sessionToken(request));
    return accountId ? json(200, { accountId }) : json(401, { error: "Sign in required." });
  }
  if (request.method === "POST" && action === "logout") {
    await auth.logout(sessionToken(request));
    return json(200, { ok: true }, { "set-cookie": sessionCookie("", 0) });
  }
  if (request.method === "DELETE" && action === "me") {
    const deleted = await auth.deleteAccount(sessionToken(request));
    return deleted
      ? json(200, { deleted: true }, { "set-cookie": sessionCookie("", 0) })
      : json(401, { error: "Sign in required." });
  }
  return json(405, { error: "Method not allowed." });
}

export function handleAccountApi(request: Request, db: D1Database): Promise<Response | null> {
  return routeAccountApi(request, new AccountAuth(new D1AccountStore(db)));
}
