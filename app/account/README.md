# Account page

`AccountView.tsx` is the browser password, passkey and temporary-key entry point. It uses the account API
served by Hetzner in production and creates no local pairing credential. The
iPhone, iPad, and Mac apps can create or join an Account Mesh without any
computer. Their Devices screens show its linked computers. A local MCP can use
the same passkey to attach an existing computer; the machine token can update
its own display name without creating another account entry. The browser lists
and revokes account links; encrypted recovery offers go directly to the
requesting phone. QR pairing remains a separate direct-device path.
This page remains outside the public product-navigation sitemap.

The browser receives an HttpOnly session cookie; the account API omits bearer
tokens from browser responses. Native clients store their bearer token in the
platform Keychain.

`SignInMethods` offers one explicit choice between the three sign-in methods,
in the same order and wording as the native app: Passkey (recommended, the
default), QR code and Password. The QR method asks the browser for a phone
passkey (`hints: ["hybrid"]`, so a QR appears for the iPhone camera) and also
holds the sign-in token form. `AccountPassword` keeps its Sign in / Create
account choice, explains invalid input beside the affected field, attaches an
unavailable login to the login field, and shows progress inside the submit
button without moving the layout. Passkey failures appear beside the passkey
buttons. Field borders and error text keep at least 3:1 and 4.5:1 contrast in
both themes, and text sizes follow the browser's font-size setting.

`AccountTokenAccess` accepts a temporary token or a trusted QR sign-in link only
after explicit submission and acknowledgement of browser-code access to decrypted
messages and input. Redemption preserves grant expiry, usage limits and revocation.
Cross-device passkey QR remains a system-authenticator option when available.

The browser page links to GrantTap Web and explains browser key storage and its
weaker isolation. A successful account sign-in returns to `/control` only for the
single literal `returnTo=control`; arbitrary and duplicate destinations are
rejected. It never accepts an external return URL.

The `/connect` MCP authorization page uses a fresh passkey assertion from this
account service to approve a coding app on Mac. That approval issues a local
MCP OAuth token and does not create a computer pairing or restore a phone.

## Subscription support

[SubscriptionSupport](SubscriptionSupport.tsx) preserves a direct link to Apple
subscription settings and offers optional feedback to signed-in accounts. It
does not cancel a subscription or run a web checkout. Eligible Apple promotional
offers are confirmed in the native app through StoreKit. Feedback tests live in
[tests/subscription-support.test.tsx](tests/subscription-support.test.tsx); the
HTTP, receipt-history and durable-state contract belongs to
[SubscriptionRetention](../../worker/account/subscription-retention/README.md).
