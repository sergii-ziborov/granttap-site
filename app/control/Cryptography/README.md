# Browser encryption

Public entry: `index.ts`. This browser client consumes the existing GrantTap wire
contract without importing machine-runtime internals. NaCl boxes use the same
Curve25519/XSalsa20/Poly1305 primitives and base64 framing as native clients.
Transferred session keys use NaCl secretbox and must retain their exact session
scope. Authentication, recipient, room, role and expiration are checked before
delivery to the client state layer.

Private pairing/session keys remain in the browser. Browser code downloaded from
the website can use them; encryption does not protect against malicious code
running with this origin's privileges. Native installed apps provide a different
code-signing and operating-system key-storage boundary. The UI must disclose
this difference before remembering a browser connection.

Tests in `tests/` exercise authenticated native-compatible boxes and rejection of
altered, expired, foreign-room, recipient-mismatched and cross-session payloads.
