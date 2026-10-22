# Account login tokens

`index.ts` exposes the native account routes. `store.ts` owns durable grants,
SHA-256 hashes, atomic use limits, and revocation. Migration
`0011_account_login_tokens.sql` runs with the account SQLite startup migrations.

An existing trusted account session may create a named token for 15 minutes to
30 days, with 1–100 uses. Up to five active grants exist per account. Plaintext is
returned once; list responses contain metadata only. A redeemed token creates
an independent session bound to the grant's lifetime and revocation. A retained
origin marker prevents deleting a grant from turning its sessions into trusted
credentials. Such sessions cannot create further tokens, device invites, or
lasting machine credentials. Independent encrypted QR pairings are unaffected.

The secret is sent only in a POST body by native clients. `/sign-in#token=…`
keeps it out of HTTP URLs; its page never redeems it and requires explicit app
handoff. Browser origin/fetch headers are rejected by these routes. HTTPS and
the account service's admission/rate limits still apply. No provider credentials
or E2EE pairing keys belong in this module. Tests use isolated SQLite accounts.
