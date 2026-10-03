# Account passkeys

`api.ts` is the public HTTP entry point for passkey account registration, sign-in,
session lookup, sign-out, account deletion, and linked computer management. `auth.ts` verifies WebAuthn
ceremonies for `granttap.com`; `d1-store.ts` persists public credential data,
single-use challenges, and hashes of session tokens through a prepared SQLite
interface. The live Hetzner connect service uses `sqlite.ts` with a durable
database volume; the optional Cloudflare Worker uses D1.

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
offer producer, and iPhone recovery UI are now present in the companion MCP and
Apple app. Native passkey and encrypted offer delivery still require a live Mac
service and a signed app with the `webcredentials:granttap.com` entitlement.

The Worker serves Apple's `webcredentials` association file at
`/.well-known/apple-app-site-association`. The corresponding native app needs
the `webcredentials:granttap.com` entitlement and a matching provisioning
profile before it can use this relying party.

The Hetzner server exposes `/api/account/` and accepts a fresh account passkey
assertion at `/api/connect/requests/:id/passkey`. The normal QR path stays
independent. `hetzner/nginx.conf` routes account APIs to port 3210; the
`account_data` compose volume holds credential records across deploys. The
MCP OAuth token remains local to the computer and is not a machine recovery
grant.

Run `npm run test:coverage`, `npm run typecheck`, `npm run lint`, and `npm test`
before changing the account boundary. The test suite includes real P-256
registration and assertion signatures, origin and user-verification rejection,
one-use challenges, and counter replay.
