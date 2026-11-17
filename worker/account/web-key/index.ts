import type { D1Database } from "@cloudflare/workers-types";
import { tokenHash, type AccountAuth } from "../auth";
import { describeClient, isNativeClient } from "../devices/client";
import { boundedJSON, json, problem, sameOriginBrowser, sessionToken, UUID } from "../http";
import { QrSignInRequests } from "../qr-sign-in/store";
import { digest, parseWebKeyBundle } from "./bundle";
import { AccountWebKeys } from "./store";
export { AccountWebKeys } from "./store";

/** Status and removal for phone and web; deposit and download only for a granttap.com page. */
export async function routeWebKey(request: Request, db: D1Database, auth: AccountAuth,
  storageSecret?: Uint8Array): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (path !== "/api/account/web-key" && path !== "/api/account/web-key/material") return null;
  const native = isNativeClient(request.headers);
  if (!native && !sameOriginBrowser(request)) return problem(403, "same-origin-required", "Open your account on granttap.com.");
  const token = sessionToken(request), session = await auth.sessionInfo(token);
  if (!session) return problem(401, "sign-in-required", "Sign in required.");
  const keys = new AccountWebKeys(db, storageSecret);
  if (path.endsWith("/material")) {
    if (request.method !== "POST") return problem(405, "method", "Method not allowed.");
    if (native) return problem(403, "browser-only", "Only a browser page reads the account key.");
    if (!keys.configured) return problem(503, "unavailable", "Key storage is not available.");
    const bundle = await keys.material(session.accountId);
    return bundle ? json(200, { stored: true, bundle }) : problem(404, "not-found", "No key is stored in this account.");
  }
  if (request.method === "GET") return json(200, await keys.status(session.accountId));
  if (request.method === "DELETE") return json(200, { removed: await keys.remove(session.accountId) });
  if (request.method !== "PUT") return problem(405, "method", "Method not allowed.");
  if (native) return problem(403, "browser-only", "The browser that received the key stores it.");
  if (!keys.configured) return problem(503, "unavailable", "Key storage is not available.");
  const body = await boundedJSON(request, 65_536);
  if (typeof body?.transferId !== "string" || !UUID.test(body.transferId) || typeof body.bundle !== "string") {
    return problem(400, "invalid", "Invalid key.");
  }
  const requests = new QrSignInRequests(db);
  const expected = await requests.consumeDeposit(body.transferId, session.accountId, tokenHash(token));
  if (!expected) return problem(404, "not-found", "This key handoff expired or was already stored.");
  const bundle = digest(body.bundle) === expected ? parseWebKeyBundle(body.bundle, session.accountId) : null;
  if (!bundle || !await keys.save(session.accountId, body.bundle, bundle, describeClient(request.headers, "qr").name)) {
    return problem(400, "invalid", "The key does not match what your phone approved.");
  }
  return json(200, await keys.status(session.accountId));
}
