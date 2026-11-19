# Managed subscription admission

The authenticated entitlement endpoint shares an Apple-verified account plan
with linked clients for a five-minute authorization interval. Verified
introductory free-trial receipts retain Apple's expiry; app updates cannot
restart the trial. A paid plan takes precedence over temporary testing grants.
The optional App Store Server API key reconciles existing verified transaction
identities and missed revocations. Lookups have a six-second deadline and never
authorize another account or silently extend a missing Apple status.

`ManagedSubscriptions` persists Apple-verified Personal receipts and admits
stable account computer identities atomically. The authenticated machine token chooses its identity; clients cannot supply a seat identity. Product IDs determine 2/5/15 seats;
client-supplied limits are never used. Receipts are bound to the account UUID
through `appAccountToken`, and newer signed Apple data supersedes old data.

Linked computer slots survive network failures. A downgrade keeps the oldest
allowed computers; replacement explicitly releases a slot. Expiry and refund
stop admission while preserving computer identity and local content. Relay
leases last at most five minutes. Separate beta grants have their own expiry and are not purchases;
operator revocation always wins. Self-hosted relays do not use this API.

Every build needs a subscription for the relay, TestFlight included; a TestFlight
build gets nothing for its app transaction (`subscriptions/testflight` answers
410 `subscription_required`). The receipt endpoint verifies a transaction as
Production first; one Apple signed for the Sandbox (TestFlight and App Review
purchases, Apple's free week included) is kept in `account_sandbox_subscriptions`
and grants the same plan and ticket (`source: "subscription"`). Sandbox purchases
are never sent to Apple's production API or offered retention pricing, and Apple
sends no sandbox renewals here: the app uploads each one. A production plan wins,
then a sandbox plan, then an operator's grant, then the App Review account listed
in `GRANTTAP_REVIEW_ACCOUNTS` (`../review-access.ts`), which is admitted without a
purchase as `source: "beta"`.

The HTTP boundary verifies Apple's signatures before calling the ledger.
Tests are in `tests/coverage/managed-subscriptions.test.ts`.

Copyright (c) 2026 Serhii Ziborov. See the GrantTap Commercial Source License in the repository root.
