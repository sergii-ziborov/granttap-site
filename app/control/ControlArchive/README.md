# Encrypted control archive

`BrowserControlArchive` stores a bounded last-known Task, approval and Mesh view
for computers that are currently offline. AES-GCM with a non-extractable browser
key binds ciphertext to its account. This has the browser threat model described
in BrowserKeys, not hardware-backed native storage. Separate database records
keep cached views independent of connection keys. Concurrent tab writes merge
by revision. Cached views never imply that a computer is live or an action applied.
History is deliberately bounded; opening an online Task requests native history.

Tests: `tests/archive.test.ts`.
