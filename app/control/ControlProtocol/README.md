# Browser wire contracts

This entry imports only the public, platform-neutral wire schema from pinned
GrantTap MCP 0.8.75. The browser bundle contains Zod validators and data contracts;
it does not import a machine runtime, CLI, filesystem access or provider adapter.
Tests compare encryption against the published native protocol. The pinned
Apache-2.0 protocol retains its original license and notices independently of
newer commercial MCP releases.
