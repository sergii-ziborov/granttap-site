# Browser relay connection

`BrowserRelayConnection` connects to the fixed account transport on this origin.
All agent payloads use authenticated native-compatible device encryption; scoped
controls can additionally use exact session keys. Incoming payloads pass the
public protocol validator before reaching state. Key grants persist before ACK.

`submit` completes only on `relay.stored`, without an MCP response. It retains
stable ciphertext while reconnecting and explicitly fails if storage is not
confirmed. `send` is for transient reads and controls, not a storage guarantee.
Tests: `tests/relay.test.ts`.
