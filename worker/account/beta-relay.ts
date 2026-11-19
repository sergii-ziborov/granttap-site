import type { D1Database } from "@cloudflare/workers-types";
import { REVIEW_ACCESS_LEASE, reviewAccess, type ReviewAccess } from "./review-access";

/**
 * Relay access without a purchase: an operator's time-limited tester grant,
 * bound to an authenticated account rather than a device, or the App Review
 * account the server lists (`exempt`). Nothing a client sends creates either.
 */
export class AccountBetaRelay {
  constructor(private readonly db: D1Database,
              private readonly now: () => number = Date.now,
              private readonly review: ReviewAccess = reviewAccess()) {}

  async state(accountId: string): Promise<{ expiresAt: number | null; exempt: boolean }> {
    const row = await this.db.prepare(`
      SELECT expires_at FROM account_beta_relay_grants
      WHERE account_id=? AND expires_at>? AND revoked_at IS NULL
    `).bind(accountId, this.now()).first<{ expires_at: number }>();
    if (row) return { expiresAt: row.expires_at, exempt: false };
    return this.review.includes(accountId)
      ? { expiresAt: this.now() + REVIEW_ACCESS_LEASE, exempt: true } : { expiresAt: null, exempt: false };
  }
}
