# Browser sign-in keys

Public entry: `routeBrowserTokenAccess` in `index.ts`. Explicit same-origin POST
exchanges an existing native-issued login token for an HttpOnly, Secure,
SameSite=Strict account cookie. No bearer, secret or pairing material is returned
to browser JavaScript. The cookie cannot outlive the grant, and the durable
session retains its limited origin, expiry, use limit and revocation checks.
Keys never enter query parameters. Rate limits store only hashed buckets.

Native token issuance and redemption retain their existing browser restrictions.
This route cannot issue keys or lasting credentials. Tests use isolated SQLite
and verify durable session authority, revocation and rejected cross-site access.
