# Browser control center

`index.tsx` mounts the account gate and the existing Now, Tasks, Mesh, Usage and
Computers journeys. Browser encryption storage requires informed consent.
The selected computer must have an authorized browser connection; account order
alone never selects an unpaired route. Navigation does not await a machine scan.

`panels.tsx` presents computer connection state, storage risks and reported usage.
Usage windows are deduplicated by provider and limit identity; the latest
observation wins. Missing provider limits remain unknown.

Public entry: `index.tsx`. Local tests exercise account gates, navigation,
four-provider approvals, bounded conversations, connection consent and routing.
