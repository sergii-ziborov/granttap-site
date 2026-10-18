# Engine artifact delivery

`index.mjs` serves the exact versioned Engine binaries, manifest and license
files copied into the production image after the website build. The framework's
compiled asset inventory does not discover those files by itself.

Paths, methods, file types and sizes are bounded. Symlinks, directory listings
and traversal paths are rejected. Other requests retain the site's original
handler. Tests exercise actual HTTP responses and file bytes.

License: see the repository-root `LICENSE`.
