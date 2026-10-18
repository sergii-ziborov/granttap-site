# Browser command outbox

The public `BrowserControlOutbox` entry point commits immutable command intent
before a relay send. Records use account-scoped AES-GCM with a non-extractable
browser key and optimistic transactions shared across tabs. A delivery ID cannot
be changed to another machine, answer, message, model or attachment. Repeated
transport attempts keep the original payload and ID. Relay storage and computer
acceptance remain separate durable states. Pending commands are never evicted to
make space; only acknowledged commands can be pruned. Forgetting the browser also
removes its command outbox. These browser protections remain weaker than native
operating-system key storage against compromised website code or extensions.
