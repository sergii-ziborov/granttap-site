# Sign-in key form

`AccountTokenAccess` accepts a temporary key or a native QR link after explicit
browser-risk consent. `parseSignInKey` permits only the existing GrantTap token
and fragment-link formats. Links are parsed locally and never navigated to.
The secret travels in a same-origin POST body and is cleared on every outcome.
No key is persisted or redeemed automatically from page URLs. The server returns
only account identity and a scoped HttpOnly cookie.
