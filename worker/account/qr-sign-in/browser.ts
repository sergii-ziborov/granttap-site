import type { D1Database } from "@cloudflare/workers-types";
import { tokenHash, type AccountAuth } from "../auth";
import { browserLabel, describeClient } from "../devices/client";
import { boundedJSON, clientAddress, json, problem, sessionCookie, sessionToken } from "../http";
import { reserveAttempts } from "../password-access/rate-limit";
import type { AccountWebKeys } from "../web-key/store";
import { QrSignInRequests, SECRET, type QrRow } from "./store";

const SESSION_SECONDS = 30 * 86_400;

/** A signed-out browser (or a signed-in one asking for the key) opens a request and shows its QR. */
export async function createRequest(request: Request, db: D1Database, auth: AccountAuth, keys: AccountWebKeys) {
  const body = await boundedJSON(request);
  const publicKey = body?.publicKey, purpose = body?.purpose ?? "sign-in";
  if (typeof publicKey !== "string" || !SECRET.test(publicKey) || Buffer.from(publicKey, "base64url").length !== 32
    || (purpose !== "sign-in" && purpose !== "key")) return problem(400, "invalid", "Invalid sign-in request.");
  let accountId: string | null = null, requester: string | null = null;
  if (purpose === "key") {
    const token = sessionToken(request), session = await auth.sessionInfo(token);
    if (!session) return problem(401, "sign-in-required", "Sign in before asking for the key.");
    if (!keys.configured) return problem(503, "unavailable", "Key storage is not available.");
    accountId = session.accountId; requester = tokenHash(token);
  }
  const ip = clientAddress(request);
  if (!await reserveAttempts(db, [["qr-create", ip ?? "unavailable", 30]])) {
    return problem(429, "rate-limited", "Too many sign-in codes. Try again later.", { "retry-after": "900" });
  }
  const browser = browserLabel(request.headers.get("user-agent"));
  const created = await new QrSignInRequests(db).create({ browserKey: publicKey, purpose, accountId,
    requesterSession: requester, browserName: browser.name, browserOs: browser.os, ip });
  return created ? json(201, { code: created.code, secret: created.secret, expiresAt: created.expiresAt, purpose })
    : problem(503, "unavailable", "Sign-in is busy. Try again in a minute.");
}

/** Polled every two seconds by the browser that holds the request secret. */
export async function pollRequest(request: Request, db: D1Database, auth: AccountAuth) {
  const secret = (await boundedJSON(request))?.secret;
  if (typeof secret !== "string" || !SECRET.test(secret)) return problem(400, "invalid", "Invalid sign-in request.");
  const requests = new QrSignInRequests(db), row = await requests.bySecret(secret);
  const finished = terminal(row);
  if (finished) return json(410, { status: finished, reason: finished, error: "This sign-in code is no longer valid." });
  if (row!.status !== "approved") return json(200, { status: row!.status === "waiting" ? "waiting" : "scanned", expiresAt: row!.expires_at });
  if (row!.purpose === "key") {
    const token = sessionToken(request);
    if (tokenHash(token) !== row!.requester_session || !await auth.sessionInfo(token)) {
      return problem(403, "session-changed", "Sign in again on this browser and ask for the key again.");
    }
    const picked = await requests.redeem(row!, row!.requester_session!);
    if (!picked) return json(410, { status: "used", reason: "used", error: "This sign-in code was already used." });
    return json(200, { status: "approved", accountId: row!.account_id, sessionExpiresAt: null, keyTransfer: transfer(row!, picked) });
  }
  const session = await auth.createSession(row!.account_id!, describeClient(request.headers, "qr", true));
  const picked = await requests.redeem(row!, tokenHash(session.token));
  if (!picked) {
    await auth.logout(session.token);
    return json(410, { status: "used", reason: "used", error: "This sign-in code was already used." });
  }
  return json(200, { status: "approved", accountId: session.accountId, sessionExpiresAt: Date.now() + SESSION_SECONDS * 1000,
    keyTransfer: transfer(row!, picked) }, { "set-cookie": sessionCookie(session.token, SESSION_SECONDS) });
}

function terminal(row: QrRow | null): "expired" | "denied" | "used" | null {
  if (!row) return "expired";
  if (row.status === "denied" || row.status === "used") return row.status;
  return row.expires_at <= Date.now() ? "expired" : null;
}

function transfer(row: QrRow, picked: { sealedKey: string | null; keyDigest: string | null }) {
  return picked.sealedKey && picked.keyDigest
    ? { id: row.id, sealedKey: JSON.parse(picked.sealedKey) as unknown, keyDigest: picked.keyDigest } : null;
}
