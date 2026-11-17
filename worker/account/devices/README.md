# Account devices

Public entry: `routeDevices` in `index.ts`: `GET devices`, `DELETE
devices/sessions/:id`, `DELETE devices/computers/:id`, `POST devices/prune`,
`PATCH devices/current` (native only) and `GET summary`.

Every session created after this change records a random ID, kind, name,
sign-in method and whether it is delegated (`client.ts` derives a coarse
browser/OS label from the User-Agent; native clients start as "GrantTap app"
and name themselves). Older sessions get an ID on first use or listing. Last use
is written at most every five minutes. Computers come from account machine
links; their last seen time includes route publication, and
`encryptionKeyId` is the SHA-256 of their published relay key.

Signing a session out deletes it. Removing a computer revokes its link like the
existing machine API. Pruning removes sessions and computers quiet for 7–365
days, never the asking session. Browser mutations must be same-origin.

Tests: `tests/devices.test.ts`, `tests/client.test.ts`.
