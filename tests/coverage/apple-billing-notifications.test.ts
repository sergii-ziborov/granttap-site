// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { Environment, SignedDataVerifier, Subtype } from "@apple/app-store-server-library";
import { appleReceipts } from "../../worker/account/subscriptions/apple";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import { SqliteD1 } from "./account-sqlite";

afterEach(() => vi.restoreAllMocks());
const owner = "12345678-1234-4123-8123-123456789012";
const roots = [readFileSync(new URL("../../worker/account/subscriptions/AppleRootCA-G3.cer", import.meta.url))];

it("verified grace extends service and a later expiration cannot be undone by an old device receipt", async () => {
  const receipt = { originalTransactionId: "original", transactionId: "transaction", appAccountToken: owner,
    productId: "com.ziborov.granttap.personal.solo.monthly", type: "Auto-Renewable Subscription",
    bundleId: "com.ziborov.granttap", environment: Environment.PRODUCTION,
    purchaseDate: 500, signedDate: 1_000, expiresDate: 1_500 };
  const outer = { signedDate: 2_000, subtype: Subtype.GRACE_PERIOD,
    data: { signedTransactionInfo: "transaction", signedRenewalInfo: "renewal" } };
  vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeNotification").mockResolvedValue(outer);
  vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue(receipt);
  vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeRenewalInfo").mockResolvedValue({
    originalTransactionId: "original", environment: Environment.PRODUCTION, gracePeriodExpiresDate: 5_000,
  });
  const verifiedBoundary = appleReceipts(roots);
  const db = new SqliteD1();
  db.sqlite.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").run(owner, 1);
  const ledger = new ManagedSubscriptions(db as unknown as D1Database, () => 2_100);
  const grace = await verifiedBoundary.notification("signed-notification-fixture");
  expect(grace?.expiresDate).toBe(5_000);
  expect(await ledger.acceptVerified(owner, grace!)).toBe(true);
  expect((await ledger.entitlement(owner))?.expiresAt).toBe(5_000);
  outer.signedDate = 3_000;
  outer.subtype = Subtype.VOLUNTARY;
  const expired = await verifiedBoundary.notification("later-notification-fixture");
  expect(await ledger.acceptVerified(owner, expired!)).toBe(true);
  expect(await ledger.entitlement(owner)).toBeNull();
  expect(await ledger.acceptVerified(owner, receipt)).toBe(false);
});

it("renewal data must belong to the same transaction and production environment", async () => {
  vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeNotification").mockResolvedValue({
    data: { signedTransactionInfo: "transaction", signedRenewalInfo: "renewal" },
  });
  vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue({
    originalTransactionId: "original", environment: Environment.PRODUCTION,
  });
  const renewal = vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeRenewalInfo");
  const boundary = appleReceipts(roots);
  for (const data of [{ originalTransactionId: "different", environment: Environment.PRODUCTION },
    { originalTransactionId: "original", environment: Environment.SANDBOX }]) {
    renewal.mockResolvedValue(data);
    await expect(boundary.notification("fixture")).rejects.toThrow("Renewal scope mismatch");
  }
  vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeNotification").mockResolvedValue({});
  expect(await boundary.notification("without-transaction")).toBeNull();
});
