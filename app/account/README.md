# Account page

`AccountView.tsx` is the browser passkey entry point. It uses the worker account
API and creates no local pairing credential. The page deliberately says that
passkey sign-in alone cannot restore a computer connection. It remains out of
the sitemap and is not linked from the public product navigation while Mac
binding and device recovery are unfinished.

The browser receives an HttpOnly session cookie; the account API omits bearer
tokens from browser responses. Native clients will use a bearer token stored
in their platform Keychain once the native flow is implemented.
