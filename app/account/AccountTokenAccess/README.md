# Sign-in token form

`AccountTokenAccess` accepts a temporary sign-in token or a native QR link after explicit
browser-risk consent. `parseSignInKey` permits only the existing GrantTap token
and fragment-link formats. Links are parsed locally and never navigated to.
The secret travels in a same-origin POST body and is cleared on every outcome.
Pasted text that is not a token or trusted link is explained beside the field.
The wording matches the app's Devices → Account → Sign-in tokens screen. No token is persisted or redeemed automatically from page URLs. The server returns
only account identity and a scoped HttpOnly cookie.
