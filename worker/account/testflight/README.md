# TestFlight account access

The authenticated endpoint verifies Apple's signed sandbox app transaction for
GrantTap and persists a testing grant without a subscription. A transaction can
belong to only one GrantTap account. Replay cannot clear an operator revocation.
These grants are never recorded as purchases or Apple subscription trials.
Production subscription verification remains separate. Clients cannot supply a
seat count or claim beta access with a boolean. No prompt or provider key is sent.

## Seven-day trial

The first grant records the account's trial start on the server. Managed access
from the grant ends seven days later (`TRIAL_LENGTH` in `trial.ts`); after that
the account needs a subscription, which in TestFlight is a sandbox purchase.
Within the trial the grant also ends no later than 90 days after Apple's signed
receipt date, and fresh evidence renews only that limit. The start never moves
later: reinstalling, signing in again or new evidence keeps it.

Apple's app transaction id is the same for one Apple Account on every reinstall
and device. Its SHA-256 hash, and the hash of the optional `deviceId` the app
keeps in its Keychain, are stored with the earliest trial start in
`testflight_trial_evidence`. That record outlives the GrantTap account, so a new
account with the same Apple Account or device inherits the earlier start.

Accounts listed in `GRANTTAP_TRIAL_EXEMPT_ACCOUNTS` (account UUIDs separated by
commas or whitespace) keep the grant's full lifetime without the trial limit and
do not record trial evidence. A malformed list stops the account service at
startup. Grants inserted without a start begin their trial at insertion; grants
that existed before the trial column begin it when the column is added.

The response carries `trial: { startedAt, endsAt, active, exempt }`; `endsAt` is
null only for an exempt account. Refusals carry a `code`: `invalid_request`,
`invalid_device_id`, `unverified_evidence`, `evidence_bound_elsewhere`,
`revoked`, `trial_ended` (with `trial`) and `not_configured`.

The existing managed admission and relay signature checks still apply. The app
must sign in to link computers. TestFlight controls the actual build expiry.
Tests: tests/coverage/testflight-access.test.ts and
tests/coverage/testflight-trial.test.ts.
