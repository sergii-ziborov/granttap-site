# Account page

`AccountView.tsx` is the browser passkey entry point. It uses the account API
served by Hetzner in production and creates no local pairing credential. The page deliberately says that
passkey sign-in alone cannot restore a computer connection. It remains out of
the sitemap and is not linked from the public product navigation while Mac
binding and device recovery are unfinished.

The browser receives an HttpOnly session cookie; the account API omits bearer
tokens from browser responses. Native clients will use a bearer token stored
in their platform Keychain once the native flow is implemented.

The `/connect` MCP authorization page uses a fresh passkey assertion from this
account service to approve a coding app on Mac. That approval issues a local
MCP OAuth token and does not create a computer pairing or restore a phone.
