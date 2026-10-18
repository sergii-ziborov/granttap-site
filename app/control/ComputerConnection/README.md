# Browser computer connection

`connectAccountComputer` uses the signed-in account recovery flow. A computer
must be online once to authorize this browser. The browser generates an ephemeral
NaCl key; the account service stores only its public half and the sealed offer.
`openComputerOffer` verifies request and computer scope, key-pair consistency,
and the fixed managed relay before persisting a new controller identity.
Existing authorized browsers can submit ciphertext to relay with the computer
offline. Cancelling recovery does not delete existing controllers or pairings.

Tests: `tests/recovery.test.ts`.
