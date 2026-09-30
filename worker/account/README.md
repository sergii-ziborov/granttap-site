# Account passkeys

`api.ts` is the public HTTP entry point for passkey account registration, sign-in,
session lookup, sign-out, and account deletion. `auth.ts` verifies WebAuthn
ceremonies for `granttap.com`; `d1-store.ts` persists public credential data,
single-use challenges, and hashes of session tokens in Cloudflare D1.

The account database contains no pairing key, Mesh key, prompt, command,
transcript, or provider credential. Authentication alone does not grant access
to a computer. A separate, computer-approved device recovery protocol is
required before the iPhone app can restore an existing connection. Until that
protocol and its native UI ship, the account API must not be presented as a
working connection recovery path.

The worker serves Apple's `webcredentials` association file at
`/.well-known/apple-app-site-association`. The corresponding native app needs
the `webcredentials:granttap.com` entitlement and a matching provisioning
profile before it can use this relying party.

Run `npm run test:coverage`, `npm run typecheck`, `npm run lint`, and `npm test`
before changing the account boundary. The test suite includes real P-256
registration and assertion signatures, origin and user-verification rejection,
one-use challenges, and counter replay.
