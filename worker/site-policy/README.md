# Public site HTTP policy

This module owns canonical-host/HTTPS redirects and the existing public-site
security headers. Both the local Workers entry and the Hetzner Node server use
these rules. The Node adapter runs before page, static-file and download
handlers. Forwarded protocol is supplied by the trusted local reverse proxy.
Account and relay services remain independently deployed.

Behavior tests live here; production HTTP and isolated runtime tests verify the
Node adapter through the actual serving pipeline, including redirects and CSP.
