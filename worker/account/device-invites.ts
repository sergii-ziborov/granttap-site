import { createHash, randomBytes } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { AccountAuth } from "./auth";
import { bearerToken, boundedJSON, json } from "./http";

const INVITE_LIFETIME_MS = 5 * 60_000;
const CODE = /^[A-Za-z0-9_-]{43}$/;

function hash(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/** A QR is a short-lived bearer capability; the database stores only its hash. */
export class AccountDeviceInvites {
  constructor(private readonly db: D1Database, private readonly now: () => number = Date.now) {}

  async issue(accountId: string): Promise<{ code: string; expiresAt: number } | null> {
    await this.db.prepare("DELETE FROM account_device_invites WHERE expires_at<=?")
      .bind(this.now()).run();
    const code = randomBytes(32).toString("base64url");
    const expiresAt = this.now() + INVITE_LIFETIME_MS;
    const inserted = await this.db.prepare(
      "INSERT INTO account_device_invites(code_hash,account_id,expires_at) "
      + "SELECT ?,?,? WHERE (SELECT COUNT(*) FROM account_device_invites WHERE account_id=?)<5")
      .bind(hash(code), accountId, expiresAt, accountId).run();
    return inserted.meta.changes === 1 ? { code, expiresAt } : null;
  }

  async consume(code: string): Promise<string | null> {
    if (!CODE.test(code)) return null;
    const row = await this.db.prepare(
      "DELETE FROM account_device_invites WHERE code_hash=? AND expires_at>? RETURNING account_id")
      .bind(hash(code), this.now()).first<{ account_id: string }>();
    return row?.account_id ?? null;
  }
}

export async function routeDeviceInvites(request: Request, action: string,
                                         auth: AccountAuth, invites: AccountDeviceInvites): Promise<Response | null> {
  if (request.method !== "POST") return null;
  if (action === "device-invites") {
    if (request.headers.has("origin") || request.headers.has("sec-fetch-site")) {
      return json(403, { error: "Open device invitations in the native GrantTap app." });
    }
    const accountId = await auth.accountForToken(bearerToken(request));
    if (!accountId) return json(401, { error: "Sign in required." });
    const invite = await invites.issue(accountId);
    return invite ? json(200, invite) : json(429, { error: "Too many active device invitations." });
  }
  if (action === "device-invites/redeem") {
    if (request.headers.has("origin") || request.headers.has("sec-fetch-site")) {
      return json(403, { error: "Open this invitation in the native GrantTap app." });
    }
    const body = await boundedJSON(request);
    if (typeof body?.code !== "string" || !CODE.test(body.code)) {
      return json(400, { error: "Invalid device invitation." });
    }
    const accountId = await invites.consume(body.code);
    if (!accountId) return json(410, { error: "Device invitation expired or used." });
    const session = await auth.createSession(accountId);
    return json(200, session);
  }
  return null;
}
