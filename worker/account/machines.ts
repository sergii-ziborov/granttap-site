import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";

const REQUEST_MS = 5 * 60_000;
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const PUBLIC_KEY = /^[A-Za-z0-9_-]{43}$/;

type MachineRow = {
  id: string; account_id: string; display_name: string;
  created_at: number; last_seen_at: number | null;
};
type RequestRow = {
  id: string; phone_public_key: string; created_at: number; expires_at: number;
};

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** GrantTap account authority is an opt-in recovery bridge; QR remains independent. */
export class AccountMachines {
  constructor(private readonly db: D1Database, private readonly now: () => number = Date.now) {}

  async register(accountId: string, displayName: string) {
    const name = displayName.trim();
    if (!name || name.length > 80 || /[\x00-\x1f\x7f]/.test(name)) return null;
    const id = randomUUID();
    const machineToken = randomBytes(32).toString("base64url");
    try {
      const result = await this.db.prepare(`
        INSERT INTO account_machines(id,account_id,display_name,token_hash,created_at)
        SELECT ?,id,?,?,? FROM accounts WHERE id=? AND
          (SELECT COUNT(*) FROM account_machines WHERE account_id=? AND revoked_at IS NULL) < 16
      `).bind(id, name, hash(machineToken), this.now(), accountId, accountId).run();
      return result.meta.changes === 1 ? { id, name, machineToken } : null;
    } catch { return null; }
  }

  async list(accountId: string) {
    const result = await this.db.prepare(
      "SELECT id,account_id,display_name,created_at,last_seen_at FROM account_machines WHERE account_id=? AND revoked_at IS NULL ORDER BY created_at DESC",
    ).bind(accountId).all<MachineRow>();
    return result.results.map(row => ({ id: row.id, name: row.display_name,
      createdAt: row.created_at, lastSeenAt: row.last_seen_at }));
  }

  async owner(machineId: string): Promise<string | null> {
    const row = await this.db.prepare(
      "SELECT account_id FROM account_machines WHERE id=? AND revoked_at IS NULL",
    ).bind(machineId).first<{ account_id: string }>();
    return row?.account_id ?? null;
  }

  async revoke(accountId: string, machineId: string): Promise<boolean> {
    const result = await this.db.prepare(
      "UPDATE account_machines SET revoked_at=? WHERE id=? AND account_id=? AND revoked_at IS NULL",
    ).bind(this.now(), machineId, accountId).run();
    if (result.meta.changes !== 1) return false;
    await this.db.prepare("DELETE FROM recovery_requests WHERE machine_id=?")
      .bind(machineId).run();
    return true;
  }

  async open(accountId: string, machineId: string, phonePublicKey: string) {
    if (!PUBLIC_KEY.test(phonePublicKey)
      || Buffer.from(phonePublicKey, "base64url").length !== 32) return null;
    await this.db.prepare("DELETE FROM recovery_requests WHERE expires_at<=?")
      .bind(this.now()).run();
    const id = randomUUID();
    const result = await this.db.prepare(`
      INSERT INTO recovery_requests(id,account_id,machine_id,phone_public_key,created_at,expires_at)
      SELECT ?,account_id,id,?,?,? FROM account_machines
      WHERE id=? AND account_id=? AND revoked_at IS NULL
        AND (SELECT COUNT(*) FROM recovery_requests
          WHERE machine_id=? AND expires_at>? AND encrypted_offer IS NULL) < 3
    `).bind(id, phonePublicKey, this.now(), this.now() + REQUEST_MS,
      machineId, accountId, machineId, this.now()).run();
    return result.meta.changes === 1 ? { id, expiresAt: this.now() + REQUEST_MS } : null;
  }

  private async machine(machineToken: string): Promise<MachineRow | null> {
    if (!TOKEN.test(machineToken)) return null;
    return this.db.prepare(`
      SELECT id,account_id,display_name,created_at,last_seen_at FROM account_machines
      WHERE token_hash=? AND revoked_at IS NULL
    `).bind(hash(machineToken)).first<MachineRow>();
  }

  async pending(machineToken: string) {
    const machine = await this.machine(machineToken);
    if (!machine) return null;
    await this.db.prepare("UPDATE account_machines SET last_seen_at=? WHERE id=?")
      .bind(this.now(), machine.id).run();
    const result = await this.db.prepare(`
      SELECT id,phone_public_key,created_at,expires_at FROM recovery_requests
      WHERE machine_id=? AND encrypted_offer IS NULL AND expires_at>? ORDER BY created_at ASC
    `).bind(machine.id, this.now()).all<RequestRow>();
    return result.results.map(row => ({ id: row.id, phonePublicKey: row.phone_public_key,
      createdAt: row.created_at, expiresAt: row.expires_at }));
  }

  async complete(machineToken: string, requestId: string, encryptedOffer: string): Promise<boolean> {
    if (!encryptedOffer || encryptedOffer.length > 8192) return false;
    const machine = await this.machine(machineToken);
    if (!machine) return false;
    const result = await this.db.prepare(`
      UPDATE recovery_requests SET encrypted_offer=? WHERE id=? AND machine_id=?
        AND encrypted_offer IS NULL AND expires_at>?
        AND EXISTS(SELECT 1 FROM account_machines WHERE id=? AND revoked_at IS NULL)
    `).bind(encryptedOffer, requestId, machine.id, this.now(), machine.id).run();
    return result.meta.changes === 1;
  }

  async status(accountId: string, requestId: string): Promise<"pending" | "ready" | null> {
    const row = await this.db.prepare(`
      SELECT encrypted_offer FROM recovery_requests
      WHERE id=? AND account_id=? AND expires_at>?
        AND EXISTS(SELECT 1 FROM account_machines
          WHERE account_machines.id=recovery_requests.machine_id AND revoked_at IS NULL)
    `).bind(requestId, accountId, this.now()).first<{ encrypted_offer: string | null }>();
    return row ? row.encrypted_offer === null ? "pending" : "ready" : null;
  }

  async claim(accountId: string, requestId: string): Promise<string | null> {
    const row = await this.db.prepare(`
      DELETE FROM recovery_requests WHERE id=? AND account_id=?
        AND encrypted_offer IS NOT NULL AND expires_at>?
        AND EXISTS(SELECT 1 FROM account_machines
          WHERE account_machines.id=recovery_requests.machine_id AND revoked_at IS NULL)
      RETURNING encrypted_offer
    `).bind(requestId, accountId, this.now()).first<{ encrypted_offer: string }>();
    return row?.encrypted_offer ?? null;
  }
}
