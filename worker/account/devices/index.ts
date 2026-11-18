import type { D1Database } from "@cloudflare/workers-types";
import { tokenHash, type AccountAuth } from "../auth";
import { boundedJSON, json, problem as fail, sessionCookie, sessionToken, UUID } from "../http";
import { AccountMachines } from "../machines";
import { isNativeClient, type DeviceKind } from "./client";
import { AccountDevices } from "./store";
export { AccountDevices } from "./store";

const NAME = /^[^\x00-\x1f\x7f]{1,80}$/;

/** One device list for the phone and the web: signed-in sessions plus linked computers. */
export async function routeDevices(request: Request, db: D1Database, auth: AccountAuth): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (path !== "/api/account/summary" && path !== "/api/account/devices" && !path.startsWith("/api/account/devices/")) return null;
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && origin !== null && (origin !== "https://granttap.com"
    || request.headers.get("sec-fetch-site") === "cross-site")) return fail(403, "origin", "Origin not allowed.");
  const token = sessionToken(request);
  const session = await auth.sessionInfo(token);
  if (!session) return fail(401, "sign-in-required", "Sign in required.");
  const hash = tokenHash(token), devices = new AccountDevices(db), action = path.slice("/api/account/".length);
  if (action === "summary" && request.method === "GET") return summary(db, session.accountId, hash, session);
  if (action === "devices" && request.method === "GET") return json(200, { devices: await devices.list(session.accountId, hash) });
  if (action === "devices/current" && request.method === "PATCH") {
    if (!isNativeClient(request.headers)) return fail(403, "browser-not-allowed", "Browsers are named automatically.");
    const body = await boundedJSON(request);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const installation = body?.installationId;
    if (!NAME.test(name) || !["iphone", "ipad", "mac"].includes(String(body?.kind))
      || (installation !== undefined && (typeof installation !== "string" || !UUID.test(installation)))) {
      return fail(400, "invalid", "Choose a name of 1–80 characters and iphone, ipad or mac.");
    }
    return json(200, await devices.describeCurrent(session.accountId, hash, name, body!.kind as DeviceKind,
      installation as string | undefined));
  }
  if (action === "devices/prune" && request.method === "POST") {
    const body = await boundedJSON(request), days = body?.inactiveDays, machines = new AccountMachines(db);
    if (body?.older === true && days === undefined) {
      return json(200, { removed: await devices.pruneOlder(session.accountId, hash, machines) });
    }
    if (body?.older !== undefined || !Number.isInteger(days) || Number(days) < 7 || Number(days) > 365) {
      return fail(400, "invalid", "Choose between 7 and 365 days, or older sign-ins.");
    }
    return json(200, { removed: await devices.prune(session.accountId, hash, Number(days), machines) });
  }
  const target = action.match(/^devices\/(sessions|computers)\/([^/]+)$/);
  if (target && request.method === "DELETE" && UUID.test(target[2])) {
    const revoked = target[1] === "sessions" ? await devices.revokeSession(session.accountId, target[2])
      : await new AccountMachines(db).revoke(session.accountId, target[2]);
    if (!revoked) return fail(404, "not-found", "Device not found.");
    const self = target[1] === "sessions" && !await auth.sessionInfo(token);
    return json(200, { revoked: true }, self && !isNativeClient(request.headers) ? { "set-cookie": sessionCookie("", 0) } : undefined);
  }
  return fail(405, "method", "Method not allowed.");
}

async function summary(db: D1Database, accountId: string, hash: string,
  session: { delegated?: boolean; signIn?: string | null; loginTokenId?: string }) {
  const account = await db.prepare(`SELECT a.created_at,
      (SELECT COUNT(*) FROM passkeys WHERE account_id=a.id) AS passkeys,
      (SELECT login FROM account_password_credentials WHERE account_id=a.id) AS login,
      (SELECT COUNT(*) FROM account_login_tokens WHERE account_id=a.id AND revoked_at IS NULL
        AND expires_at>? AND uses<max_uses) AS tokens,
      (SELECT id FROM account_session_details WHERE session_hash=?) AS session_id
    FROM accounts a WHERE a.id=?`).bind(Date.now(), hash, accountId)
    .first<{ created_at: number; passkeys: number; login: string | null; tokens: number; session_id: string | null }>();
  if (!account) return fail(401, "sign-in-required", "Sign in required.");
  return json(200, { accountId, createdAt: account.created_at,
    session: { id: account.session_id, signIn: session.signIn ?? (session.loginTokenId ? "token" : null),
      delegated: !!session.delegated || !!session.loginTokenId },
    methods: { passkeys: account.passkeys, password: account.login, signInTokens: account.tokens } });
}
