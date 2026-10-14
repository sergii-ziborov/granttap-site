import type { AppleReceipts } from "./apple";
import { ManagedSubscriptions, isManagedSubscription } from "./index";

const caches = new WeakMap<AppleReceipts, Map<string, { checkedAt: number; pending?: Promise<void> }>>();

/** Only a transaction already verified for this authenticated account is queried. */
export async function reconcileSubscription(ledger: ManagedSubscriptions, receipts: AppleReceipts,
  accountId: string, now = Date.now()): Promise<void> {
  if (!receipts.refresh) return;
  const original = await ledger.originalTransaction(accountId);
  if (!original) return;
  let cache = caches.get(receipts);
  if (!cache) { cache = new Map(); caches.set(receipts, cache); }
  const key = `${accountId}:${original}`;
  const previous = cache.get(key);
  if (previous?.pending) return previous.pending;
  if (previous && now - previous.checkedAt < 300_000) return;
  const entry = { checkedAt: 0, pending: undefined as Promise<void> | undefined };
  entry.pending = (async () => {
    const records = (await receipts.refresh!(original)).filter(isManagedSubscription);
    if (!records.length) throw new Error("Apple returned no verified subscription status.");
    for (const receipt of records) {
      if (receipt.appAccountToken?.toLowerCase() !== accountId.toLowerCase()) {
        throw new Error("Apple subscription account scope mismatch.");
      }
      await ledger.acceptVerified(accountId, receipt);
    }
    entry.checkedAt = Date.now();
  })();
  cache.set(key, entry);
  if (cache.size > 1_000) cache.delete(cache.keys().next().value!);
  try { await entry.pending; }
  catch (error) { cache.delete(key); throw error; }
  finally { entry.pending = undefined; }
}
