import type { D1Database } from "@cloudflare/workers-types";

/** A time-limited tester grant is bound to an authenticated account, not a device. */
export class AccountBetaRelay {
  constructor(private readonly db: D1Database,
              private readonly now: () => number = Date.now) {}

  async activeUntil(accountId: string): Promise<number | null> {
    const row = await this.db.prepare(`
      SELECT expires_at FROM account_beta_relay_grants
      WHERE account_id=? AND expires_at>? AND revoked_at IS NULL
    `).bind(accountId, this.now()).first<{ expires_at: number }>();
    return row?.expires_at ?? null;
  }
}
