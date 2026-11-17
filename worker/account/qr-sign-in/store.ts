import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";

export const WAITING_MS = 3 * 60_000;
export const OPENED_MS = 5 * 60_000;
export const DEPOSIT_MS = 10 * 60_000;
export const SECRET = /^[A-Za-z0-9_-]{43}$/;
export type Purpose = "sign-in" | "key";
export type QrRow = { id: string; browser_key: string; purpose: Purpose; account_id: string | null;
  requester_session: string | null; browser_name: string; browser_os: string; network_hash: string | null;
  status: "waiting" | "scanned" | "approved" | "denied" | "used"; claimed_by: string | null;
  sealed_key: string | null; key_digest: string | null; session_hash: string | null;
  created_at: number; expires_at: number; deposit_until: number | null };
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const networkHash = (id: string, ip: string | null) => ip ? hash(id + ":" + ip) : null;

/** Short-lived, hashed, single-use browser sign-in requests approved by a signed-in phone. */
export class QrSignInRequests {
  constructor(private readonly db: D1Database, private readonly now = Date.now) {}

  async create(input: { browserKey: string; purpose: Purpose; accountId: string | null; requesterSession: string | null;
    browserName: string; browserOs: string; ip: string | null }) {
    await this.purge();
    const id = randomUUID(), code = randomBytes(32).toString("base64url"), secret = randomBytes(32).toString("base64url");
    const now = this.now(), expiresAt = now + WAITING_MS;
    const result = await this.db.prepare(`INSERT INTO account_qr_requests(id,code_hash,secret_hash,browser_key,purpose,
        account_id,requester_session,browser_name,browser_os,network_hash,status,created_at,expires_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,'waiting',?,? WHERE (SELECT COUNT(*) FROM account_qr_requests)<5000`)
      .bind(id, hash(code), hash(secret), input.browserKey, input.purpose, input.accountId, input.requesterSession,
        input.browserName, input.browserOs, networkHash(id, input.ip), now, expiresAt).run();
    return result.meta.changes === 1 ? { id, code, secret, expiresAt } : null;
  }

  byCode(code: string) { return this.row("code_hash", code); }
  bySecret(secret: string) { return this.row("secret_hash", secret); }

  /** The first phone session that opens a request owns it; the wait restarts once from that moment. */
  async claim(row: QrRow, phone: string): Promise<QrRow | null> {
    if (row.claimed_by === phone) return row;
    const expiresAt = this.now() + OPENED_MS;
    const result = await this.db.prepare(`UPDATE account_qr_requests SET status='scanned',claimed_by=?,expires_at=?
      WHERE id=? AND status='waiting' AND claimed_by IS NULL AND expires_at>?`)
      .bind(phone, expiresAt, row.id, this.now()).run();
    return result.meta.changes === 1 ? { ...row, status: "scanned", claimed_by: phone, expires_at: expiresAt } : null;
  }

  async decide(row: QrRow, phone: string, decision: { accountId: string; sealedKey: string | null; keyDigest: string | null } | null) {
    const result = decision
      ? await this.db.prepare(`UPDATE account_qr_requests SET status='approved',account_id=?,sealed_key=?,key_digest=?
          WHERE id=? AND status='scanned' AND claimed_by=? AND expires_at>?`)
        .bind(decision.accountId, decision.sealedKey, decision.keyDigest, row.id, phone, this.now()).run()
      : await this.db.prepare(`UPDATE account_qr_requests SET status='denied',sealed_key=NULL
          WHERE id=? AND status='scanned' AND claimed_by=? AND expires_at>?`).bind(row.id, phone, this.now()).run();
    return result.meta.changes === 1;
  }

  /** Single pickup: the sealed key leaves the database with this answer. */
  async redeem(row: QrRow, session: string): Promise<{ sealedKey: string | null; keyDigest: string | null } | null> {
    const now = this.now();
    const used = await this.db.prepare(`UPDATE account_qr_requests SET status='used',session_hash=?,sealed_key=NULL,
        deposit_until=CASE WHEN key_digest IS NULL THEN NULL ELSE ? END
      WHERE id=? AND status='approved' AND expires_at>? RETURNING key_digest`)
      .bind(session, now + DEPOSIT_MS, row.id, now).first<{ key_digest: string | null }>();
    return used ? { sealedKey: row.sealed_key, keyDigest: used.key_digest } : null;
  }

  /** The browser that picked up a sealed key may deposit its plaintext once, within ten minutes. */
  async consumeDeposit(id: string, accountId: string, session: string): Promise<string | null> {
    const row = await this.db.prepare(`SELECT key_digest FROM account_qr_requests WHERE id=? AND account_id=?
      AND session_hash=? AND status='used' AND key_digest IS NOT NULL AND deposit_until>?`)
      .bind(id, accountId, session, this.now()).first<{ key_digest: string }>();
    if (!row) return null;
    const result = await this.db.prepare(`UPDATE account_qr_requests SET key_digest=NULL,deposit_until=NULL
      WHERE id=? AND key_digest=?`).bind(id, row.key_digest).run();
    return result.meta.changes === 1 ? row.key_digest : null;
  }

  async purge() {
    const now = this.now();
    await this.db.prepare("DELETE FROM account_qr_requests WHERE expires_at<=? AND (deposit_until IS NULL OR deposit_until<=?)")
      .bind(now - 60_000, now).run();
  }

  private row(column: "code_hash" | "secret_hash", value: string) {
    return this.db.prepare(`SELECT id,browser_key,purpose,account_id,requester_session,browser_name,browser_os,network_hash,
        status,claimed_by,sealed_key,key_digest,session_hash,created_at,expires_at,deposit_until
      FROM account_qr_requests WHERE ${column}=?`).bind(hash(value)).first<QrRow>();
  }
}
