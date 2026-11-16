import type { D1Database } from "@cloudflare/workers-types";
import type { AppTransaction } from "@apple/app-store-server-library";
import type { AccountAuth } from "../auth";
import { boundedJSON, json, sessionToken } from "../http";
import type { AppleReceipts } from "../subscriptions/apple";
import { inheritedTrialStart, recordTrialSubjects, testingGrant, trialPolicy, trialSubjects, UUID_TEXT,
  type Trial, type TrialPolicy } from "./trial";

const LIFETIME = 90 * 86400_000;

export type TestFlightResult = { kind: "invalid" } | { kind: "bound_elsewhere" } | { kind: "revoked" }
  | { kind: "trial_ended"; trial: Trial } | { kind: "granted"; expiresAt: number; trial: Trial };

/** Called only after Apple's signature, sandbox environment and bundle checks. */
export async function acceptTestFlight(db: D1Database, account: string, receipt: AppTransaction,
  now = Date.now(), options: { deviceId?: string; policy?: TrialPolicy } = {}): Promise<TestFlightResult> {
  const signedAt = receipt.receiptCreationDate;
  if (receipt.receiptType !== "Sandbox" || receipt.bundleId !== "com.ziborov.granttap"
    || (receipt.appAppleId != null && receipt.appAppleId !== 6809739366)
    || !receipt.applicationVersion || !receipt.appTransactionId || receipt.appTransactionId.length > 200
    || !Number.isSafeInteger(signedAt) || signedAt! > now + 60_000 || signedAt! + LIFETIME <= now) return { kind: "invalid" };
  const expires = signedAt! + LIFETIME;
  const bound = await db.prepare(`INSERT INTO account_testflight_transactions(app_transaction_id,account_id,expires_at)
    VALUES(?,?,?) ON CONFLICT(app_transaction_id) DO UPDATE SET expires_at=MAX(expires_at,excluded.expires_at)
    WHERE account_testflight_transactions.account_id=excluded.account_id`)
    .bind(receipt.appTransactionId, account, expires).run();
  if (bound.meta.changes !== 1) return { kind: "bound_elsewhere" };
  const policy = options.policy ?? trialPolicy();
  // Exempt accounts are not trials, so they neither start nor inherit one.
  const subjects = policy.exempt(account) ? [] : trialSubjects(receipt.appTransactionId, options.deviceId);
  const start = Math.min(now, await inheritedTrialStart(db, subjects) ?? now);
  // A trial start is written once per account and can only move earlier; renewed
  // evidence extends the evidence lifetime, never the trial.
  const result = await db.prepare(`INSERT INTO account_beta_relay_grants(account_id,expires_at,trial_started_at)
    SELECT account_id,expires_at,? FROM account_testflight_transactions
      WHERE app_transaction_id=? AND account_id=?
    ON CONFLICT(account_id) DO UPDATE SET expires_at=MAX(expires_at,excluded.expires_at),
      trial_started_at=MIN(COALESCE(account_beta_relay_grants.trial_started_at,excluded.trial_started_at),
        excluded.trial_started_at)
      WHERE account_beta_relay_grants.revoked_at IS NULL`)
    .bind(start, receipt.appTransactionId, account).run();
  if (result.meta.changes !== 1) return { kind: "revoked" };
  const grant = (await testingGrant(db, account, policy, now))!;
  await recordTrialSubjects(db, subjects, grant.trial.startedAt);
  return grant.trial.active ? { kind: "granted", expiresAt: grant.accessUntil, trial: grant.trial }
    : { kind: "trial_ended", trial: grant.trial };
}

export async function routeTestFlight(request: Request, db: D1Database, auth: AccountAuth,
  receipts: AppleReceipts, policy: TrialPolicy = trialPolicy()): Promise<Response> {
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  const account = await auth.accountForToken(sessionToken(request));
  if (!account) return json(401, { error: "Sign in required." });
  const body = await boundedJSON(request);
  const signed = body?.signedAppTransaction;
  if (typeof signed !== "string" || !signed || signed.length > 15_000) {
    return json(400, { error: "A signed TestFlight app transaction is required.", code: "invalid_request" });
  }
  const deviceId = body?.deviceId ?? undefined;
  if (deviceId !== undefined && (typeof deviceId !== "string" || !UUID_TEXT.test(deviceId))) {
    return json(400, { error: "The device identifier must be a UUID.", code: "invalid_device_id" });
  }
  if (!receipts.appTransaction) {
    return json(503, { error: "TestFlight verification is not configured.", code: "not_configured" });
  }
  let receipt: AppTransaction;
  try { receipt = await receipts.appTransaction(signed); }
  catch { return json(400, { error: "Apple could not verify this app transaction.", code: "unverified_evidence" }); }
  const result = await acceptTestFlight(db, account, receipt, Date.now(), { deviceId, policy });
  switch (result.kind) {
    case "invalid":
      return json(400, { error: "A current TestFlight app transaction is required.", code: "unverified_evidence" });
    case "bound_elsewhere":
      return json(403, { error: "This beta access belongs to another account.", code: "evidence_bound_elsewhere" });
    case "revoked":
      return json(403, { error: "This beta access is revoked.", code: "revoked" });
    case "trial_ended":
      return json(403, { error: "The TestFlight trial has ended. A subscription is required.",
        code: "trial_ended", trial: result.trial });
    case "granted":
      return json(200, { expiresAt: result.expiresAt, trial: result.trial });
  }
}
