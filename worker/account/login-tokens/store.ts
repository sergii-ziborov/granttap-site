import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";

export const LOGIN_TOKEN = /^gt_login_[A-Za-z0-9_-]{43}$/;
export type LoginTokenOptions = { name: string; expiresInSeconds: number; maxUses: number };
type Row = { id: string; account_id: string; name: string; created_at: number;
  expires_at: number; max_uses: number; uses: number; last_used_at: number | null; revoked_at: number | null };
const columns = "id,account_id,name,created_at,expires_at,max_uses,uses,last_used_at,revoked_at";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const describe = (row: Row) => ({ id: row.id, name: row.name, createdAt: row.created_at,
  expiresAt: row.expires_at, maxUses: row.max_uses, uses: row.uses,
  lastUsedAt: row.last_used_at, revokedAt: row.revoked_at });

export class AccountLoginTokens {
  constructor(private readonly db: D1Database, private readonly now = Date.now) {}

  static options(value: Record<string, unknown> | null): LoginTokenOptions | null {
    if (!value || typeof value.name !== "string" || !value.name.trim() || value.name.trim().length > 64
      || /[\x00-\x1f\x7f]/.test(value.name)
      || !Number.isInteger(value.expiresInSeconds) || Number(value.expiresInSeconds) < 900
      || Number(value.expiresInSeconds) > 2_592_000 || !Number.isInteger(value.maxUses)
      || Number(value.maxUses) < 1 || Number(value.maxUses) > 100) return null;
    return { name: value.name.trim(), expiresInSeconds: Number(value.expiresInSeconds), maxUses: Number(value.maxUses) };
  }

  async issue(accountId: string, options: LoginTokenOptions) {
    const id = randomUUID();
    const secret = "gt_login_" + randomBytes(32).toString("base64url");
    const now = this.now();
    const expires = now + options.expiresInSeconds * 1_000;
    const result = await this.db.prepare(
      "INSERT INTO account_login_tokens(id,account_id,token_hash,name,created_at,expires_at,max_uses) "
      + "SELECT ?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM account_login_tokens "
      + "WHERE account_id=? AND revoked_at IS NULL AND expires_at>? AND uses<max_uses)<5")
      .bind(id, accountId, hash(secret), options.name, now, expires, options.maxUses, accountId, now).run();
    if (result.meta.changes !== 1) return null;
    return { secret, link: "https://granttap.com/sign-in#token=" + secret,
      token: { id, name: options.name, createdAt: now, expiresAt: expires,
        maxUses: options.maxUses, uses: 0, lastUsedAt: null, revokedAt: null } };
  }

  async list(accountId: string) {
    const rows = await this.db.prepare(`SELECT ${columns} FROM account_login_tokens WHERE account_id=? `
      + "ORDER BY (revoked_at IS NULL AND expires_at>? AND uses<max_uses) DESC,created_at DESC LIMIT 100")
      .bind(accountId, this.now()).all<Row>();
    return rows.results.map(describe);
  }

  async revoke(accountId: string, id: string) {
    const result = await this.db.prepare("UPDATE account_login_tokens SET revoked_at=COALESCE(revoked_at,?) "
      + "WHERE id=? AND account_id=?").bind(this.now(), id, accountId).run();
    return result.meta.changes === 1;
  }

  async redeem(secret: string, auth: AccountAuth) {
    if (!LOGIN_TOKEN.test(secret)) return null;
    const row = await this.db.prepare("UPDATE account_login_tokens SET uses=uses+1,last_used_at=? "
      + "WHERE token_hash=? AND revoked_at IS NULL AND expires_at>? AND uses<max_uses "
      + `RETURNING ${columns}`).bind(this.now(), hash(secret), this.now()).first<Row>();
    if (!row) return null;
    const session = await auth.createSession(row.account_id);
    try {
      await this.db.prepare("INSERT INTO account_login_token_sessions(session_hash,login_token_id) VALUES(?,?)")
        .bind(hash(session.token), row.id).run();
      // A concurrent revocation/expiry must not return a usable new session.
      if (await auth.accountForToken(session.token)) return {
        ...session, loginTokenId: row.id, expiresAt: row.expires_at,
      };
    } catch {
      await auth.logout(session.token);
      return null;
    }
    await auth.logout(session.token);
    return null;
  }
}
