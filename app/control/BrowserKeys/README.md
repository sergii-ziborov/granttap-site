# Remembered browser keys

Public entry: `BrowserKeyVault` in `index.ts`. The browser stores pairing and
session keys as an AES-GCM encrypted IndexedDB record with a non-extractable
wrapping CryptoKey. Account-bound additional data prevents opening a copied
record under a different account. Atomic revision checks retry concurrent tab
updates against the latest state instead of dropping another computer's keys.
Writes and explicit forgetting are ordered; storage errors never fall back to
plaintext localStorage. Chat history is not rewritten into this key vault.

The wrapping key remains usable by same-origin JavaScript. This is not a
hardware-backed or passkey-wrapped vault and does not protect against XSS,
compromised website code or privileged browser extensions. The UI must describe
where keys live and offer explicit forgetting. Native app key storage provides
a different operating-system isolation boundary.

Tests in `tests/` use IndexedDB transactions and Web Crypto to verify reopening,
non-extractability, account separation and concurrent updates.
