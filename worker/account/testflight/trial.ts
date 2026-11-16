import { createHash } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";

/** Managed access without a purchase lasts this long from an account's first TestFlight grant. */
export const TRIAL_LENGTH = 7 * 86_400_000;
export const UUID_TEXT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type TrialPolicy = { exempt(accountId: string): boolean };
/** `endsAt` is null only for an exempt account, whose grant has no trial limit. */
export type Trial = { startedAt: number; endsAt: number | null; active: boolean; exempt: boolean };
export type TestingGrant = { trial: Trial; accessUntil: number; revision: number };

let cached: { raw: string; policy: TrialPolicy } | undefined;

/**
 * `GRANTTAP_TRIAL_EXEMPT_ACCOUNTS` lists account UUIDs, separated by commas or
 * whitespace, whose TestFlight grant keeps its full lifetime without the trial
 * limit. A malformed entry is a configuration error rather than an ignored line.
 */
export function trialPolicy(env: Record<string, string | undefined> = globalThis.process?.env ?? {}): TrialPolicy {
  const raw = env.GRANTTAP_TRIAL_EXEMPT_ACCOUNTS ?? "";
  if (cached?.raw === raw) return cached.policy;
  const ids = raw.split(/[\s,]+/).filter(Boolean);
  if (ids.some(id => !UUID_TEXT.test(id))) {
    throw new Error("GRANTTAP_TRIAL_EXEMPT_ACCOUNTS must list account UUIDs.");
  }
  const exempt = new Set(ids.map(id => id.toLowerCase()));
  const policy = { exempt: (accountId: string) => exempt.has(accountId.toLowerCase()) };
  cached = { raw, policy };
  return policy;
}

type GrantRow = { expires_at: number; revoked_at: number | null; trial_started_at: number | null };

/** The account's TestFlight grant with its trial limit applied, or null if it never had one. */
export async function testingGrant(db: D1Database, accountId: string, policy: TrialPolicy,
  now: number): Promise<TestingGrant | null> {
  const row = await db.prepare(`SELECT expires_at,revoked_at,trial_started_at
    FROM account_beta_relay_grants WHERE account_id=?`).bind(accountId).first<GrantRow>();
  if (!row) return null;
  const exempt = policy.exempt(accountId);
  const startedAt = row.trial_started_at ?? 0;
  const endsAt = exempt ? null : startedAt + TRIAL_LENGTH;
  const accessUntil = endsAt === null ? row.expires_at : Math.min(row.expires_at, endsAt);
  return { trial: { startedAt, endsAt, active: row.revoked_at === null && accessUntil > now, exempt },
    accessUntil, revision: row.expires_at };
}

/**
 * Hashed identities of the Apple Account (its app transaction id is the same on
 * every reinstall and device) and, when the app sends one, of the device. These
 * records outlive the GrantTap account so a new account cannot restart a trial.
 */
export function trialSubjects(appTransactionId: string, deviceId?: string): string[] {
  const subject = (kind: "apple" | "device", value: string) =>
    `${kind}:${createHash("sha256").update(`granttap-trial-v1:${kind}:${value}`).digest("hex")}`;
  return [subject("apple", appTransactionId), ...deviceId ? [subject("device", deviceId.toLowerCase())] : []];
}

/** The earliest trial start already recorded for any of these identities. */
export async function inheritedTrialStart(db: D1Database, subjects: string[]): Promise<number | null> {
  if (!subjects.length) return null;
  const row = await db.prepare(`SELECT MIN(started_at) AS started FROM testflight_trial_evidence
    WHERE subject IN (${subjects.map(() => "?").join(",")})`).bind(...subjects).first<{ started: number | null }>();
  return row?.started ?? null;
}

/** A recorded start can only move earlier. */
export async function recordTrialSubjects(db: D1Database, subjects: string[], startedAt: number): Promise<void> {
  for (const subject of subjects) {
    await db.prepare(`INSERT INTO testflight_trial_evidence(subject,started_at) VALUES(?,?)
      ON CONFLICT(subject) DO UPDATE SET started_at=MIN(started_at,excluded.started_at)`)
      .bind(subject, startedAt).run();
  }
}
