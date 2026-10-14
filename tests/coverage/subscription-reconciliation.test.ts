// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { SqliteD1 } from "./account-sqlite";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import { reconcileSubscription } from "../../worker/account/subscriptions/reconcile";
import type { AppleReceipts } from "../../worker/account/subscriptions/apple";
import { D1AccountStore } from "../../worker/account/d1-store";

const account = "12345678-1234-4123-8123-123456789012";
async function fixture() {
  const db = new SqliteD1();
  await new D1AccountStore(db as unknown as D1Database).createAccount(account,
    { id: "fixture", accountId: account, publicKey: new Uint8Array([1]), counter: 0 });
  const ledger = new ManagedSubscriptions(db as unknown as D1Database);
  const receipt = { originalTransactionId: "original", transactionId: "transaction", appAccountToken: account,
    bundleId: "com.ziborov.granttap", environment: "Production", type: "Auto-Renewable Subscription",
    productId: "com.ziborov.granttap.personal.solo.monthly", purchaseDate: Date.now() - 1_000,
    signedDate: Date.now(), expiresDate: Date.now() + 900_000 };
  const receipts: AppleReceipts = { transaction: async () => receipt, notification: async () => receipt };
  return { db, ledger, receipt, receipts };
}

describe("durable Apple reconciliation", () => {
  it("does not query unpurchased accounts and coalesces concurrent verified lookups", async () => {
    const { db, ledger, receipt, receipts } = await fixture();
    let calls = 0;
    receipts.refresh = async () => { calls++; return [receipt]; };
    await reconcileSubscription(ledger, receipts, account);
    expect(calls).toBe(0);
    await ledger.acceptVerified(account, receipt);
    await Promise.all([reconcileSubscription(ledger, receipts, account), reconcileSubscription(ledger, receipts, account)]);
    expect(calls).toBe(1);
    await reconcileSubscription(ledger, receipts, account);
    expect(calls).toBe(1);
    await reconcileSubscription(ledger, receipts, account, Date.now() + 300_001);
    expect(calls).toBe(2);
    receipts.refresh = undefined;
    await reconcileSubscription(ledger, receipts, account);
    expect(calls).toBe(2);
    db.sqlite.close();
  });

  it("does not authorize from failed, empty or cross-account responses and retries recovery", async () => {
    const { db, ledger, receipt, receipts } = await fixture();
    await ledger.acceptVerified(account, receipt);
    receipts.refresh = async () => { throw Error("Apple unavailable"); };
    await expect(reconcileSubscription(ledger, receipts, account)).rejects.toThrow("unavailable");
    receipts.refresh = async () => [];
    await expect(reconcileSubscription(ledger, receipts, account)).rejects.toThrow("no verified");
    receipts.refresh = async () => [{ ...receipt, appAccountToken: "other-account" }];
    await expect(reconcileSubscription(ledger, receipts, account)).rejects.toThrow("scope mismatch");
    receipts.refresh = async () => [{ ...receipt, revocationDate: Date.now(), signedDate: receipt.signedDate + 1 }];
    await reconcileSubscription(ledger, receipts, account);
    expect(await ledger.entitlement(account)).toBeNull();
    db.sqlite.close();
  });
});
