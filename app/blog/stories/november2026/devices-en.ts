export const body = String.raw`
A computer can appear online while its coding agent cannot accept a request. The bridge may be connected, the provider may have signed out, and an older process may still be running a previous runtime version. From a phone, those conditions can look like the same symptom: a message waits and nothing useful happens. Repair starts with separating the components rather than treating the whole computer as a single green light.

GrantTap's Devices area is the natural place to inspect that separation. The computer owns its local tools, credentials, processes, and caches; the phone provides a control surface for supported management operations. This article offers a practical maintenance method for that arrangement. Exact controls depend on the installed runtime, operating system, and provider. A healthy device view should make unsupported or unknown capabilities visible instead of presenting every tool as equally manageable.

## Identify the computer before changing it

Device names are convenient but are not identities. A laptop renamed last week can retain its trusted connection, while two computers can share a similar display name. Before updating a tool or restarting a runtime, confirm which machine owns the Task you are investigating. Look at its route and recent observations. A maintenance action on another online computer can succeed perfectly while leaving the original delivery problem untouched.

The same distinction applies inside a Project Mesh. A Project can relate several computers and repositories without making every computer suitable for every task. A checkout may exist only on one host. A signing credential may belong to another. A task's selected destination remains meaningful even when several devices are available. Device maintenance should preserve that route until the user deliberately chooses a transfer with the relevant source and destination checks.

For a simple inventory, write down the computer identity, the Task identity, the provider, and the last observed activity. Keep private identifiers in a private diagnostic record. There is usually no need to publish account details or full filesystem paths. This small inventory prevents an expensive class of repair mistakes: changing the right kind of setting on the wrong machine, then interpreting the unchanged symptom as evidence that the repair itself failed.

## Read readiness as several independent observations

There are at least four useful questions. Is the computer reachable? Is the GrantTap runtime connected? Is the selected provider installed and authenticated? Is that provider ready to accept the requested operation for this Task? A yes at one level does not answer the next. For example, a connected bridge may correctly report that its provider is absent, or that a login process is waiting for the account owner.

Freshness belongs beside these observations. A status checked before the computer slept is not a current connectivity test. A provider version found on disk may not identify an already running process. A login result can become stale after the provider revokes a session. When a fact has not been rechecked, the interface should retain that uncertainty. Replacing an unknown value with a reassuring default makes troubleshooting harder because it removes the boundary where evidence stopped.

Use a small readiness check before a large maintenance action. Confirm that the intended runtime can report its state, then check the provider separately. If the provider cannot authenticate, solve that specific condition. If the runtime cannot communicate, do not blame the provider yet. This order gives every action a reason and a way to verify success, rather than relying on a chain of restarts that happens to end with a green badge.

## Installed, selected, and running versions differ

Updating software often has three stages. A new package is downloaded and verified. A launcher selects it for a future process. A process actually starts from that package. All three can happen successfully at different times. During the gap, the disk contains a newer version while a long-lived service still runs the previous one. A device screen that reports only the installed package can therefore overstate what behavior is currently active.

For MCP integrations, there may also be several legitimate launch contexts. A managed background monitor and an HTTP service can update independently from a stdio integration loaded inside a coding application. That application may need a normal restart to load its new integration. The existence of several processes is not, by itself, proof of a leak. The relevant facts are their roles, parent processes, active work, and the package paths they actually loaded.

When verifying an update, look for the running version and a successful reconnection from that process. Also confirm the selected version, so the next launch will not unexpectedly return to an older package. If an integration intentionally keeps the old process alive until work finishes, the interface should explain the pending activation. Waiting safely for that boundary is different from an update failing to download or an installer silently abandoning its work.

## Provider login belongs to the provider

A GrantTap connection and a provider account are separate relationships. Pairing a phone to a computer does not sign Claude Code, Codex, Cursor, or another tool into its own service. Each provider controls its authentication mechanism and account permissions. The device controller can coordinate supported sign-in flows, but it should not blur who receives the credential or imply that the GrantTap account automatically supplies a provider subscription.

If a provider has signed out, begin the supported login flow for that provider on the intended host. Depending on the tool, this can involve a browser authorization step, a device code, or a local interactive process. The useful result is an observed authenticated state followed by a harmless provider operation. A login window appearing is only an intermediate step. It does not establish that the callback completed or that the CLI can use the new session.

Avoid troubleshooting by copying raw tokens into conversation history. A remote support message is a poor credential store and may synchronize to more places than expected. The [MCP security guidance](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices) discusses scoped authorization and the problems caused by passing tokens through unrelated boundaries. For everyday maintenance, the practical lesson is to keep credentials in the provider's intended flow and verify the resulting access separately from bridge connectivity.

## Updates need a reason and a verification step

There are good reasons to update: a relevant bug fix, an incompatible protocol, a provider change, or a security correction. Updating everything at once is less informative because it changes several variables before you know which one caused the failure. Start with the component whose observed boundary is broken. Read the release information, preserve any active work, apply the supported update, and check the same operation afterward.

Package verification and successful execution are different checks. An installer should obtain the intended package through a trusted source and validate the expected artifact. After activation, the runtime still needs to connect and perform its role. The provider may also require a newer local environment or a renewed login. A completed download therefore belongs in a maintenance history, but it should not be presented as proof that every task can now run.

Keep the recovery path understandable. A managed updater can retain a previous verified runtime for rollback, while a provider may use its own installation method. The controller should identify which component it is changing and what remains pending. Afterward, record the observed running version and whether the original symptom changed. That evidence makes the next support interaction shorter and prevents the same update from being requested repeatedly because its activation was never checked.

## Restart the component that owns the problem

Restarting a bridge can restore a broken connection, but it can also interrupt observation of active work. Restarting a provider is a stronger operation because that process may own commands and file changes. Restarting the entire computer affects every project. These actions should be distinguishable in the interface. A single generic Restart control leaves too much room for an innocent connectivity repair to become an interruption of useful execution.

Before restarting, inspect current requests, pending decisions, and login activity. A provider may be waiting for permission rather than hung. A build may be consuming CPU productively. A login callback may still be in progress. If interruption is necessary, understand what state is durable and what work might need to be resumed. A maintenance action is easier to trust when its scope is explicit and its completion produces a fresh observation.

After a restart, test the same route with the same task context. Confirm that the runtime reconnected, that the provider is still authenticated, and that an observation returns to the phone. Do not resend a potentially completed side-effecting instruction merely to test connectivity. If the original message has already reached the native conversation, inspect its result or request status instead. The purpose of restarting is to repair a component, not to multiply the task's commands.

## Treat cache as a category, not a synonym for data

The word cache hides important differences. A downloaded package can often be fetched again. A derived index can often be rebuilt from its source. A retained transcript may be the only accessible record of an old decision. Pairing keys are credentials, not disposable performance data. Before clearing anything, identify its category, its size, whether it is in use, and the source from which it can be reconstructed.

A useful device screen reports bounded categories rather than offering an unexplained Delete everything button. For each clearable category, it should explain the practical effect: storage reclaimed, later download required, or index rebuilt on demand. The estimate should not include unrelated project folders merely because their names resemble build output. The owner of a coding workstation may have many active repositories, and a cache operation should not silently become cross-project cleanup.

Expect a trade-off after clearing derived data. The next request may take longer while the system rebuilds or downloads what it previously reused. That does not necessarily mean the cleanup failed. Measure whether storage was reclaimed and whether normal operation recovers after regeneration. If the same category immediately grows without bound, investigate its retention policy or invalidation logic. Repeated manual deletion can hide the underlying bug while consuming more network and CPU each time.

## Several processes can be legitimate

A process list is a snapshot of implementation, not a list of redundant applications. One coding app can launch a stdio bridge; a managed service can maintain background synchronization; a provider can run a CLI with child commands. Some helpers consume little CPU while waiting. Others are transient build tools. Counting rows without their parent relationships can make a healthy system look alarming and a single orphaned worker look harmless.

Investigate ownership and load over an interval. Which launcher created the process? Which task does it serve? Does it have a live connection or active child? Is its CPU use sustained while there is no work? Are two monitors both acting as the same leader? Those questions distinguish legitimate parallel roles from duplicate polling or abandoned processes. Memory also needs context: resident memory and shared mappings are not always additive in the way a simple table suggests.

Close only processes you can identify as safe to stop. Broad commands matching a provider name can terminate unrelated work launched directly by the user. Prefer management operations that know which processes they own and can respect active requests. If an orphan is suspected, retain enough identity information to avoid signalling a reused process ID. After cleanup, observe the system again; an immediately reappearing process may be correctly supervised by its launcher rather than refusing to stop.

## Build a maintenance record that answers the next question

A compact record is more useful than a large screenshot collection. Include the symptom, affected Task and computer, observation time, running runtime version, provider readiness, action taken, and result. Separate measured facts from guesses. If a cache size was unavailable, write unknown. If a provider login opened but never completed, write that. This allows another person to continue the investigation without reconstructing every action from memory.

For a routine health check, choose a moment when no important provider work is active. Inspect the computer route, confirm version and authentication, review clearable cache categories, and run a harmless observation through the same connection. Verify that its result returns to the correct Task. A successful health check does not certify every project, tool, or permission, but it provides a current baseline against which a later failure can be compared.

The larger goal is a device controller that helps you make one informed repair at a time. You can tell which computer is involved, which process is running, which provider needs attention, and which storage is safe to regenerate. That reduces unnecessary restarts and repeated sends. It also makes remote coding practical: the phone carries a clear view of local readiness while the computer keeps ownership of the tools and work it actually executes.
`;
