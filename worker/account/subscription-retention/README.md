# SubscriptionRetention

Optional Apple promotional offers and account-scoped cancellation feedback.
`api.ts` is the HTTP entry point, composed by the existing subscription router.
Tests live in `tests/` and use durable SQLite, real account sessions, and an actual
ECDSA signature verification. Apple network and certificate decoding boundaries
are isolated in Apple-specific tests.

A signed-in subscriber explicitly requests an offer. `apple.ts` checks complete,
bounded, Apple-verified production history belonging to that account, across all
three tiers. Prior use, refunds, invalid signatures, another account, an incomplete
history, or unavailable verification deny issuance. Beta rights alone do not qualify.
The ledger persists a signature for one nonce, records Apple-confirmed redemption
once per account, and waits beyond Apple's 24-hour signature life before renewal.
A receipt is still required for access; an offer signature is never an entitlement.

Configure `SUBSCRIPTION_OFFER_KEY_PATH`, `SUBSCRIPTION_OFFER_KEY_ID`, and
`SUBSCRIPTION_OFFER_ISSUER_ID` together, with an App Store Connect In-App Purchase
key. The private key is read only by the account server. Never include it in web
assets, app bundles, npm packages, metrics, or logs. Missing configuration hides
the offer; a failed Apple check is an explicit error. Trial and TestFlight admission
are unchanged. The offers must also exist for each product in App Store Connect.

Feedback is optional. A repeated UUID preserves its original content; simultaneous
requests cannot exceed five new entries per account per rolling day. Comments use
AES-256-GCM and a purpose-separated HKDF key from the existing managed admission
secret. Reasons and timestamps support a private support workflow, not analytics.
Account deletion cascades to feedback and offer records. Routine subscription
requests, reads and submissions purge feedback older than 90 days; an index keeps
that cleanup bounded. No public feedback-reading route is exposed.

An authorized operator can use `SubscriptionCancellationFeedback.readForOperator`
with the account database and private key. Reads return at most 100 entries, ordered
by creation time, account and feedback UUID. Pass the final entry as the compound
cursor to retrieve the next page without skipping same-time entries. Keep exported
support content private and never put it in capacity telemetry or shared logs.

Apple performs cancellation in its subscription settings. Neither HTTP endpoint
cancels or changes a plan, and the UI always exposes Apple management directly.
