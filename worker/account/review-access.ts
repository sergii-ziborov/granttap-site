/** How long the App Review account's access lasts before the service is asked again. */
export const REVIEW_ACCESS_LEASE = 86_400_000;
const UUID_TEXT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ReviewAccess = { includes(accountId: string): boolean };
let cached: { raw: string; access: ReviewAccess } | undefined;

/**
 * `GRANTTAP_REVIEW_ACCOUNTS` lists the account UUIDs, separated by commas or
 * whitespace, that reach the GrantTap relay without a purchase: the App Review
 * demo account. Everyone else needs a subscription, production or sandbox. A
 * malformed entry is a configuration error rather than an ignored line.
 */
export function reviewAccess(env: Record<string, string | undefined> = globalThis.process?.env ?? {}): ReviewAccess {
  const raw = env.GRANTTAP_REVIEW_ACCOUNTS ?? "";
  if (cached?.raw === raw) return cached.access;
  const ids = raw.split(/[\s,]+/).filter(Boolean);
  if (ids.some(id => !UUID_TEXT.test(id))) throw new Error("GRANTTAP_REVIEW_ACCOUNTS must list account UUIDs.");
  const listed = new Set(ids.map(id => id.toLowerCase()));
  const access = { includes: (accountId: string) => listed.has(accountId.toLowerCase()) };
  cached = { raw, access };
  return access;
}
