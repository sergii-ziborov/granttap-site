# Browser sign-in by phone QR

Public entry: `routeQrSignIn` in `index.ts`, under `/api/account/qr-sign-in/`.
The iPhone contract lives outside this repository with the release notes; this
file describes the server boundary.

A granttap.com page (same-origin POST) creates a request with its ephemeral NaCl
public key and gets a random `code` (shown in the QR) and `secret` (kept in page
memory). The QR is `https://granttap.com/sign-in#qr=<code>.<browserKey>`; the
fragment never reaches a server. Only SHA-256 hashes of code and secret are
stored. A signed-in native session (`inspect`, `approve`, `deny`; no Origin or
Sec-Fetch-Site) claims the request for itself, sees the browser's claimed
browser/OS, creation time and whether both came from the same IP (compared as
hashes), and decides. Login-token and QR browser sessions cannot approve.

The browser polls with its secret. Approval is picked up once: a delegated
HttpOnly, Secure, SameSite=Strict session cookie (no bearer in JavaScript) and,
if the phone shared the key, the sealed key (deleted from the database on
pickup). Purpose `key` lets an already signed-in browser receive the key
without a new session; only the same account's phone can approve it.

Limits: 3 minutes before opening, 5 minutes after, 10 minutes to deposit a key,
30 new requests per IP and 60 inspections per account per 15 minutes, 5,000
stored requests, one owner, one decision and one pickup per request.

Tests: `tests/flow.test.ts` (sign-in, decline, ownership, expiry, limits) and
`tests/key.test.ts` (real NaCl sealing, deposit, removal, configuration).
