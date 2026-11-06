import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";
import { boundedJSON, json, sessionCookie } from "../http";
import { AccountLoginTokens, LOGIN_TOKEN } from "../login-tokens/store";
import { reservePasswordAttempt } from "../password-access/rate-limit";

/** Explicit browser redemption keeps the native token endpoints and their restrictions intact. */
export async function routeBrowserTokenAccess(request: Request, db: D1Database, auth: AccountAuth) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/account/browser-token/redeem") return null;
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  if (request.headers.get("origin") !== "https://granttap.com"
    || request.headers.get("sec-fetch-site") !== "same-origin") {
    return json(403, { error: "Open GrantTap sign-in on granttap.com." });
  }
  if (url.search) return json(400, { error: "Sign-in keys belong only in the request body." });
  const body = await boundedJSON(request);
  if (typeof body?.secret !== "string" || !LOGIN_TOKEN.test(body.secret)) {
    return json(400, { error: "Invalid sign-in key." });
  }
  const ip = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unavailable";
  if (!await reservePasswordAttempt(db, "browser-token:" + body.secret, ip)) {
    return json(429, { error: "Too many sign-in attempts. Try again later." }, { "retry-after": "900" });
  }
  const session = await new AccountLoginTokens(db).redeem(body.secret, auth);
  if (!session) return json(410, { error: "This sign-in key expired, was revoked, or has no uses left." });
  const lifetime = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1_000));
  return json(200, { accountId: session.accountId, expiresAt: session.expiresAt }, {
    "set-cookie": sessionCookie(session.token, Math.min(lifetime, 30 * 86_400)),
  });
}
