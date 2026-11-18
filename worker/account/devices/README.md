# Account devices

Public entry: `routeDevices` in `index.ts`: `GET devices`, `DELETE
devices/sessions/:id`, `DELETE devices/computers/:id`, `POST devices/prune`,
`PATCH devices/current` (native only) and `GET summary`.

Every session created after this change records a random ID, kind, name,
sign-in method and whether it is delegated (`client.ts` derives a coarse
browser/OS label from the User-Agent; native clients start as "GrantTap app"
and name themselves). Last use is written at most every five minutes, only when
the session's own token makes a request. Computers come from account machine
links; their last seen time includes route publication, and
`encryptionKeyId` is the SHA-256 of their published relay key.

A session from before that is listed with `older: true`. It gets an ID on first
use or listing; `createdAt` is its expiry minus the fixed 30-day session life;
`signIn` is `token` only when a sign-in token link proves it, otherwise `null`.
Its kind stays `unknown` until it is used, and then comes from how the request
carried it (`describeTransport`): a native bearer is "GrantTap app", a browser
cookie is that browser. `POST devices/prune {"older": true}` signs out every
older session except the asking one.

`PATCH devices/current` may carry the app's random `installationId` (a UUID kept
in that device's Keychain; no hardware identifier). The service stores only
SHA-256 of account ID and installation ID (`account_session_installations`,
migration 0016) and keeps the newest session of that installation on the
account: signing in again from the same app replaces what an earlier sign-in
left, even when the earlier sign-out never reached the service. Another
installation or a browser never removes anything. The answer says how many
sessions were `replaced`.

Signing a session out (`DELETE devices/sessions/:id`, or `POST logout` with the
session's own token) deletes it. Removing a computer revokes its link like the
existing machine API. Pruning removes sessions and computers quiet for 7–365
days, never the asking session. Browser mutations must be same-origin.

Tests: `tests/devices.test.ts`, `tests/sessions.test.ts` (sign-out, one session per
installation, older sign-ins), `tests/client.test.ts`.
