import type { D1Database } from "@cloudflare/workers-types";
import type { JWSTransactionDecodedPayload } from "@apple/app-store-server-library";
import { SubscriptionRetention } from "../subscription-retention";
import { launchOffer } from "../../../app/ProductOffer";

const products: Record<string, number> = Object.fromEntries(
  launchOffer.plans.map(plan => [plan.productId, plan.computers]));
type Entitlement = { source: "beta" | "subscription"; limit: number; expiresAt: number;
  revision: number; productId?: string; isTrial?: boolean };
type ReceiptRow = { seat_limit: number; expires_at: number; signed_date: number; revoked: number;
  product_id: string; is_trial: number };
const COMPUTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const finite = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;
export const isManagedSubscription = (receipt: JWSTransactionDecodedPayload) =>
  receipt.type === "Auto-Renewable Subscription" && !!products[receipt.productId ?? ""];

/** Only the authenticated API may call this with Apple-verified data. */
export class ManagedSubscriptions {
  constructor(private readonly db: D1Database, private readonly now: () => number = Date.now) {}

  async originalTransaction(accountId: string): Promise<string | null> {
    const row = await this.db.prepare(`SELECT original_id FROM account_subscriptions
      WHERE account_id=? ORDER BY purchase_date DESC,signed_date DESC LIMIT 1`)
      .bind(accountId).first<{ original_id: string }>();
    return row?.original_id ?? null;
  }

  async acceptVerified(accountId: string, receipt: JWSTransactionDecodedPayload): Promise<boolean> {
    const limit = receipt.productId && products[receipt.productId];
    if (!limit || receipt.appAccountToken?.toLowerCase() !== accountId.toLowerCase()
      || receipt.bundleId !== "com.ziborov.granttap" || receipt.type !== "Auto-Renewable Subscription"
      || receipt.environment !== "Production"
      || !receipt.originalTransactionId || !receipt.transactionId
      || !finite(receipt.expiresDate) || !finite(receipt.purchaseDate) || !finite(receipt.signedDate)
      || receipt.signedDate > this.now() + 60_000) return false;
    const revoked = receipt.revocationDate != null || receipt.isUpgraded === true;
    const result = await this.db.prepare(`
      INSERT INTO account_subscriptions(original_id,account_id,transaction_id,product_id,
        seat_limit,purchase_date,signed_date,expires_at,revoked,is_trial)
      SELECT ?,id,?,?,?,?,?,?,?,? FROM accounts WHERE id=?
      ON CONFLICT(original_id) DO UPDATE SET transaction_id=excluded.transaction_id,
        product_id=excluded.product_id,seat_limit=excluded.seat_limit,purchase_date=excluded.purchase_date,
        signed_date=excluded.signed_date,expires_at=excluded.expires_at,revoked=excluded.revoked,
        is_trial=excluded.is_trial
      WHERE account_subscriptions.account_id=excluded.account_id
        AND account_subscriptions.signed_date<excluded.signed_date
    `).bind(receipt.originalTransactionId, receipt.transactionId, receipt.productId, limit,
      receipt.purchaseDate, receipt.signedDate, receipt.expiresDate, revoked ? 1 : 0,
      receipt.offerType === 1 && receipt.offerDiscountType === "FREE_TRIAL" ? 1 : 0, accountId).run();
    await new SubscriptionRetention(this.db, this.now).recordVerifiedPurchase(accountId, receipt);
    return result.meta.changes === 1;
  }

  async entitlement(accountId: string): Promise<Entitlement | null> {
    const receipt = await this.db.prepare(`SELECT seat_limit,expires_at,signed_date,revoked,product_id,is_trial
      FROM account_subscriptions WHERE account_id=? ORDER BY purchase_date DESC,signed_date DESC LIMIT 1`)
      .bind(accountId).first<ReceiptRow>();
    if (receipt && products[receipt.product_id] === receipt.seat_limit
      && !receipt.revoked && receipt.expires_at > this.now()) {
      return { source: "subscription", limit: receipt.seat_limit, expiresAt: receipt.expires_at,
        revision: receipt.signed_date, productId: receipt.product_id, isTrial: receipt.is_trial === 1 };
    }
    const beta = await this.db.prepare(`SELECT expires_at FROM account_beta_relay_grants
      WHERE account_id=? AND expires_at>? AND revoked_at IS NULL`)
      .bind(accountId, this.now()).first<{ expires_at: number }>();
    if (beta) return { source: "beta", limit: 100, expiresAt: beta.expires_at, revision: beta.expires_at };
    return null;
  }

