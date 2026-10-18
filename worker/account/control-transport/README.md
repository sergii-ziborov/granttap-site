# Account browser relay transport

`attachControlTransport` attaches the browser WebSocket to the existing account
HTTP service. A same-origin HttpOnly account session and current subscription or
verified beta grant are required before upgrade. Each connection is limited to
one account-owned computer and room. The relay address is fixed by deployment,
never supplied by the browser. The connection frame accepts public routing
identity and a relay transport credential; encryption private keys are rejected.

Frames after connection contain ciphertext or delivery ACKs only. Relay stored
ACKs pass through immediately without waiting for a computer. Account admission
renews throughout the connection, including revocation and expiry checks. Bounds
cover connection count, handshake time, frame size and outgoing buffer size.
Existing native relay clients remain compatible during rollout.

Both directions retain text WebSocket framing. Node buffers are not forwarded
as binary: the relay deliberately ignores binary application frames.

Tests: `tests/coverage/control-transport.test.ts`.
