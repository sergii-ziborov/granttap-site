# Browser Mesh inspection

`index.tsx` presents received architecture evidence and existing Tasks for one
selected, authorized computer. It bounds the graph drawing to 48 components,
searches full component labels and shows unavailable analysis as unavailable.
A refresh keeps the latest observation visible until another snapshot arrives.

New Task creation belongs inside the selected Mesh. Available workspace choices
must belong to the snapshot publisher. Submission uses an immutable operation
identifier and the shared encrypted outbox; an edited failed draft starts a new
operation. Relay storage does not imply the provider has started the Task.

Public entry: `index.tsx`. Local tests cover graph limits, refresh errors,
workspace ownership and retry identity.
