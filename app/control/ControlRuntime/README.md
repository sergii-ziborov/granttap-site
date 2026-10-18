# Browser control runtime

`ControlRuntime` owns browser connections, Task projections and encrypted cache
writes. It imports public protocol and browser modules only. Confirmations and
messages use relay-durable identifiers. `stored` is relay acceptance; only a
native receipt or resolution becomes `accepted`. Failures remain visible.
Immutable outgoing commands are committed through `ControlOutbox` before transmission.
A reload restores relay storage status and retries only commands without a
computer rejection or relay confirmation. Computer receipts must match the
command's authenticated machine. Retrying transport preserves the original
operation, timestamp and payload. Account removal forgets the outbox too.
Approval delivery identifiers include computer and Task identity, so equal
provider request IDs on different computers remain independent. An authenticated
computer receipt takes precedence over a late transport failure; losing a
relay acknowledgement cannot turn an accepted message back into a failed draft.
Incoming cache writes coalesce; cryptographic grants are durable before ACK.
Closing or forgetting the account closes every connection.
