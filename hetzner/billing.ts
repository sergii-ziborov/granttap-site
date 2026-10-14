import { readFileSync } from "node:fs";
import { appleReceipts } from "../worker/account/subscriptions/apple";
import type { ManagedBilling } from "../worker/account/subscriptions/api";
import { appleSubscriptionRefresh } from "../worker/account/subscriptions/apple-api";

/** Explicit production configuration. Sandbox purchases do not create paid server rights. */
export function configuredBilling(env: NodeJS.ProcessEnv): ManagedBilling | undefined {
  const roots = env.APPLE_RECEIPT_ROOTS?.split(":").filter(Boolean);
  const key = env.MANAGED_ADMISSION_KEY_PATH;
  if (!roots?.length && !key) return undefined;
  if (!roots?.length || !key) throw new Error("Managed billing configuration is incomplete.");
  const signingKey = readFileSync(key);
  if (signingKey.length < 32) throw new Error("Managed admission signing key is invalid.");
  const trustedRoots = roots.map(path => readFileSync(path));
  const receipts = appleReceipts(trustedRoots);
  if (env.APP_STORE_KEY_PATH || env.APP_STORE_KEY_ID || env.APP_STORE_ISSUER_ID) {
    if (!env.APP_STORE_KEY_PATH || !env.APP_STORE_KEY_ID || !env.APP_STORE_ISSUER_ID) {
      throw new Error("App Store Server API configuration is incomplete.");
    }
    receipts.refresh = appleSubscriptionRefresh(trustedRoots,
      readFileSync(env.APP_STORE_KEY_PATH, "utf8"), env.APP_STORE_KEY_ID, env.APP_STORE_ISSUER_ID);
  }
  return { receipts, signingKey };
}
