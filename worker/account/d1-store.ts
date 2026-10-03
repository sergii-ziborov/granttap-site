import type { AccountStore, Ceremony, StoredCredential } from "./auth";
import type { D1Database } from "@cloudflare/workers-types";

type CeremonyRow = {
  id: string; kind: Ceremony["kind"]; challenge: string;
  account_id: string | null; expires_at: number;
};
type CredentialRow = {
  id: string; account_id: string; public_key: string;
  counter: number; transports: string;
};
type SessionRow = { account_id: string; expires_at: number };

export class D1AccountStore implements AccountStore {
  constructor(private readonly db: D1Database) {}

  async saveCeremony(row: Ceremony) {
    await this.db.prepare("INSERT INTO ceremonies(id,kind,challenge,account_id,expires_at) VALUES(?,?,?,?,?)")
      .bind(row.id, row.kind, row.challenge, row.accountId, row.expiresAt).run();
  }

  async consumeCeremony(id: string): Promise<Ceremony | null> {
    const row = await this.db.prepare("DELETE FROM ceremonies WHERE id=? RETURNING id,kind,challenge,account_id,expires_at")
      .bind(id).first<CeremonyRow>();
    return row && { id: row.id, kind: row.kind, challenge: row.challenge,
      accountId: row.account_id, expiresAt: row.expires_at };
  }

  async createAccount(accountId: string, credential: StoredCredential): Promise<boolean> {
    try {
      await this.db.batch([
        this.db.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)")
          .bind(accountId, Date.now()),
        this.db.prepare("INSERT INTO passkeys(id,account_id,public_key,counter,transports) VALUES(?,?,?,?,?)")
          .bind(credential.id, accountId, Buffer.from(credential.publicKey).toString("base64url"),
            credential.counter, JSON.stringify(credential.transports ?? [])),
      ]);
      return true;
    } catch { return false; }
  }

  async credential(id: string): Promise<StoredCredential | null> {
    const row = await this.db.prepare("SELECT id,account_id,public_key,counter,transports FROM passkeys WHERE id=?")
      .bind(id).first<CredentialRow>();
    return row && { id: row.id, accountId: row.account_id,
      publicKey: new Uint8Array(Buffer.from(row.public_key, "base64url")),
      counter: row.counter, transports: JSON.parse(row.transports) as string[] };
  }

  async updateCounter(id: string, previous: number, counter: number): Promise<boolean> {
    if (counter !== 0 && counter <= previous) return false;
    const result = await this.db.prepare("UPDATE passkeys SET counter=? WHERE id=? AND counter=?")
      .bind(counter, id, previous).run();
    return result.meta.changes === 1;
  }

  async saveSession(hash: string, accountId: string, expiresAt: number) {
    await this.db.prepare("INSERT INTO sessions(token_hash,account_id,expires_at) VALUES(?,?,?)")
      .bind(hash, accountId, expiresAt).run();
  }

  async session(hash: string): Promise<{ accountId: string; expiresAt: number } | null> {
    const row = await this.db.prepare("SELECT account_id,expires_at FROM sessions WHERE token_hash=?")
      .bind(hash).first<SessionRow>();
    return row && { accountId: row.account_id, expiresAt: row.expires_at };
  }

  async removeSession(hash: string) {
    await this.db.prepare("DELETE FROM sessions WHERE token_hash=?").bind(hash).run();
  }

  async deleteAccount(accountId: string) {
    await this.db.batch([
      this.db.prepare("DELETE FROM sessions WHERE account_id=?").bind(accountId),
      this.db.prepare("DELETE FROM passkeys WHERE account_id=?").bind(accountId),
      this.db.prepare("DELETE FROM accounts WHERE id=?").bind(accountId),
    ]);
  }
}
