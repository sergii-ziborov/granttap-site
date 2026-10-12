# Managed subscription admission

`ManagedSubscriptions` persists Apple-verified Personal receipts and admits
stable account computer identities atomically. The authenticated machine token chooses its identity; clients cannot supply a seat identity. Product IDs determine 2/5/10/15 seats;
client-supplied limits are never used. Receipts are bound to the account UUID
through `appAccountToken`, and newer signed Apple data supersedes old data.

Linked computer slots survive network failures. A downgrade keeps the oldest
allowed computers; replacement explicitly releases a slot. Expiry and refund
stop admission while preserving computer identity and local content. Relay
leases last at most five minutes. Separate operator-issued beta grants have
their own expiry and are not purchases. Self-hosted relays do not use this API.

The HTTP boundary verifies Apple's signatures before calling the ledger.
Tests are in `tests/coverage/managed-subscriptions.test.ts`.

Copyright (c) 2026 Serhii Ziborov. See the GrantTap Commercial Source License in the repository root.
