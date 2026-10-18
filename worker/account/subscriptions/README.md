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
leases last at most five minutes. Separate beta grants have their own expiry and are not purchases. Verified
TestFlight app transactions can obtain beta access through `../testflight`;
operator revocation always wins. Self-hosted relays do not use this API.

The HTTP boundary verifies Apple's signatures before calling the ledger.
Tests are in `tests/coverage/managed-subscriptions.test.ts`.

Copyright (c) 2026 Serhii Ziborov. See the GrantTap Commercial Source License in the repository root.
