# Browser Task conversation

`index.tsx` presents one authenticated computer's Task and its bounded history.
It subscribes while the Task is open and releases that subscription on exit.
`Composer.tsx` retains text and attachments until relay confirms storage.
An edited failed draft starts a new immutable intent; transport retry retains
the original identifier. `OutgoingMessages.tsx` restores pending content from
the encrypted runtime outbox and exposes explicit retry after rejection.

Pause/resume and history subscriptions are live commands. They require an
active relay connection and an existing Task encryption grant; a send is not
displayed as a confirmed computer action. Messages and approval decisions use
the durable outbox independently of the computer's availability.

Public entry: `index.tsx`. Local behavior tests cover composition, attachment
retention, control failure, subscription lifetime and queued message recovery.
