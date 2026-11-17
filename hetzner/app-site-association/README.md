# Apple app-site association

`index.mjs` answers `GET /.well-known/apple-app-site-association` in the
production website process (`.runtime/site-start.mjs`, port 3211) before the
page router, so the Next/Vinext HTML 404 can never claim the path. It returns
status 200, `content-type: application/json`, no redirect and a one-hour public
cache. Other methods get 405; every other path keeps the site's handler.

The JSON lives once in `worker/site-policy/apple-app-site-association.json` and
is shared with the optional Cloudflare Worker entry. `webcredentials.apps` lists
every app ID that carries `webcredentials:granttap.com`: the iPhone, iPad and
Mac app all sign as `XMS5ZC28UJ.com.ziborov.granttap`.

Host nginx (`hetzner/nginx.conf`, host configuration, not part of the site
payload) forwards `/.well-known/*` except `acme-challenge` to this process.
Apple's CDN caches the file; after a deploy, check both:

```bash
curl -si https://granttap.com/.well-known/apple-app-site-association
curl -s https://app-site-association.cdn-apple.com/a/v1/granttap.com
```

Tests: `tests/association.test.mjs` and the isolated production runtime test in
`tests/hetzner-runtime.test.mjs`.

License: see the repository-root `LICENSE`.
