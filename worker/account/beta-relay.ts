import type { D1Database } from "@cloudflare/workers-types";
import { testingGrant, trialPolicy, type Trial, type TrialPolicy } from "./testflight/trial";

/** A time-limited tester grant is bound to an authenticated account, not a device. */
export class AccountBetaRelay {
  constructor(private readonly db: D1Database,
              private readonly now: () => number = Date.now,
              private readonly policy: TrialPolicy = trialPolicy()) {}

  /** `expiresAt` already includes the trial limit; `trial` is null before the first grant. */
  async state(accountId: string): Promise<{ expiresAt: number | null; trial: Trial | null }> {
    const grant = await testingGrant(this.db, accountId, this.policy, this.now());
    return { expiresAt: grant?.trial.active ? grant.accessUntil : null, trial: grant?.trial ?? null };
  }

  async activeUntil(accountId: string): Promise<number | null> {
    return (await this.state(accountId)).expiresAt;
  }
}
