# Account passkeys

`api.ts` is the public HTTP entry point for passkey account registration, sign-in,
session lookup, sign-out, account deletion, and linked computer management. `auth.ts` verifies WebAuthn
ceremonies for `granttap.com`; `d1-store.ts` persists public credential data,
single-use challenges, and hashes of session tokens in Cloudflare D1.

`machines.ts` stores opt-in computer links with hashed machine bearer tokens.
`machine-api.ts` lets the account list or revoke those links, opens a five-minute
recovery request bound to one computer and an ephemeral phone public key, and
delivers one opaque sealed offer from that computer. Claims consume offers
atomically. Revocation and account deletion invalidate pending requests.
Registration returns the machine bearer once to a native client; it is never
returned by the browser list. A maximum of 16 active computers and three
pending requests per computer applies.

The account database contains no plaintext pairing key, Mesh key, prompt,
command, transcript, or provider credential. It temporarily stores an opaque
encrypted pairing offer. Account authentication authorizes a recovery request,
so the service is part of the recovery trust boundary. The standard QR pairing
path remains independent of the account service. The computer poller, encrypted
offer producer, and iPhone recovery UI are not shipped yet. Until they are,
the account page must not claim that signing in restores a connection.

The worker serves Apple's `webcredentials` association file at
`/.well-known/apple-app-site-association`. The corresponding native app needs
the `webcredentials:granttap.com` entitlement and a matching provisioning
profile before it can use this relying party.

Run `npm run test:coverage`, `npm run typecheck`, `npm run lint`, and `npm test`
before changing the account boundary. The test suite includes real P-256
registration and assertion signatures, origin and user-verification rejection,
one-use challenges, and counter replay.