  async admit(accountId: string, computerId: string, explicitEnable = false): Promise<Entitlement | null> {
    if (!COMPUTER.test(computerId)) return null;
    const right = await this.entitlement(accountId);
    if (!right) return null;
    const now = this.now();
    const current = right.source === "beta"
      ? `EXISTS(SELECT 1 FROM account_beta_relay_grants WHERE account_id=? AND expires_at=?
          AND revoked_at IS NULL AND expires_at>?)`
      : `EXISTS(SELECT 1 FROM (SELECT signed_date,revoked,expires_at FROM account_subscriptions
          WHERE account_id=? ORDER BY purchase_date DESC,signed_date DESC LIMIT 1)
          WHERE signed_date=? AND revoked=0 AND expires_at>?)`;
    const expiry = Math.min(right.expiresAt, now + 5 * 60_000);
    // The count and insertion share one SQLite statement; two last-slot requests cannot both win.
    const result = await this.db.prepare(`
      INSERT INTO managed_computers(computer_id,account_id,expires_at)
      SELECT ?,?,? WHERE ${current}
        AND (?=1 OR NOT EXISTS(SELECT 1 FROM managed_computers
          WHERE computer_id=? AND account_id=? AND revoked_at IS NOT NULL)) AND (
        (SELECT COUNT(*) FROM managed_computers WHERE account_id=? AND revoked_at IS NULL)<?
        OR ? IN (SELECT computer_id FROM managed_computers WHERE account_id=? AND revoked_at IS NULL
          ORDER BY position LIMIT ?))
      ON CONFLICT(computer_id) DO UPDATE SET expires_at=excluded.expires_at,revoked_at=NULL
        WHERE managed_computers.account_id=excluded.account_id
    `).bind(computerId, accountId, expiry, accountId, right.revision, now,
      explicitEnable ? 1 : 0, computerId, accountId,
      accountId, right.limit, computerId, accountId, right.limit).run();
    return result.meta.changes === 1 ? { ...right, expiresAt: expiry } : null;
  }

  async release(accountId: string, computerId: string): Promise<boolean> {
    if (!COMPUTER.test(computerId)) return false;
    const result = await this.db.prepare(`
      INSERT INTO managed_computers(computer_id,account_id,expires_at,revoked_at)
      VALUES(?,?,0,?) ON CONFLICT(computer_id) DO UPDATE SET revoked_at=excluded.revoked_at
      WHERE managed_computers.account_id=excluded.account_id`)
      .bind(computerId, accountId, this.now()).run();
    return result.meta.changes === 1;
  }

  async computerStates(accountId: string, computerIds: string[]) {
    if (!computerIds.length) return new Map<string, { enabled: boolean; selected: boolean }>();
    const rows = await this.db.prepare(`SELECT computer_id,revoked_at FROM managed_computers
      WHERE account_id=? AND computer_id IN (${computerIds.map(() => "?").join(",")})`)
      .bind(accountId, ...computerIds).all<{ computer_id: string; revoked_at: number | null }>();
    return new Map(rows.results.map(row => [row.computer_id,
      { enabled: row.revoked_at === null, selected: row.revoked_at === null }]));
  }

  async selectedComputerCount(accountId: string): Promise<number> {
    const row = await this.db.prepare(`SELECT COUNT(*) AS count FROM managed_computers
      WHERE account_id=? AND revoked_at IS NULL`).bind(accountId).first<{ count: number }>();
    return row?.count ?? 0;
  }
}
