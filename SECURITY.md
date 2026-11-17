# Security policy

## Reporting a vulnerability

For a vulnerability in the website, use GitHub's private
[security advisory form](https://github.com/sergii-ziborov/granttap-site/security/advisories/new).
For an urgent coordination issue, contact `sergii.ziborov@gmail.com`.

Do not open a public issue containing credentials, pairing tokens, room
identifiers, private payloads, or an exploit against the production site.
Include the affected URL or commit, impact, browser/runtime, and a minimal
reproduction using synthetic data.

## Scope

The website contains no GrantTap device keys and should never receive pairing
secrets, with one opt-in exception: if the owner ticks "Give my GrantTap account
the key to read my chats" on the iPhone, the account service stores controller
identities minted by the owner's computers so the owner's browsers can decrypt
chats in the page. They are encrypted at rest, never used by the server to
decrypt anything, refused for relay admission once removed, and the phone warns
before they are shared. A compromise of granttap.com exposes chats of accounts
that opted in; treat any route that returns or stores that key
(`/api/account/web-key`, `/api/account/qr-sign-in/`) as in scope.

Browser sign-in by phone QR is in scope too: report a way to approve, redeem
or replay a request without the phone owner's explicit approval, or to read
the sealed key without the browser's ephemeral key.

Product vulnerabilities in the MCP bridge or relay should be reported
to the matching repository's private advisory form.
