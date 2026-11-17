import type { D1Database } from "@cloudflare/workers-types";
import { tokenHash, type AccountAuth } from "../auth";
import { isNativeClient } from "../devices/client";
import { bearerToken, boundedJSON, clientAddress, json, problem } from "../http";
import { reserveAttempts } from "../password-access/rate-limit";
import type { AccountWebKeys } from "../web-key/store";
import { networkHash, QrSignInRequests, SECRET, type QrRow } from "./store";

const BASE64_KEY = /^[A-Za-z0-9+/]{43}=$/;
const BASE64_NONCE = /^[A-Za-z0-9+/]{32}$/;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

/** A signed-in phone opens, approves or declines one browser QR. Browsers cannot use these routes. */
export async function phoneDecision(request: Request, action: "inspect" | "approve" | "deny",
  db: D1Database, auth: AccountAuth, keys: AccountWebKeys): Promise<Response> {
  if (!isNativeClient(request.headers)) return problem(403, "browser-not-allowed", "Approve browser sign-in in the GrantTap app.");
  const token = bearerToken(request), session = await auth.sessionInfo(token);
  if (!session) return problem(401, "sign-in-required", "Sign in required.");
  if (session.loginTokenId || session.delegated) {
    return problem(403, "full-session-required", "Sign in on this device with a passkey or password to approve browsers.");
  }
  if (Number(request.headers.get("content-length") ?? 0) > 65_536) return problem(413, "too-large", "The request is too large.");
  const body = await boundedJSON(request, 65_536);
  if (typeof body?.code !== "string" || !SECRET.test(body.code)) return problem(400, "invalid", "Invalid sign-in code.");
  if (action === "inspect" && !await reserveAttempts(db, [["qr-inspect", session.accountId, 60]])) {
    return problem(429, "rate-limited", "Too many sign-in codes. Try again later.", { "retry-after": "900" });
  }
  const requests = new QrSignInRequests(db), phone = tokenHash(token);
  const row = await requests.byCode(body.code);
  const closed = finished(row);
  if (closed) return problem(410, closed, "This sign-in code is no longer valid.");
  if (row!.purpose === "key" && row!.account_id !== session.accountId) {
    return problem(403, "different-account", "This code asks for another account's key.");
  }
  if (row!.claimed_by && row!.claimed_by !== phone) return problem(409, "opened-elsewhere", "Another device already opened this code.");
  if (action === "inspect") {
    const opened = await requests.claim(row!, phone);
    if (!opened) return problem(409, "opened-elsewhere", "Another device already opened this code.");
    const network = networkHash(opened.id, clientAddress(request));
    return json(200, { request: { id: opened.id, purpose: opened.purpose,
      browser: { name: opened.browser_name, os: opened.browser_os, label: label(opened) },
      createdAt: opened.created_at, expiresAt: opened.expires_at,
      sameNetwork: opened.network_hash && network ? opened.network_hash === network : null,
      accountKeyStored: await keys.exists(session.accountId) } });
  }
  if (!row!.claimed_by) return problem(409, "not-opened", "Open this code before deciding.");
  if (action === "deny") {
    return await requests.decide(row!, phone, null) ? json(200, { denied: true })
      : problem(410, "expired", "This sign-in code is no longer valid.");
  }
  const key = sealedKey(body);
  if (key === "too-large") return problem(413, "too-large", "The key is too large.");
  if (key === "invalid" || (row!.purpose === "key" && !key)) return problem(400, "invalid", "Invalid key handoff.");
  if (key && !keys.configured) return problem(503, "unavailable", "Key storage is not available.");
  const approved = await requests.decide(row!, phone, { accountId: session.accountId,
    sealedKey: key ? JSON.stringify(key.sealedKey) : null, keyDigest: key ? key.keyDigest : null });
  return approved ? json(200, { approved: true, expiresAt: row!.expires_at })
    : problem(410, "expired", "This sign-in code is no longer valid.");
}

function finished(row: QrRow | null): "expired" | "denied" | "used" | null {
  if (!row) return "expired";
  if (row.status === "denied") return "denied";
  if (row.status === "approved" || row.status === "used") return "used";
  return row.expires_at <= Date.now() ? "expired" : null;
}

function label(row: QrRow): string {
  return row.browser_name === "Unknown browser" && row.browser_os === "Unknown system" ? "Unknown browser"
    : row.browser_os === "Unknown system" ? row.browser_name : `${row.browser_name} on ${row.browser_os}`;
}

type SealedKey = { sealedKey: { senderPublicKey: string; nonce: string; box: string }; keyDigest: string };
function sealedKey(body: Record<string, unknown>): SealedKey | null | "invalid" | "too-large" {
  if (body.shareKey === false && body.sealedKey === undefined && body.keyDigest === undefined) return null;
  const sealed = body.sealedKey as Record<string, unknown> | undefined;
  if (body.shareKey !== true || !sealed || typeof sealed !== "object" || Array.isArray(sealed)
    || Object.keys(sealed).sort().join() !== "box,nonce,senderPublicKey"
    || typeof sealed.senderPublicKey !== "string" || !BASE64_KEY.test(sealed.senderPublicKey)
    || typeof sealed.nonce !== "string" || !BASE64_NONCE.test(sealed.nonce)
    || typeof sealed.box !== "string" || !BASE64.test(sealed.box) || sealed.box.length < 24
    || typeof body.keyDigest !== "string" || !/^[a-f0-9]{64}$/.test(body.keyDigest)) return "invalid";
  if (sealed.box.length > 56_000) return "too-large";
  return { sealedKey: { senderPublicKey: sealed.senderPublicKey, nonce: sealed.nonce, box: sealed.box }, keyDigest: body.keyDigest };
}
