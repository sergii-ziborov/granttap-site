import { readFileSync } from "node:fs";
import { appleReceipts } from "../worker/account/subscriptions/apple";
import type { ManagedBilling } from "../worker/account/subscriptions/api";

/** Explicit production configuration. Sandbox purchases do not create paid server rights. */
export function configuredBilling(env: NodeJS.ProcessEnv): ManagedBilling | undefined {
  const roots = env.APPLE_RECEIPT_ROOTS?.split(":").filter(Boolean);
  const key = env.MANAGED_ADMISSION_KEY_PATH;
  if (!roots?.length && !key) return undefined;
  if (!roots?.length || !key) throw new Error("Managed billing configuration is incomplete.");
  const signingKey = readFileSync(key);
  if (signingKey.length < 32) throw new Error("Managed admission signing key is invalid.");
  return { receipts: appleReceipts(roots.map(path => readFileSync(path))), signingKey };
}
