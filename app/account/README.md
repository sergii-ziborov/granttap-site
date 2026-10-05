# Account page

`AccountView.tsx` is the browser passkey entry point. It uses the account API
served by Hetzner in production and creates no local pairing credential. The
iPhone app pairs computers by QR and can then register them with this account
for recovery from its shared connection screen. The browser lists and revokes
account links; encrypted recovery offers go directly to the requesting phone.
This page remains outside the public product-navigation sitemap.

The browser receives an HttpOnly session cookie; the account API omits bearer
tokens from browser responses. Native clients store their bearer token in the
platform Keychain.

The `/connect` MCP authorization page uses a fresh passkey assertion from this
account service to approve a coding app on Mac. That approval issues a local
MCP OAuth token and does not create a computer pairing or restore a phone.
