import type { D1Database } from "@cloudflare/workers-types";

export const validControlRoom = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_-]{8,128}$/.test(value);
export const validControlKey = (value: unknown): value is string => typeof value === "string"
  && /^[A-Za-z0-9+/]{43}=$/.test(value) && Buffer.from(value, "base64").toString("base64") === value;

/** Only a machine's existing account credential may publish its current relay route. */
export class AccountMachineEndpoints {
  constructor(private readonly db: D1Database) {}

  async publish(identity: { accountId: string; machineId: string }, room: string, publicKey: string): Promise<boolean> {
    if (!validControlRoom(room) || !validControlKey(publicKey)) return false;
    const result = await this.db.prepare(`INSERT INTO account_machine_endpoints(machine_id,room,public_key,updated_at)
      SELECT id,?,?,? FROM account_machines WHERE id=? AND account_id=? AND revoked_at IS NULL
      ON CONFLICT(machine_id) DO UPDATE SET room=excluded.room,public_key=excluded.public_key,
        updated_at=excluded.updated_at`).bind(room, publicKey, Date.now(), identity.machineId, identity.accountId).run();
    return result.meta.changes === 1;
  }

  async binding(accountId: string, computerId: string, room: string): Promise<{ publicKey: string } | null> {
    return this.db.prepare(`SELECT endpoint.public_key AS publicKey FROM account_machine_endpoints endpoint
      JOIN account_machines machine ON machine.id=endpoint.machine_id
      WHERE machine.id=? AND machine.account_id=? AND machine.revoked_at IS NULL AND endpoint.room=?`)
      .bind(computerId, accountId, room).first<{ publicKey: string }>();
  }
}
