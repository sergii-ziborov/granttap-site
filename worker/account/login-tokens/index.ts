import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";
import { bearerToken, boundedJSON, json, UUID } from "../http";
import { AccountLoginTokens, LOGIN_TOKEN } from "./store";
export { AccountLoginTokens } from "./store";

/** Native account sign-in, separate from encrypted computer pairing. */
export async function routeLoginTokens(request: Request, db: D1Database, auth: AccountAuth) {
  const pathname = new URL(request.url).pathname;
  if (!pathname.startsWith("/api/account/")) return null;
  const action = pathname.slice("/api/account/".length);
  if (action !== "login-tokens" && !action.startsWith("login-tokens/")) return null;
  if (request.headers.has("origin") || request.headers.has("sec-fetch-site")) {
    return json(403, { error: "Open sign-in tokens in the native GrantTap app." });
  }
  const tokens = new AccountLoginTokens(db);
  if (action === "login-tokens/redeem" && request.method === "POST") {
    const body = await boundedJSON(request);
    if (typeof body?.secret !== "string" || !LOGIN_TOKEN.test(body.secret)) {
      return json(400, { error: "Invalid sign-in token." });
    }
    const session = await tokens.redeem(body.secret, auth);
    return session ? json(200, session) : json(410, { error: "Sign-in token expired, revoked, or used." });
  }
  const bearer = bearerToken(request);
  const accountId = await auth.accountForToken(bearer);
  if (!accountId) return json(401, { error: "Sign in required." });
  if (!await auth.canManageCredentials(bearer)) {
    return json(403, { error: "Sign in with a passkey to manage sign-in tokens." });
  }
  if (action === "login-tokens" && request.method === "GET") return json(200, { tokens: await tokens.list(accountId) });
  if (action === "login-tokens" && request.method === "POST") {
    const options = AccountLoginTokens.options(await boundedJSON(request));
    if (!options) return json(400, { error: "Choose a name, 15 minutes–30 days, and 1–100 uses." });
    const issued = await tokens.issue(accountId, options);
    return issued ? json(201, issued) : json(429, { error: "At most five active sign-in tokens are allowed." });
  }
  const id = action.slice("login-tokens/".length);
  if (request.method === "DELETE" && UUID.test(id)) {
    return await tokens.revoke(accountId, id) ? json(200, { revoked: true }) : json(404, { error: "Token not found." });
  }
  return json(405, { error: "Method not allowed." });
}
