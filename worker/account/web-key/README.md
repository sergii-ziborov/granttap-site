# Account-held chat key

Public entries: `routeWebKey` (`/api/account/web-key`) and `AccountWebKeys`.
Opt-in from the phone's QR approval. The key is the narrowest material that
lets a browser read chats: one controller identity per account computer, minted
by that computer through the existing recovery offer (`bundle.ts` validates the
exact `granttap.account-web-key.v1` shape and key consistency). It is never the
phone's own pairing.

The approving browser opens the sealed bundle and deposits the plaintext once;
the digest must equal what the phone approved and every computer must belong
to the account. The server stores it AES-256-GCM encrypted with a key derived
from `GRANTTAP_ACCOUNT_STORAGE_KEY_PATH` or the managed admission key. It can
decrypt it and hands it to any same-origin browser session of the account
(`POST web-key/material`); that is the risk the phone warns about. The server
never receives chat ciphertext and never decrypts chats.

`GET` shows status and per-computer `recipientKeyId`; `DELETE` removes it from
phone or web. Removing or replacing a key records its controller public keys,
and control admission then refuses relay tickets for them.

Tests: `tests/bundle.test.ts` and `../qr-sign-in/tests/key.test.ts`.
