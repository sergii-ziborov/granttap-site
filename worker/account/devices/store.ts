import { createHash, randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import type { AccountMachines } from "../machines";
import type { DeviceKind } from "./client";

/** Every session lives exactly this long from its creation, so expiry dates an older one. */
const SESSION_MS = 30 * 86_400_000;
export type Device = { type: "session" | "computer"; id: string; kind: DeviceKind | "computer"; name: string;
  signIn: string | null; createdAt: number | null; lastSeenAt: number | null; expiresAt: number | null;
  current: boolean; delegated: boolean; older: boolean; encryptionKeyId?: string | null };
type SessionRow = { token_hash: string; expires_at: number; id: string | null; kind: string | null; name: string | null;
  sign_in: string | null; delegated: number | null; created_at: number | null; last_seen_at: number | null;
  linked: string | null; token_id: string | null; token_account: string | null; token_expiry: number | null;
  token_revoked: number | null };
type ComputerRow = { id: string; display_name: string; created_at: number; last_seen_at: number | null;
  endpoint_seen: number | null; public_key: string | null };
type Removed = Array<{ type: Device["type"]; id: string; name: string }>;

const activity = (device: Device) => device.lastSeenAt ?? device.createdAt ?? 0;

/** Every session and computer link of one account, as one list for the phone and the web. */
export class AccountDevices {
  constructor(private readonly db: D1Database, private readonly now = Date.now) {}

  async list(accountId: string, currentHash: string): Promise<Device[]> {
    const sessions = await this.db.prepare(`SELECT s.token_hash,s.expires_at,d.id,d.kind,d.name,d.sign_in,d.delegated,
        d.created_at,d.last_seen_at,l.session_hash AS linked,t.id AS token_id,t.account_id AS token_account,
        t.expires_at AS token_expiry,t.revoked_at AS token_revoked
      FROM sessions s LEFT JOIN account_session_details d ON d.session_hash=s.token_hash
      LEFT JOIN account_login_token_sessions l ON l.session_hash=s.token_hash
      LEFT JOIN account_login_tokens t ON t.id=l.login_token_id
      WHERE s.account_id=? AND s.expires_at>? ORDER BY s.expires_at DESC LIMIT 500`)
      .bind(accountId, this.now()).all<SessionRow>();
    const devices: Device[] = [];
    for (const row of sessions.results) {
      if (row.linked && (!row.token_id || row.token_revoked !== null || row.token_account !== accountId
        || row.token_expiry === null || row.token_expiry <= this.now())) continue;
      const id = row.id ?? await this.identify(row.token_hash);
      // Signed in before sessions recorded their details: only a token link says how.
      const older = row.created_at === null;
      devices.push({ type: "session", id, kind: (row.kind ?? "unknown") as DeviceKind,
        name: row.name ?? "Signed-in device", signIn: row.sign_in ?? (row.linked ? "token" : null),
        createdAt: row.created_at ?? row.expires_at - SESSION_MS, lastSeenAt: row.last_seen_at,
        expiresAt: Math.min(row.expires_at, row.token_expiry ?? row.expires_at),
        current: row.token_hash === currentHash, delegated: row.delegated === 1 || !!row.token_id, older });
    }
    const computers = await this.db.prepare(`SELECT m.id,m.display_name,m.created_at,m.last_seen_at,
        e.updated_at AS endpoint_seen,e.public_key FROM account_machines m
      LEFT JOIN account_machine_endpoints e ON e.machine_id=m.id
      WHERE m.account_id=? AND m.revoked_at IS NULL ORDER BY m.created_at DESC LIMIT 500`)
      .bind(accountId).all<ComputerRow>();
    for (const row of computers.results) {
      const seen = Math.max(row.last_seen_at ?? 0, row.endpoint_seen ?? 0);
      devices.push({ type: "computer", id: row.id, kind: "computer", name: row.display_name, signIn: null,
        createdAt: row.created_at, lastSeenAt: seen || null, expiresAt: null, current: false, delegated: false,
        older: false,
        encryptionKeyId: row.public_key ? createHash("sha256").update(Buffer.from(row.public_key, "base64")).digest("hex") : null });
    }
    return devices.sort((a, b) => Number(b.current) - Number(a.current) || activity(b) - activity(a));
  }

  async revokeSession(accountId: string, id: string): Promise<boolean> {
    const result = await this.db.prepare(`DELETE FROM sessions WHERE account_id=? AND token_hash=
      (SELECT session_hash FROM account_session_details WHERE id=?)`).bind(accountId, id).run();
    return result.meta.changes === 1;
  }

  /**
   * Names the asking native session. With the app's random installation ID it also keeps only the newest
   * session of that installation on this account, so signing in again replaces what an earlier sign-in left.
   */
  async describeCurrent(accountId: string, hash: string, name: string, kind: DeviceKind, installationId?: string) {
    await this.db.prepare("UPDATE account_session_details SET name=?,kind=? WHERE session_hash=?")
      .bind(name, kind, hash).run();
    if (!installationId) return { updated: true, replaced: 0 };
    const installation = createHash("sha256").update(accountId + "\n" + installationId).digest("hex");
    await this.db.prepare(`INSERT INTO account_session_installations(session_hash,account_id,installation_hash)
      VALUES(?,?,?) ON CONFLICT(session_hash) DO UPDATE SET installation_hash=excluded.installation_hash`)
      .bind(hash, accountId, installation).run();
    const replaced = await this.db.prepare(`DELETE FROM sessions WHERE account_id=? AND token_hash IN
        (SELECT session_hash FROM account_session_installations WHERE account_id=? AND installation_hash=?)
      AND token_hash<>(SELECT i.session_hash FROM account_session_installations i
        JOIN sessions s ON s.token_hash=i.session_hash WHERE i.account_id=? AND i.installation_hash=?
        ORDER BY s.expires_at DESC, i.session_hash=? DESC LIMIT 1)`)
      .bind(accountId, accountId, installation, accountId, installation, hash).run();
    return { updated: true, replaced: replaced.meta.changes };
  }

  /** Removes what has been quiet for the given days. The asking session always stays. */
  async prune(accountId: string, currentHash: string, inactiveDays: number, machines: AccountMachines) {
    const cutoff = this.now() - inactiveDays * 86_400_000;
    const stale = (await this.list(accountId, currentHash)).filter(device => !device.current && activity(device) < cutoff);
    return this.remove(accountId, stale, machines);
  }

  /** Signs out every sign-in from before sessions recorded their details. The asking session always stays. */
  async pruneOlder(accountId: string, currentHash: string, machines: AccountMachines) {
    const older = (await this.list(accountId, currentHash)).filter(device => !device.current && device.older);
    return this.remove(accountId, older, machines);
  }

  private async remove(accountId: string, devices: Device[], machines: AccountMachines): Promise<Removed> {
    const removed: Removed = [];
    for (const device of devices) {
      const done = device.type === "session" ? await this.revokeSession(accountId, device.id)
        : await machines.revoke(accountId, device.id);
      if (done) removed.push({ type: device.type, id: device.id, name: device.name });
    }
    return removed;
  }

  private async identify(hash: string): Promise<string> {
    await this.db.prepare("INSERT INTO account_session_details(session_hash,id,kind,name,sign_in,delegated,created_at,last_seen_at) "
      + "VALUES(?,?,'unknown','Signed-in device',NULL,0,NULL,NULL) ON CONFLICT(session_hash) DO NOTHING")
      .bind(hash, randomUUID()).run();
    const row = await this.db.prepare("SELECT id FROM account_session_details WHERE session_hash=?")
      .bind(hash).first<{ id: string }>();
    return row!.id;
  }
}
