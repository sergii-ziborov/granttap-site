# Account sign-in handoff

The `/sign-in` page opens a previously generated account token in the native
GrantTap app. Its secret lives in the URL fragment, never in a query or request.
The page removes the fragment from its history entry after capture, does not
redeem it, and keeps it only in component memory. An explicit user click opens
the fixed `granttap://sign-in` destination. Link previews cannot consume a use.

Generation, expiry, use limits, revocation and durable sessions belong to
`worker/account/login-tokens`. Tests live in `tests/` beside this module.
