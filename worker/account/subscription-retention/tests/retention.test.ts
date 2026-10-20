// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { expect, test } from "vitest";
import { SqliteD1 } from "../../sqlite";
import { ManagedSubscriptions } from "../../subscriptions";
import { SubscriptionRetention } from "..";

const account = "12345678-1234-4123-8123-123456789012";
const productId = "com.ziborov.granttap.personal.solo.monthly";
const nonce = "32345678-1234-4123-8123-123456789012";

async function subscribed() {
  const durable = new SqliteD1(":memory:");
  const db = durable as unknown as D1Database;
  durable.sqlite.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").run(account, 1);
  const ledger = new ManagedSubscriptions(db, () => 1_000);
  await ledger.acceptVerified(account, { originalTransactionId: "original", transactionId: "renewal",
    appAccountToken: account, bundleId: "com.ziborov.granttap", environment: "Production", productId,
    type: "Auto-Renewable Subscription", purchaseDate: 100, signedDate: 900, expiresDate: 500_000 });
  return { durable, db };
}

test("a verified subscriber receives one reusable cancellation-offer grant, without changing seats", async () => {
  const { db } = await subscribed();
  const service = new SubscriptionRetention(db, () => 1_000);
  const signer = { keyId: "key", sign: () => "signature" };
  const first = await service.issue(account, nonce, signer, true);
  expect(first).toMatchObject({ productId, nonce, timestamp: 1_000 });
  expect(await service.issue(account, "42345678-1234-4123-8123-123456789012", signer, true)).toEqual(first);
  expect(await new ManagedSubscriptions(db, () => 1_000).selectedComputerCount(account)).toBe(0);
});


test("cached signatures are stable and expired grants cannot overlap Apple's 24-hour validity", async () => {
  const { db } = await subscribed();
  let now = 1_000;
  let signatures = 0;
  const signer = { keyId: "key", sign: () => `signature-${++signatures}` };
  const service = new SubscriptionRetention(db, () => now);
  const first = await service.issue(account, nonce, signer, true);
  expect(first?.signature).toBe("signature-1");
  expect(await service.issue(account, crypto.randomUUID(), signer, true)).toEqual(first);
  expect(signatures).toBe(1);
  now += 23 * 60 * 60 * 1_000;
  expect(await service.issue(account, crypto.randomUUID(), signer, true)).toBeNull();
  now += 66 * 60 * 1_000;
  expect(await service.issue(account, crypto.randomUUID(), signer, false)).toBeNull();
  const renewed = await service.issue(account, crypto.randomUUID(), signer, true);
  expect(renewed?.nonce).not.toBe(nonce);
  expect(signatures).toBe(2);
});

test("an already redeemed discount stays unavailable across tiers and service restarts", async () => {
  const { db } = await subscribed();
  const service = new SubscriptionRetention(db, () => 1_000);
  const signer = { keyId: "key", sign: () => "signature" };
  const offer = await service.issue(account, nonce, signer, true);
  await new ManagedSubscriptions(db, () => 1_000).acceptVerified(account, {
    originalTransactionId: "original", transactionId: "discount", appAccountToken: account,
    bundleId: "com.ziborov.granttap", environment: "Production", productId,
    type: "Auto-Renewable Subscription", purchaseDate: 950, signedDate: 1_000,
    expiresDate: 500_000, offerIdentifier: offer!.offerId,
  });
  expect(await new SubscriptionRetention(db, () => 1_000).issue(account, nonce, signer, true)).toBeNull();
  expect(await service.issue("22345678-1234-4123-8123-123456789012", nonce, signer, true)).toBeNull();
});
