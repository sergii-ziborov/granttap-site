# Account page

`AccountView.tsx` is the browser entry point for the GrantTap account. It uses
the account API served by Hetzner in production (`/api/account/`), keeps the
session in an HttpOnly cookie and never sees a bearer token. Native clients
store their bearer in the platform Keychain. The page stays outside the public
product-navigation sitemap.

## Signed out

`SignInMethods` offers one explicit choice between four ways in, passkey first:

- **Passkey** (recommended, default): Face ID, Touch ID or a password manager;
  "Use a passkey from another device" asks the browser for a hybrid (phone)
  passkey. Creating an account is a separate, quieter action.
- **iPhone QR** (`PhoneSignIn`): the page makes an ephemeral NaCl key pair and
  shows `https://granttap.com/sign-in#qr=<code>.<browserKey>` as a QR
  (`QrCode`). A signed-in iPhone scans it and approves; the page polls every two
  seconds and receives a delegated session cookie. Codes renew themselves five
  times, then wait for a click. If the owner also ticked the key on the phone,
  the page opens the sealed bundle with its own secret, checks digest, schema
  and account, and deposits it once (`web-key`).
- **Password** (`AccountPassword`): sign in or create, feedback beside fields.
- **Sign-in token** (`AccountTokenAccess`): a temporary token or its link from
  the app, after explicit acknowledgement of browser-code access.

A successful sign-in returns to `/control` only for the literal
`returnTo=control` (`return-path.ts`).

## Signed in

`SignedInAccount` loads `summary`, `devices` and `web-key` and shows sections
with a section index (a sticky rail on wide screens, wrapping links on phones):

- **Account**: ID with copy, creation date, how browser key storage differs.
- **Sign-in methods**: passkey count, password login, active sign-in tokens;
  managing them stays in the app.
- **Devices** (`Devices`): every session and computer link with kind, sign-in
  method, last activity and a "This browser" badge; Sign out / Remove and
  "Remove devices not seen for 30 days" each ask in place (`ConfirmAction`).
  Sessions from before the service recorded device details sit apart under
  **Older sign-ins** ("Older sign-in · since Nov 2, 2026 · no use recorded"),
  with "Remove N older sign-ins" (`POST devices/prune {"older": true}`). Tests:
  `tests/devices.test.tsx`.
- **Encryption key** (`EncryptionKey`): says whether the account holds the chat
  key. Without it, computers are listed with "Chats encrypted · key a1b2c3…" and
  the page explains that GrantTap's servers keep no chat names. The risk text is
  shown before the owner asks the iPhone for the key and while it is stored;
  "Remove the key from my account" asks first.
- **Subscription**: managed publishing per computer and subscription support.
- **Danger zone**: sign out, delete account. A QR-signed browser cannot delete
  the account and says how to do it instead.

The `/connect` MCP authorization page uses a fresh passkey assertion from this
account service to approve a coding app on Mac. That approval issues a local
MCP OAuth token and does not create a computer pairing or restore a phone.

## Subscription support

[SubscriptionSupport](SubscriptionSupport.tsx) preserves a direct link to Apple
subscription settings and offers optional feedback to signed-in accounts. It
does not cancel a subscription or run a web checkout. Eligible Apple promotional
offers are confirmed in the native app through StoreKit. Feedback tests live in
[tests/subscription-support.test.tsx](tests/subscription-support.test.tsx); the
HTTP, receipt-history and durable-state contract belongs to
[SubscriptionRetention](../../worker/account/subscription-retention/README.md).

Tests: `tests/coverage/account-view.test.tsx` and `tests/` beside each module.
Screenshots: `node --import tsx scripts/qa/account-shots.mjs <dir>` after
`npm run build && npm run build:runtime`.
