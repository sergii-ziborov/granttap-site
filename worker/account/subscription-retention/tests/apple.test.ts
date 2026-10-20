// @vitest-environment node
import { generateKeyPairSync, verify } from "node:crypto";
import { readFileSync } from "node:fs";
import { AppStoreServerAPIClient, Environment, SignedDataVerifier } from "@apple/app-store-server-library";
import { afterEach, expect, test, vi } from "vitest";
import { appleRetentionBilling } from "../apple";
import { retentionOfferIDs } from "..";
const account = "12345678-1234-4123-8123-123456789012";
const productId = Object.keys(retentionOfferIDs)[0];
const roots = [readFileSync(new URL("../../subscriptions/AppleRootCA-G3.cer", import.meta.url))];
const pair = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const key = pair.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const billing = () => appleRetentionBilling(roots, key, "fixture", "issuer");
const transaction = { originalTransactionId: "original", appAccountToken: account, productId,
  bundleId: "com.ziborov.granttap", environment: Environment.PRODUCTION, purchaseDate: 10,
  type: "Auto-Renewable Subscription" };
const response = { environment: Environment.PRODUCTION, bundleId: transaction.bundleId,
  appAppleId: 6809739366, signedTransactions: ["verified"] };
afterEach(() => vi.restoreAllMocks());

test("the promotional signature binds the account, offer, product, nonce and timestamp", () => {
  const grant = { productId, offerId: retentionOfferIDs[productId], nonce: crypto.randomUUID(),
    timestamp: 1_000, expiresAt: 2_000, originalId: "original" };
  const signature = billing().sign(account.toUpperCase(), grant);
  const payload = [transaction.bundleId, "fixture", productId, grant.offerId,
    account, grant.nonce, grant.timestamp].join("\u2063");
  expect(verify("sha256", Buffer.from(payload), pair.publicKey, Buffer.from(signature, "base64"))).toBe(true);
  expect(verify("sha256", Buffer.from(payload.replace("original", "changed") + "changed"),
    pair.publicKey, Buffer.from(signature, "base64"))).toBe(false);
});

test("verified Apple history must be complete and belong to this account", async () => {
  const query = vi.spyOn(AppStoreServerAPIClient.prototype, "getTransactionHistory");
  const decode = vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue(transaction);
  query.mockResolvedValue(response);
  expect(await billing().unusedHistory(account, "original")).toBe(true);
  for (const value of [{ ...response, environment: Environment.SANDBOX },
    { ...response, bundleId: "another.app" }, { ...response, appAppleId: 1 },
    { ...response, signedTransactions: [] }]) {
    query.mockResolvedValue(value);
    expect(await billing().unusedHistory(account, "original")).toBe(false);
  }
  query.mockResolvedValue(response);
  for (const value of [{ ...transaction, appAccountToken: "other" },
    { ...transaction, productId: "other.product" }, { ...transaction, environment: Environment.SANDBOX },
    { ...transaction, bundleId: "other.app" }, { ...transaction, originalTransactionId: "other" },
    { ...transaction, revocationDate: 1 }, { ...transaction, isUpgraded: true },
    { ...transaction, offerIdentifier: Object.values(retentionOfferIDs)[1] }]) {
    decode.mockResolvedValue(value);
    expect(await billing().unusedHistory(account, "original")).toBe(false);
  }
  decode.mockRejectedValue(Error("invalid signature"));
  await expect(billing().unusedHistory(account, "original")).rejects.toThrow("invalid signature");
});

test("history pagination is bounded and cannot skip a previously redeemed offer", async () => {
  const query = vi.spyOn(AppStoreServerAPIClient.prototype, "getTransactionHistory");
  const decode = vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue(transaction);
  query.mockResolvedValueOnce({ ...response, hasMore: true, revision: "next" }).mockResolvedValueOnce(response);
  expect(await billing().unusedHistory(account, "original")).toBe(true);
  expect(query.mock.calls[1][1]).toBe("next");
  query.mockResolvedValue({ ...response, hasMore: true });
  expect(await billing().unusedHistory(account, "original")).toBe(false);
  query.mockResolvedValue({ ...response, hasMore: true, revision: "unchanged" });
  expect(await billing().unusedHistory(account, "original")).toBe(false);
  let pages = 0;
  query.mockImplementation(async () => ({ ...response, hasMore: true, revision: `page-${++pages}` }));
  expect(await billing().unusedHistory(account, "original")).toBe(false);
  expect(pages).toBe(10);
  query.mockResolvedValueOnce({ ...response, hasMore: true, revision: "next" }).mockResolvedValueOnce(response);
  decode.mockResolvedValueOnce(transaction).mockResolvedValueOnce({ ...transaction, offerIdentifier: retentionOfferIDs[productId] });
  expect(await billing().unusedHistory(account, "original")).toBe(false);
});
