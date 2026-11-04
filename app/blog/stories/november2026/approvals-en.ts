export const body = String.raw`
An approval is useful only when it changes the right operation on the right computer. A phone can display a convincing permission sheet while the underlying request has expired, the provider has moved on, or the decision is still travelling. The human experience and the execution boundary must stay connected. Otherwise, a tap that looks decisive can leave the agent waiting or, more seriously, authorize something the person never intended to approve.

GrantTap's role in this workflow is to bring the relevant decision to the person and carry it back to a supported local integration. That involves a complete lifecycle: a request is created, described, delivered, answered, applied, and closed. This guide follows that lifecycle through a fictional command approval. It explains what evidence to expect and how to investigate a request that remains unresolved, without assuming that every provider or hook exposes identical enforcement capabilities.

## A request needs an operation and an identity

Suppose an agent wants to run a command that examines a project's database migration files. The approval should identify the intended operation and its context: the Task, computer, working directory, and relevant parameters. A short title helps the human orient, but it cannot replace those details. Two commands with similar names can have very different consequences, and the same command can behave differently in another directory or under a different account.

The request also needs a stable identity. That identity connects the sheet on the phone to the pending operation on the host. It should survive ordinary transport retries without becoming a new approval each time. A human-readable summary can be corrected or localized while the underlying identity remains the same. Conversely, a new operation should receive a new request even when its description happens to match the previous one word for word.

This distinction becomes important during rapid agent work. A provider can finish one command and ask about another before the phone has synchronized every event. If the interface selects a request merely because it is the newest item in a list, a delayed answer may land on the wrong operation. The safe question is whether the response refers to the exact pending request, with the expected lifecycle and execution context, at the moment the host applies it.

## Show enough information for a real decision

A useful approval description answers what will happen, where it will happen, and which authority is being requested. The relevant detail depends on the operation. For a command, parameters and working directory matter. For a file write, the target path and scope matter. For an external action, the destination and affected resource matter. The goal is to support an informed choice without making the person decipher a raw protocol packet on a small screen.

Avoid replacing the operation with the agent's reassuring explanation. “This is safe” is a conclusion, not a description of the command. A concise explanation can help, but the person still needs access to the concrete action. If details are truncated, the interface should make expansion practical. A visually tidy sheet that hides the argument which changes a read into a destructive write is a poor trade-off for remote control.

The request should also distinguish a one-time decision from a change to future policy. Approving the current operation does not inherently mean allowing all later commands in that Task. Enabling an automatic rule does not necessarily resolve the current waiting operation. If the product supports both, show their scopes and acknowledgments separately. This prevents a person from believing they answered a pending prompt when they only changed how a future prompt will be evaluated.

## Keep questions separate from permissions

An agent question asks for information or a preference. A permission request asks whether an operation may proceed. Their interfaces can look similar, but their meanings differ. Answering which design the user prefers should not grant filesystem access. Allowing a command should not invent an answer to a product question. The local integration must preserve that distinction when routing a response back to the provider.

This matters when a task is waiting on several conditions. An approval may have been applied while a separate question remains unanswered. The agent can therefore still be waiting without the approval path being broken. A task view should help identify the remaining dependency. A generic Waiting label is less useful than a record that names the particular pending decision or missing piece of information and shows when it was observed.

For the human, read the request's purpose before choosing an answer. If the operation is unclear, inspect its details rather than using a permission decision as a way to send a chat message. If the question needs an explanation, answer through the supported question or conversation path. Keeping these channels precise makes the result easier to verify and helps a later investigation avoid treating every unresolved sheet as the same kind of defect.

## Decision delivery is a separate stage

When you tap Allow, the phone records an intention and begins delivering it. That local action is meaningful, but it is not yet proof that the computer applied the decision. The transport may reconnect, the host may be asleep, or the original request may have become unavailable. An Applying state can honestly represent this interval if the interface explains which confirmation is still missing and provides a way to inspect the original request.

A relay acknowledgment establishes that the transport accepted the decision's envelope. A host acknowledgment establishes a later boundary. Application to the provider's pending operation is later still. These stages should remain distinguishable, just as they are for [ordinary message delivery](/blog/granttap-message-delivery-working-status). The person should not have to guess whether a long wait means a lost tap, a disconnected computer, or an agent that is already doing useful work.

Keep the decision associated with the original request during reconnects. Reopening a sheet should reconcile against fresh state instead of creating another operation. A refresh should ask about the existing decision. A retry should follow a documented, identity-preserving route. If the outcome is unknown, say so and inspect it. Repeatedly generating new approvals can make the interface appear active while reducing the ability to explain which decision actually reached the host.

## Apply the answer at the execution boundary

The critical check occurs where the operation would proceed. That boundary must verify that the request is still pending and that the answer belongs to it. A phone animation cannot perform that check on behalf of the host. An agent's promise to respect the decision is also weaker than an integration that blocks or allows the actual operation according to the supported enforcement path.

Coverage matters here. An integration may enforce a particular hook while observing other activity only after it happens. A local rule does not automatically govern a provider's unrelated cloud environment or a command launched outside the controlled path. GrantTap's governance material distinguishes supported enforcement from observation and uncertainty. An approval workflow should preserve that distinction rather than presenting a universal security guarantee based on the existence of a mobile decision sheet.

The result should identify what happened to this operation: permitted, denied, expired, cancelled, or otherwise unavailable according to the integration's real contract. Those outcomes have different meanings. A denied operation is a successful enforcement result, even though the requested command did not run. An expired request is not an implicit denial of a new request. A clear lifecycle allows the task to remain understandable without translating every non-execution outcome into a generic failure.

## Reject stale answers without losing the history

Suppose the provider abandons its original command and creates a new request. The phone still has an old notification. Opening it may show a cached description, but applying its answer to the new operation would be wrong. The old request should resolve against its own identity and current status. If it is no longer actionable, the interface should explain that state and let the user return to the current Task.

Preserving the historical record helps. The person can see what was requested and whether an answer was sent, even if the operation expired before application. That history is different from keeping an actionable button forever. A retained card should not silently restore an obsolete pending request after a refresh. Lifecycle closure is a fact that later history synchronization must respect, including when older packets arrive after newer observations.

Test the timing deliberately when investigating such a bug. Hold an old response, replace the pending request, and then release the response. The expected behavior is rejection or a terminal old-request result, with no effect on the new operation. This controlled order is more informative than tapping quickly and hoping a race occurs. It gives the implementation a concrete acceptance boundary and gives reviewers evidence that the original risk was exercised.

## A policy change has its own acknowledgment

Automatic permission settings can reduce interruption, but they alter future authority. Their scope should be understandable: this chat, this project, this computer, or another explicit boundary. A local visual toggle records the desired configuration. It does not prove the host has applied the effective rule. If policy must synchronize to the computer, that synchronization deserves its own acknowledgment and a visible pending state when it has not completed.

Do not infer that a policy update answered the current request unless the implementation explicitly supports that transition and confirms it. The user may need to decide the current operation separately. Likewise, revoking an automatic rule should be checked where later operations are evaluated. A stale cached policy view should not be treated as evidence that a new command will be blocked or allowed on the host.

For a practical review, compare desired policy, observed effective policy, and the outcome of a harmless permitted or denied operation within the supported boundary. These are related but independent pieces of evidence. A successful configuration write is useful, but it is not a substitute for checking enforcement. The test should also state its scope, so a result for one provider hook is not accidentally presented as coverage of every tool on the machine.

## Recover a sheet that remains Applying

Begin by identifying the original request and the Task's computer. Check the newest available request status before pressing more controls. If the host never received the decision, inspect connectivity. If it received the decision but the request is no longer pending, inspect the terminal result. If application succeeded while the phone remains stale, investigate reconciliation of that result rather than sending another permission answer to an already closed operation.

A loading screen also needs a bounded explanation. It may be waiting for encrypted request details that the phone has not received yet. In that case, the interface cannot safely manufacture choices from a title alone. It should distinguish temporary retrieval from an unavailable or expired request, provide a meaningful refresh where supported, and avoid an indefinite loop that leaves the person unable to understand whether any actionable decision still exists.

Restarting is a later repair option, not an explanation. A bridge restart may restore observation; a provider restart may interrupt the operation that requested permission. Determine which component is actually blocked and what work it owns. After any repair, verify the same request's status and the Task's continuation. The goal is to restore one decision's lifecycle, not to produce a new conversation that hides the unresolved history of the old one.

## Verify continuation as well as the decision

A complete acceptance scenario follows the result back into work. Create a fresh harmless request, answer it on the phone, observe the host's application result, and confirm the expected provider behavior. For denial, confirm that the controlled operation did not proceed through that boundary. For permission, confirm that the provider continued and that the task's next observation reached the phone. This checks the whole loop rather than only the decision button.

Then exercise a reconnect, a stale answer, and repeated delivery of the same logical response. The same decision should not become authority for a different request. Keep test data separate from user work and retain the relevant identifiers privately. A test that ran in a simulator or synthetic transport is useful evidence for that environment; a physical-device claim still requires a physical-device check under the relevant conditions.

The practical outcome is confidence with a defined scope. You can tell what was requested, what you decided, whether the host applied it, and how work continued. When something is unknown, the interface names the missing confirmation. That makes remote approvals useful for real engineering: a phone becomes a precise decision surface while the computer remains responsible for enforcing the operation it actually owns.
`;
