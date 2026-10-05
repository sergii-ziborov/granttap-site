# Account page

`AccountView.tsx` is the browser passkey entry point. It uses the account API
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

The `/connect` MCP authorization page uses a fresh passkey assertion from this
account service to approve a coding app on Mac. That approval issues a local
MCP OAuth token and does not create a computer pairing or restore a phone.
