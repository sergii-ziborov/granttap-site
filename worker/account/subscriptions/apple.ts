import { Environment, SignedDataVerifier } from "@apple/app-store-server-library";
import type { JWSTransactionDecodedPayload } from "@apple/app-store-server-library";

export interface AppleReceipts {
  transaction(signedData: string): Promise<JWSTransactionDecodedPayload>;
  notification(signedData: string): Promise<JWSTransactionDecodedPayload | null>;
  refresh?(originalId: string): Promise<JWSTransactionDecodedPayload[]>;
}

/** Trusted roots come from the server's configuration, never a client JWS. */
export function appleReceipts(roots: Buffer[]): AppleReceipts {
  if (!roots.length) throw new Error("Apple receipt trust roots are not configured.");
  const verifier = new SignedDataVerifier(roots, true, Environment.PRODUCTION,
    "com.ziborov.granttap", 6809739366);
  return {
    transaction: data => verifier.verifyAndDecodeTransaction(data),
    notification: async data => {
      const outer = await verifier.verifyAndDecodeNotification(data);
      const transaction = outer.data?.signedTransactionInfo;
      if (!transaction) return null;
      const receipt = await verifier.verifyAndDecodeTransaction(transaction);
      const renewalData = outer.data?.signedRenewalInfo;
      const renewal = renewalData ? await verifier.verifyAndDecodeRenewalInfo(renewalData) : null;
      if (renewal && (renewal.originalTransactionId !== receipt.originalTransactionId
        || renewal.environment !== receipt.environment)) throw new Error("Renewal scope mismatch.");
      const grace = outer.subtype === "GRACE_PERIOD" ? renewal?.gracePeriodExpiresDate : undefined;
      return { ...receipt,
        // Both authorization timestamps are verified Apple data. An old device
        // transaction must not overwrite a newer expiry/refund/grace notification.
        signedDate: Math.max(receipt.signedDate ?? 0, outer.signedDate ?? 0),
        expiresDate: grace == null ? receipt.expiresDate : Math.max(receipt.expiresDate ?? 0, grace) };
    },
  };
}
