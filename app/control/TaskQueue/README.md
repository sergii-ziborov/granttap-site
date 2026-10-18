# New Task queue projection

`QueuedTaskCards` keeps relay-saved Task creation visible in the existing Now and
Tasks lists while the computer is offline and before a provider session exists.
The encrypted outbox owns its payload, stable operation ID and delivery status.
The card never claims a native Task has started. An authenticated computer receipt
retires the queued card; native sessions are subsequently supplied by the computer
catalog. Failed creation remains visible. Search matches the request and provider.
