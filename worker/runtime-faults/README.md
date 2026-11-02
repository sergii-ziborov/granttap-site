# Runtime fault reports

[Accounts](../account/README.md)

`POST /api/runtime-faults` receives what the MCP runtime watchdog sends when its
monitor hangs: fault kind, duration, action taken, restart count, GrantTap and Node
versions, platform and architecture. A report with any other field is refused, so
nothing can start carrying a prompt, path, room, key or computer name.

The endpoint is anonymous: no account, address or computer identifier is stored. The
site keeps a report for 90 days and at most 10,000 of them; nginx limits the rate per
address. Public entry: `handleRuntimeFaultsApi`. There is no reading API. To look at
the reports, query `runtime_faults` in the account database on the server.

License: this module is distributed under the GrantTap Commercial Source License in
the repository-root `LICENSE` file.
