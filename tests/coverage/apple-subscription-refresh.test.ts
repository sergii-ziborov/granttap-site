// @vitest-environment node
import { generateKeyPairSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { AppStoreServerAPIClient, Environment, SignedDataVerifier, Status } from "@apple/app-store-server-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import fetch from "node-fetch";
import { appleSubscriptionRefresh } from "../../worker/account/subscriptions/apple-api";

vi.mock("node-fetch", () => ({ default: vi.fn() }));
const roots = [readFileSync(new URL("../../worker/account/subscriptions/AppleRootCA-G3.cer", import.meta.url))];
const key = generateKeyPairSync("ec", { namedCurve: "prime256v1" }).privateKey
  .export({ type: "pkcs8", format: "pem" }).toString();
const refresh = () => appleSubscriptionRefresh(roots, key, "fixture", "issuer");
const receipt = { originalTransactionId: "original", environment: Environment.PRODUCTION,
  bundleId: "com.ziborov.granttap", signedDate: 1, expiresDate: 10 };
const response = (items?: object[]) => ({ environment: Environment.PRODUCTION,
  bundleId: receipt.bundleId, ...(items ? { data: [{ lastTransactions: items }] } : {}) });
afterEach(() => vi.restoreAllMocks());

describe("Apple account subscription reconciliation", () => {
  it("bounds authenticated production requests and returns verified current status", async () => {
    vi.mocked(fetch).mockResolvedValue({ status: 200, ok: true,
      json: async () => response([{ signedTransactionInfo: "transaction" }]) } as never);
    vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue(receipt);
    expect(await refresh()("original")).toEqual([receipt]);
    const [url, options] = vi.mocked(fetch).mock.calls.at(-1)!;
    expect(String(url)).toContain("https://api.storekit.apple.com/inApps/v1/subscriptions/original");
    expect(options).toMatchObject({ redirect: "error", size: 200_000 });
    expect(options?.signal).toBeInstanceOf(AbortSignal);
  });

  it("refuses sandbox, another bundle, invalid signatures and mismatched renewals", async () => {
    const query = vi.spyOn(AppStoreServerAPIClient.prototype, "getAllSubscriptionStatuses");
    for (const value of [{ ...response(), environment: Environment.SANDBOX },
      { ...response(), bundleId: "another.app" }]) {
      query.mockResolvedValue(value);
      await expect(refresh()("original")).rejects.toThrow("environment mismatch");
    }
    query.mockResolvedValue(response([{ signedTransactionInfo: "unsigned" }]));
    await expect(refresh()("original")).rejects.toThrow();
    vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue(receipt);
    query.mockResolvedValue(response([{ signedTransactionInfo: "t", signedRenewalInfo: "r" }]));
    const renewal = vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeRenewalInfo");
    for (const value of [{ originalTransactionId: "other", environment: Environment.PRODUCTION },
      { originalTransactionId: "original", environment: Environment.SANDBOX }]) {
      renewal.mockResolvedValue(value);
      await expect(refresh()("original")).rejects.toThrow("renewal scope mismatch");
    }
  });

  it("uses only verified grace dates and newer renewal timestamps", async () => {
    const query = vi.spyOn(AppStoreServerAPIClient.prototype, "getAllSubscriptionStatuses");
    vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeTransaction").mockResolvedValue(receipt);
    const renewal = vi.spyOn(SignedDataVerifier.prototype, "verifyAndDecodeRenewalInfo")
      .mockResolvedValue({ originalTransactionId: "original", environment: Environment.PRODUCTION,
        signedDate: 2, gracePeriodExpiresDate: 20 });
    query.mockResolvedValue(response([{ status: Status.BILLING_GRACE_PERIOD,
      signedTransactionInfo: "t", signedRenewalInfo: "r" }, {}]));
    expect(await refresh()("original")).toEqual([{ ...receipt, signedDate: 2, expiresDate: 20 }]);
    query.mockResolvedValue(response([{ status: Status.ACTIVE, signedTransactionInfo: "t", signedRenewalInfo: "r" }]));
    expect((await refresh()("original"))[0].expiresDate).toBe(10);
    renewal.mockResolvedValue({ originalTransactionId: "original", environment: Environment.PRODUCTION });
    expect((await refresh()("original"))[0]).toEqual(receipt);
    query.mockResolvedValue(response());
    expect(await refresh()("original")).toEqual([]);
    query.mockResolvedValue({ ...response(), data: [{}] });
    expect(await refresh()("original")).toEqual([]);
  });
});
