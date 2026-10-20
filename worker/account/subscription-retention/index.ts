import type { D1Database } from "@cloudflare/workers-types";
import type { JWSTransactionDecodedPayload } from "@apple/app-store-server-library";
import { launchOffer } from "../../../app/ProductOffer";

export const retentionOfferIDs: Record<string, string> = Object.fromEntries(launchOffer.plans.map(plan =>
  [plan.productId, `granttap_${plan.key}_half_month_v1`]));
const signatureLife = 23 * 60 * 60 * 1_000;
export type RetentionGrant = { productId: string; offerId: string; nonce: string;
  timestamp: number; expiresAt: number; originalId: string };
type GrantRow = { product_id: string; nonce: string; signed_at: number; expires_at: number;
  signature: string; key_id: string; redeemed_at: number | null };
type Signer = { keyId: string; sign(account: string, grant: RetentionGrant): string };
const renewalDelay = 24 * 60 * 60 * 1_000 + 5 * 60_000;

/** Only server-verified purchases populate this ledger; a discount never grants access. */
export class SubscriptionRetention {
  constructor(private readonly db: D1Database, private readonly now: () => number = Date.now) {}

  private row(accountId: string) {
    return this.db.prepare(`SELECT product_id,nonce,signed_at,expires_at,signature,key_id,redeemed_at
      FROM subscription_retention_grants WHERE account_id=?`).bind(accountId).first<GrantRow>();
  }

  private publicOffer(row: GrantRow, productId: string) {
    if (row.redeemed_at != null || row.expires_at <= this.now() || row.product_id !== productId
      || !row.signature || !row.key_id) return null;
    return { productId, offerId: retentionOfferIDs[productId], nonce: row.nonce, timestamp: row.signed_at,
      expiresAt: row.expires_at, keyId: row.key_id, signature: row.signature };
  }

  async issue(accountId: string, nonce: string, signer: Signer, verifiedUnusedHistory: boolean) {
    const purchase = await this.db.prepare(`SELECT product_id,original_id,revoked FROM account_subscriptions
      WHERE account_id=? ORDER BY purchase_date DESC,signed_date DESC LIMIT 1`)
      .bind(accountId).first<{ product_id: string; original_id: string; revoked: number }>();
    if (!purchase || purchase.revoked || !retentionOfferIDs[purchase.product_id] || !verifiedUnusedHistory) return null;
    const previous = await this.row(accountId);
    if (previous) {
      if (previous.redeemed_at != null || previous.product_id !== purchase.product_id) return null;
      if (previous.expires_at > this.now()) return this.publicOffer(previous, purchase.product_id);
      // Old signatures remain valid at Apple for 24 hours, beyond our earlier client expiry.
      if (previous.signed_at > this.now() - renewalDelay) return null;
    }
    const now = this.now();
    const grant = { productId: purchase.product_id, offerId: retentionOfferIDs[purchase.product_id], nonce,
      timestamp: now, expiresAt: now + signatureLife, originalId: purchase.original_id };
    // Each contender signs its own fresh nonce. Only the SQLite winner is ever returned.
    const signature = signer.sign(accountId, grant);
    await this.db.prepare(`INSERT INTO subscription_retention_grants
      (account_id,product_id,nonce,signed_at,expires_at,signature,key_id) VALUES(?,?,?,?,?,?,?)
      ON CONFLICT(account_id) DO UPDATE SET nonce=excluded.nonce,signed_at=excluded.signed_at,
        expires_at=excluded.expires_at,signature=excluded.signature,key_id=excluded.key_id
      WHERE subscription_retention_grants.redeemed_at IS NULL
        AND subscription_retention_grants.product_id=excluded.product_id
        AND subscription_retention_grants.signed_at<=?`)
      .bind(accountId, grant.productId, nonce, now, grant.expiresAt, signature, signer.keyId, now - renewalDelay).run();
    const saved = await this.row(accountId);
    return saved ? this.publicOffer(saved, purchase.product_id) : null;
  }

  async recordVerifiedPurchase(accountId: string, receipt: JWSTransactionDecodedPayload): Promise<void> {
    const productId = receipt.productId ?? "";
    if (!retentionOfferIDs[productId] || receipt.offerIdentifier !== retentionOfferIDs[productId]) return;
    await this.db.prepare(`INSERT INTO subscription_retention_grants
      (account_id,product_id,nonce,signed_at,expires_at,redeemed_at,transaction_id)
      SELECT ?,?,'redeemed',?,0,?,? FROM account_subscriptions
      WHERE original_id=? AND account_id=? ON CONFLICT(account_id) DO UPDATE
      SET redeemed_at=COALESCE(subscription_retention_grants.redeemed_at,excluded.redeemed_at),
        transaction_id=COALESCE(subscription_retention_grants.transaction_id,excluded.transaction_id)`)
      .bind(accountId, productId, receipt.signedDate!, receipt.purchaseDate!, receipt.transactionId!,
        receipt.originalTransactionId!, accountId).run();
  }
}
