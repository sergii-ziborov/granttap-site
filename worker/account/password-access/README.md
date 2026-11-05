# Account password access

`routePasswordAccess` adds ordinary username/password registration, sign-in and
credential management to the existing Account Mesh. There is no reviewer-only
login or policy override. Passkeys, private sign-in tokens and independent QR
pairing keep their existing routes. Password sessions can link computers through
the same account API; delegated login-token sessions cannot manage credentials.

Credentials use independently salted PBKDF2-HMAC-SHA256 with 600,000 iterations,
NFC password normalization and constant-time hash comparison. New passwords have
15–128 Unicode code points. Logins are case-insensitive ASCII identifiers of
3–64 characters. Responses never echo a password. Native clients receive a
bearer; browsers receive only an HttpOnly, Secure, SameSite cookie. Sign-in
failures use the same response for absent users and wrong passwords, including
a dummy KDF. Persisted counters bound attempts per login and trusted proxy
address over fifteen minutes, with a capped table and indexed expiry cleanup.

The production account service uses Node crypto on Hetzner. The optional Workers
runtime must support this exact KDF cost; do not reduce the work factor to fit
an edge runtime. Production acceptance runs against the Node server and durable
SQLite, separately from the website image.

Authenticated users may add credentials to their existing account. Replacing an
existing credential requires the current password and revokes account sessions;
it returns a new session. Computer registrations and independent QR pairings are
not removed. Existing passkeys remain an alternate access method for accounts that already
have them. Adding a new passkey to a password-only account is not implemented.
Password reset without
the current password is not an implemented email recovery flow.

Tests live beside the module and use the real prepared SQLite surface. They
cover durable sessions, hashes, normalization, boundaries, quotas, cross-origin
rejection, browser/native token exposure, account deletion and credential scope.
Reference: [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
