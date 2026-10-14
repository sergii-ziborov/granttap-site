import { AppStoreServerAPIClient, Environment, SignedDataVerifier, Status } from "@apple/app-store-server-library";
import type { AppleReceipts } from "./apple";
import fetch from "node-fetch";

class BoundedAppleClient extends AppStoreServerAPIClient {
  protected makeFetchRequest(path: string, query: URLSearchParams, method: string,
    body: string | Buffer | undefined, headers: Record<string, string>): Promise<fetch.Response> {
    return fetch(`https://api.storekit.apple.com${path}?${query}`, {
      method, body, headers, signal: AbortSignal.timeout(6_000), redirect: "error", size: 200_000,
    });
  }
}

export function appleSubscriptionRefresh(roots: Buffer[], key: string, keyId: string, issuer: string):
  NonNullable<AppleReceipts["refresh"]> {
  const client = new BoundedAppleClient(key, keyId, issuer, "com.ziborov.granttap", Environment.PRODUCTION);
  const verifier = new SignedDataVerifier(roots, true, Environment.PRODUCTION, "com.ziborov.granttap", 6809739366);
  return async original => {
    const result = await client.getAllSubscriptionStatuses(original);
    if (result.environment !== Environment.PRODUCTION || result.bundleId !== "com.ziborov.granttap") {
      throw new Error("Apple response environment mismatch.");
    }
    const transactions = [];
    for (const group of result.data ?? []) {
      for (const item of group.lastTransactions ?? []) {
        if (!item.signedTransactionInfo) continue;
        const receipt = await verifier.verifyAndDecodeTransaction(item.signedTransactionInfo);
        const renewal = item.signedRenewalInfo
          ? await verifier.verifyAndDecodeRenewalInfo(item.signedRenewalInfo) : null;
        if (renewal && (renewal.originalTransactionId !== receipt.originalTransactionId
          || renewal.environment !== Environment.PRODUCTION)) throw new Error("Apple renewal scope mismatch.");
        const grace = item.status === Status.BILLING_GRACE_PERIOD ? renewal?.gracePeriodExpiresDate : undefined;
        transactions.push({ ...receipt, signedDate: Math.max(receipt.signedDate ?? 0, renewal?.signedDate ?? 0),
          expiresDate: grace == null ? receipt.expiresDate : Math.max(receipt.expiresDate ?? 0, grace) });
      }
    }
    return transactions;
  };
}
