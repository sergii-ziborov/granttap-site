# Account control admission

Public entries are `authorizeAccountControl` and `routeControlAccess` in `index.ts`.
The account session is verified independently of client-selected account IDs,
plans, browser storage or TestFlight flags. Apple purchases are reconciled before
issuing a five-minute access view. A sandbox subscription counts like a production
one; an operator's grant or the App Review account is the only access without one.

This response is an authenticated view of access, not a bearer credential for
the relay. Control transports must call the same authority before admitting
operations and renew it during long-lived connections. Revocation, expired
grants and failed verification never grant control.

Behavior tests live in `tests/coverage/control-access.test.ts`.
