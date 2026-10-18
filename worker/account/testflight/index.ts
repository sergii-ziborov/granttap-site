import type { D1Database } from "@cloudflare/workers-types";
import type { AppTransaction } from "@apple/app-store-server-library";
import type { AccountAuth } from "../auth";
import { boundedJSON, json, sessionToken } from "../http";
import type { AppleReceipts } from "../subscriptions/apple";

const LIFETIME = 90 * 86400_000;

/** Called only after Apple's signature, sandbox environment and bundle checks. */
export async function acceptTestFlight(db: D1Database, account: string, receipt: AppTransaction,
  now = Date.now()): Promise<{ kind: "invalid" } | { kind: "denied" } | { kind: "granted"; expiresAt: number }> {
  const signedAt = receipt.receiptCreationDate;
  if (receipt.receiptType !== "Sandbox" || receipt.bundleId !== "com.ziborov.granttap"
    || (receipt.appAppleId != null && receipt.appAppleId !== 6809739366)
    || !receipt.applicationVersion || !receipt.appTransactionId || receipt.appTransactionId.length > 200
    || !Number.isSafeInteger(signedAt) || signedAt! > now + 60_000 || signedAt! + LIFETIME <= now) return { kind: "invalid" };
  const expires = signedAt! + LIFETIME;
  await db.prepare(`INSERT INTO account_testflight_transactions(app_transaction_id,account_id,expires_at)
    VALUES(?,?,?) ON CONFLICT(app_transaction_id) DO UPDATE SET expires_at=MAX(expires_at,excluded.expires_at)
    WHERE account_testflight_transactions.account_id=excluded.account_id`)
    .bind(receipt.appTransactionId, account, expires).run();
  const result = await db.prepare(`INSERT INTO account_beta_relay_grants(account_id,expires_at)
    SELECT account_id,expires_at FROM account_testflight_transactions
      WHERE app_transaction_id=? AND account_id=?
    ON CONFLICT(account_id) DO UPDATE SET expires_at=MAX(expires_at,excluded.expires_at)
      WHERE account_beta_relay_grants.revoked_at IS NULL`)
    .bind(receipt.appTransactionId, account).run();
  if (result.meta.changes !== 1) return { kind: "denied" };
  const row = await db.prepare(`SELECT expires_at FROM account_beta_relay_grants WHERE account_id=?`)
    .bind(account).first<{ expires_at: number }>();
  return { kind: "granted", expiresAt: row!.expires_at };
}

export async function routeTestFlight(request: Request, db: D1Database, auth: AccountAuth,
  receipts: AppleReceipts): Promise<Response> {
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  const account = await auth.accountForToken(sessionToken(request));
  if (!account) return json(401, { error: "Sign in required." });
  const body = await boundedJSON(request);
  const signed = body?.signedAppTransaction;
  if (typeof signed !== "string" || !signed || signed.length > 15_000) {
    return json(400, { error: "A signed TestFlight app transaction is required." });
  }
  if (!receipts.appTransaction) return json(503, { error: "TestFlight verification is not configured." });
  let receipt: AppTransaction;
  try { receipt = await receipts.appTransaction(signed); }
  catch { return json(400, { error: "Apple could not verify this app transaction." }); }
  const result = await acceptTestFlight(db, account, receipt);
  if (result.kind === "invalid") return json(400, { error: "A current TestFlight app transaction is required." });
  if (result.kind === "denied") return json(403, { error: "This beta access is revoked or belongs to another account." });
  return json(200, { expiresAt: result.expiresAt });
}
