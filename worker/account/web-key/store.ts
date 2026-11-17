import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { recipientKeyId, type WebKeyBundle } from "./bundle";

type KeyRow = { encrypted_bundle: string; computers: string; stored_from: string; created_at: number };
type Computer = { computerId: string; publicKey: string };

/** The account-held chat key. Encrypted at rest; the server never uses it to read anything. */
export class AccountWebKeys {
  private readonly key?: Buffer;

  constructor(private readonly db: D1Database, secret?: Uint8Array, private readonly now = Date.now) {
    if (secret && secret.length >= 32) {
      this.key = Buffer.from(hkdfSync("sha256", secret, Buffer.alloc(0), "granttap-account-web-key-v1", 32));
    }
  }

  get configured(): boolean { return !!this.key; }

  async exists(accountId: string): Promise<boolean> {
    return !!await this.db.prepare("SELECT 1 AS present FROM account_web_keys WHERE account_id=?").bind(accountId).first();
  }

  async status(accountId: string) {
    const row = await this.row(accountId);
    if (!row) return { stored: false as const };
    const names = await this.db.prepare("SELECT id,display_name FROM account_machines WHERE account_id=? AND revoked_at IS NULL")
      .bind(accountId).all<{ id: string; display_name: string }>();
    const named = new Map(names.results.map(item => [item.id, item.display_name]));
    return { stored: true as const, createdAt: row.created_at, storedFrom: row.stored_from,
      computers: (JSON.parse(row.computers) as Computer[]).map(item => ({ computerId: item.computerId,
        name: named.get(item.computerId) ?? null, recipientKeyId: recipientKeyId(item.publicKey) })) };
  }

  /** Every machine must currently belong to the account. A replaced key's controllers are revoked. */
  async save(accountId: string, text: string, bundle: WebKeyBundle, storedFrom: string): Promise<boolean> {
    if (!this.key) return false;
    const owned = await this.db.prepare("SELECT id FROM account_machines WHERE account_id=? AND revoked_at IS NULL")
      .bind(accountId).all<{ id: string }>();
    const ids = new Set(owned.results.map(row => row.id));
    if (!bundle.pairings.every(pair => ids.has(pair.machineId))) return false;
    const computers: Computer[] = bundle.pairings.map(pair => ({ computerId: pair.machineId, publicKey: pair.myPublicKey }));
    await this.revokePrevious(accountId, new Set(computers.map(item => item.publicKey)));
    const nonce = randomBytes(12), cipher = createCipheriv("aes-256-gcm", this.key, nonce);
    cipher.setAAD(Buffer.from("account-web-key:" + accountId));
    const sealed = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    await this.db.prepare(`INSERT INTO account_web_keys(account_id,encrypted_bundle,computers,stored_from,created_at)
      VALUES(?,?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET encrypted_bundle=excluded.encrypted_bundle,
      computers=excluded.computers,stored_from=excluded.stored_from,created_at=excluded.created_at`)
      .bind(accountId, Buffer.concat([nonce, cipher.getAuthTag(), sealed]).toString("base64"),
        JSON.stringify(computers), storedFrom.slice(0, 80), this.now()).run();
    return true;
  }

  async material(accountId: string): Promise<string | null> {
    const row = await this.row(accountId);
    if (!row || !this.key) return null;
    const payload = Buffer.from(row.encrypted_bundle, "base64");
    const decipher = createDecipheriv("aes-256-gcm", this.key, payload.subarray(0, 12));
    decipher.setAAD(Buffer.from("account-web-key:" + accountId));
    decipher.setAuthTag(payload.subarray(12, 28));
    return Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8");
  }

  async remove(accountId: string): Promise<boolean> {
    await this.revokePrevious(accountId, new Set());
    const result = await this.db.prepare("DELETE FROM account_web_keys WHERE account_id=?").bind(accountId).run();
    return result.meta.changes === 1;
  }

  /** Account admission refuses relay tickets for controllers whose key left the account. */
  async revoked(accountId: string, publicKey: string): Promise<boolean> {
    return !!await this.db.prepare("SELECT 1 AS revoked FROM account_web_key_revocations WHERE account_id=? AND public_key=?")
      .bind(accountId, publicKey).first();
  }

  private async revokePrevious(accountId: string, keep: Set<string>) {
    const row = await this.row(accountId);
    for (const item of row ? JSON.parse(row.computers) as Computer[] : []) {
      if (keep.has(item.publicKey)) continue;
      await this.db.prepare(`INSERT INTO account_web_key_revocations(account_id,public_key,revoked_at) VALUES(?,?,?)
        ON CONFLICT(account_id,public_key) DO NOTHING`).bind(accountId, item.publicKey, this.now()).run();
    }
  }

  private row(accountId: string) {
    return this.db.prepare("SELECT encrypted_bundle,computers,stored_from,created_at FROM account_web_keys WHERE account_id=?")
      .bind(accountId).first<KeyRow>();
  }
}
