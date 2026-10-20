import { Environment, GetTransactionHistoryVersion, PromotionalOfferSignatureCreator,
  SignedDataVerifier, type JWSTransactionDecodedPayload } from "@apple/app-store-server-library";
import { BoundedAppleClient } from "../subscriptions/apple-api";
import { isManagedSubscription } from "../subscriptions";
import type { RetentionBilling } from "./api";
import { retentionOfferIDs } from ".";

/** Signing material stays on the account server; every history page is Apple verified. */
export function appleRetentionBilling(roots: Buffer[], key: string, keyId: string, issuer: string): RetentionBilling {
  const bundle = "com.ziborov.granttap";
  const signer = new PromotionalOfferSignatureCreator(key, keyId, bundle);
  const client = new BoundedAppleClient(key, keyId, issuer, bundle, Environment.PRODUCTION);
  const verifier = new SignedDataVerifier(roots, true, Environment.PRODUCTION, bundle, 6809739366);
  return {
    keyId,
    sign: (account, grant) => signer.createSignature(grant.productId, grant.offerId,
      account.toLowerCase(), grant.nonce.toLowerCase(), grant.timestamp),
    unusedHistory: async (account, original) => {
      let revision: string | null = null;
      let latest: JWSTransactionDecodedPayload | null = null;
      for (let page = 0; page < 10; page++) {
        const history = await client.getTransactionHistory(original, revision,
          { productIds: Object.keys(retentionOfferIDs) }, GetTransactionHistoryVersion.V2);
        if (history.environment !== Environment.PRODUCTION || history.bundleId !== bundle
          || history.appAppleId !== 6809739366 || !history.signedTransactions?.length) return false;
        for (const signed of history.signedTransactions) {
          const receipt = await verifier.verifyAndDecodeTransaction(signed);
          if (!isManagedSubscription(receipt) || receipt.environment !== Environment.PRODUCTION
            || receipt.bundleId !== bundle || receipt.appAccountToken?.toLowerCase() !== account.toLowerCase()) return false;
          if (Object.values(retentionOfferIDs).includes(receipt.offerIdentifier ?? "")) return false;
          if (receipt.originalTransactionId === original
            && (!latest || (receipt.purchaseDate ?? 0) >= (latest.purchaseDate ?? 0))) latest = receipt;
        }
        if (!history.hasMore) return !!latest && latest.revocationDate == null && !latest.isUpgraded;
        if (!history.revision || history.revision === revision) return false;
        revision = history.revision;
      }
      return false;
    },
  };
}
