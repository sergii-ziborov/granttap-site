# Web account access

`useControlAccount` verifies the account's server-confirmed entitlement, loads
computers and restores browser identities. It checks access throughout an open
session. Connection recovery is explicit and abortable. Forgetting browser keys
closes all connections and notifies other tabs. Access is the server's verified
subscription (production or sandbox) or its own grant, never a browser flag.

If the owner gave the account the chat key from the iPhone, `account-key.ts`
loads those controller identities (`POST /api/account/web-key/material`) for
computers this browser has not connected itself. They are validated like a
computer offer, kept in memory for the page only and never written to the
browser key vault, so removing the key from the account stops new pages.
