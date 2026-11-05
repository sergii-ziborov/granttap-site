export const body = String.raw`A useful agent tool lets a reader predict what will happen before the call and understand what happened afterward. Its name is only the beginning. The important contract includes the resource being addressed, the accepted inputs, the action's scope, the result structure and the meaning of a failure. When those details remain implicit, a conversational assistant can turn a plausible guess into an unexpected operation. Better wording helps, but wording alone cannot replace validation and enforcement at the tool boundary.

This article is a design workshop for teams connecting their own tools to coding agents and supervising work through GrantTap. It uses a hypothetical preview-deployment service to make the decisions concrete. The proposed fields and operations are examples, not a description of a released GrantTap API. The goal is to build interfaces that are inspectable from a phone, recoverable after an interrupted connection and testable without touching production. GrantTap supplies relevant views of requests and available evidence; the external tool still needs to implement its own contract correctly.

## Begin with one operation and one resource

Take the phrase deploy the site and separate its hidden choices. Which repository, which revision, which environment, which account and which existing service should change? If a tool relies on a default current project, a second agent or a later execution can inherit a different interpretation. For the workshop, define one operation that creates a preview from an explicit revision in a named project. Production activation remains a separate action because it has a different audience and effect.

This separation improves everyday usability as well as review. The agent can request a preview, inspect its result and explain what remains before activation. A human reading the request can identify the target without opening a long transcript. Avoid an operation whose action field accepts arbitrary shell text while its description promises a narrow deployment. If broad command execution is necessary, represent it honestly as broad command execution and enforce the applicable permissions. A precise wrapper should not disguise a more powerful capability underneath an innocuous label.

## Describe inputs that can be validated

Choose stable identifiers for machine decisions and readable labels for people. A project ID identifies the target; a display name helps someone recognize it. Require the revision when the operation builds source, and state how unsupported or missing revisions fail. Define whether an optional timeout controls waiting for the result or cancels the underlying work. A label like force should not hide several unrelated behaviors. If its meaning needs a paragraph of exceptions, consider explicit operations or fields instead.

The [MCP tools specification dated June 18, 2025](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) defines input schemas for tool arguments. In this workshop, use that mechanism to state allowed environments and required identifiers. The schema cannot establish that a revision belongs to the selected repository or that the caller may deploy it. Those are server-side checks against real state. Treat schema validation as the first useful boundary, then verify relationships and authorization before starting an action that consumes resources or changes anything outside the conversation.

## Give read operations a clear scope

Before a mutation, an agent often needs an inventory or a status query. Design that query around the question it answers. A preview-status operation should identify the project and operation being checked, return the observed state and indicate when the observation was made. If the backend cannot be reached, say so. Returning an empty collection as if no previews exist converts an availability problem into a false business fact, which can lead the agent to create unnecessary replacements.

For lists, explain pagination, filtering and truncation. A result containing the first page is not a complete inventory. If a tool reports a bounded sample of logs, include that bound in the response instead of letting the agent infer completeness from a successful call. This is particularly helpful in GrantTap, where the phone may show a received projection rather than every underlying record. The user should be able to distinguish no matching records from an unavailable source and from a partial response without reverse engineering the server's internal behavior.

## Design the result before writing the implementation

For the proposed preview operation, decide what a successful response must establish. It could identify the created preview, the source revision, the target environment and an operation ID for later checks. If the operation only starts an asynchronous build, the response should say accepted or building rather than completed. A URL can identify a resource without proving that the URL serves the intended application. Reserve a verified serving claim for a separate observation that actually checks the destination.

MCP's structured tool results and optional output schemas provide a way to expose machine-readable result data. For a server that declares an output schema, the specified structured result must conform to it. Keep explanatory prose aligned with those fields. If prose says complete while the state field says queued, a human and an agent can take different next actions from the same response. Test that inconsistency explicitly. The protocol mechanism helps describe results; it does not certify the business meaning of a status chosen by your implementation.

## Make failure useful without disguising it as success

A rejected revision, an expired credential and an unavailable deployment backend need different next steps. Give each a stable, bounded explanation and identify whether any work began. For example, a validation failure before creation can safely report that no preview was started. A lost response after creation cannot make that promise. Avoid returning a cheerful text block containing an error buried at the end while the surrounding result is interpreted as successful. The caller needs a reliable outcome before deciding whether to continue.

Keep protocol failures separate from failures of an invoked business operation, following the chosen MCP version's error model. Beyond that protocol distinction, your design should document recovery. An authentication failure can direct the user toward the relevant provider's sign-in route; an invalid project should ask for a corrected target. A timeout with an unknown outcome should direct the caller toward status inspection by operation ID. This recovery language is part of the interface contract, and it deserves tests just as much as the happy path that returns a preview link.

## Decide what repeating a call means

An interrupted connection creates a hard question: did the first call fail, or did only its reply fail to arrive? If creating another preview is undesirable, give the operation an idempotency mechanism scoped to the intended action and caller. Repeating the same operation key should recover the original result rather than silently create a second resource. Reject a reused key carrying different parameters. The exact storage and expiration design belongs to your service, but the observable behavior must be explicit.

A status refresh should not call create again. In the workshop, the agent stores the operation ID and queries it after a disconnect. A human can then inspect the same request from a phone. This is the design lesson behind separating delivery receipts from agent activity in GrantTap's [message-delivery guide](/guide/message-delivery). Do not infer that every external tool already has the same retry guarantees. Verify your tool's actual implementation, including concurrent duplicate calls and a response lost immediately after the backend commits the side effect.

## Treat annotations as descriptions rather than enforcement

A tool can describe itself as read only or indicate that repeated calls are intended to be idempotent. Those declarations help a client understand the proposed interface. They do not enforce the behavior. A read-only hint cannot stop an implementation from writing to a database, and a reassuring tool name cannot grant the caller access to a private project. The MCP specification explicitly treats annotations as hints and requires care about their trustworthiness. Keep the enforceable checks inside the controlled boundary.

For the hypothetical deployment service, verify authorization for the selected project and environment on every relevant operation. Test a caller that can inspect previews but cannot activate production. Also test a valid operation ID belonging to another project. The response should not leak that resource through an overly helpful error. In GrantTap, inspect the applicable [Governance](/guide/governance) state where supported, while remembering that saved policy and confirmed application are different facts. External service authorization remains necessary even when the agent client offers its own approval interface.

## Separate authentication from choosing a target

A caller can know the correct project and still lack a valid service session. Represent that state explicitly. In the preview workshop, return a bounded authentication requirement before starting the action and identify which external service needs attention. Do not ask the agent to paste credentials into the tool arguments or a public issue. A sign-in route should belong to the service's supported authentication flow, and the client should return to the original operation only after the session state has actually been checked.

For GrantTap users, the provider session, the paired computer and the GrantTap account are separate layers, as the [provider sign-in guide](/guide/provider-sign-in) explains. The same separation is useful in a custom tool. A healthy transport does not establish permission to deploy. A valid deployment credential does not establish that the selected source revision is correct. Tests should exercise each layer independently so a failure message identifies the missing condition instead of sending the user through an unrelated login or encouraging another blind submission.

## Make cancellation a real contract

Cancellation is often the least specified operation in an otherwise careful tool interface. State whether it cancels a wait, requests cancellation of a job, or confirms that the backend has stopped creating effects. Those outcomes are different. In the workshop, a cancel request can acknowledge receipt while the build worker is still stopping. The final canceled state should depend on a backend observation, not on the client closing a sheet. If activation already occurred, cancellation may be impossible and a separate rollback may be required.

Test a cancellation racing with completion. The result should name the operation and describe the actual final state without inventing a cancellation that arrived too late. Let the caller inspect the completed preview rather than leaving it in an endless stopping state. GrantTap users encounter similar distinctions between stopping a running agent, canceling a queued message and dismissing a notice. When designing an external tool, use verbs that explain the real target. A single generic stop button should not pretend to reverse all stages of a distributed workflow.

## Keep evidence readable and appropriately bounded

A useful result contains enough evidence to evaluate its own claim. For a build, that could include the source revision, build identifier, exit outcome and a path to a bounded log. Avoid putting the entire environment or credential-bearing request into the result. A concise summary should identify what was observed and what remains unchecked. If the log is truncated, state the cutoff. A small, explicit evidence packet is easier for an agent to use and easier for a human to review remotely.

GrantTap's [audit and evidence chapter](/guide/audit-evidence) distinguishes a requested call, a reported result and independently observed changes. Apply that distinction to your service. A build worker reporting success is evidence about that worker's operation. A separate HTTP check is evidence about the serving preview. A manual interaction is evidence about a particular user journey. Connect those records using the operation identity instead of collapsing them into a single success flag that leaves the reviewer guessing which stage was actually verified.

## Test the interface with hostile timing and ordinary mistakes

Build a test matrix from plausible disruptions. Submit the same creation request twice concurrently. Disconnect after acceptance and before the response. Supply a revision that exists in another repository. Expire the credential between status inspection and activation. Return a partial log. Ask to cancel an already completed operation. None of these require an imaginative adversary: they are normal outcomes of remote development, multiple clients and asynchronous backends. A tool that handles them clearly will be easier to supervise in practice.

Use a controlled backend or test account for this workshop. Record the expected observable outcome before running each case, including the number of resources that may exist afterward. Tests should inspect backend state where a side effect matters; merely asserting the wording of a response can miss duplicate creation. Keep destructive operations outside the fixture unless specifically required and isolated. The acceptance question is whether the caller can choose a correct next action from the response, not whether the transcript contains a polished explanation of why something probably worked.

## Present a compact decision on the phone

A mobile approval view has limited space, so prioritize the facts needed for the decision: action, target, environment, source revision and immediate effect. Put longer logs behind a detail view. Do not hide a production activation inside a preview request or replace the target with a vague current project label. When the user returns after an interruption, the same identifiers should still describe the request. A changed working directory or selected device should not silently redirect an already prepared operation.

Check the available [request and approval workflow](/guide/questions-approvals) for the provider integration you use. Not every provider supplies identical native details, and a missing field should remain missing instead of being guessed from the nearest message. If the external tool requires an additional service-side approval, explain that layer separately. The result is a smaller, more honest decision surface: the user can authorize a concrete action and then inspect its outcome, while the interface preserves the distinction between sending a decision and receiving confirmation that it took effect.

## Keep examples honest about implementation status

Documentation should distinguish the proposed contract from the deployed implementation. If idempotency, structured results or cancellation are still planned, mark them as planned and avoid examples that imply those guarantees already exist. An agent may use an example as an operational assumption, so aspirational documentation can become a runtime problem. Keep a small set of tested examples tied to the supported protocol and server version, with both successful and failed outcomes that match the current code.

During review, read the example as if you were the caller recovering after a lost response. Can you find the operation identity, understand whether work began and choose a safe status query? If the answer depends on private knowledge of the backend, the contract still needs work. This exercise is inexpensive and often reveals missing semantics before a real integration encounters them. It also gives a human reviewing the operation on a phone a compact description that agrees with what the agent and server actually do.

## State time and retention boundaries explicitly

An operation can outlive a client session, while its diagnostic details may have a shorter retention period than the resource it created. Explain those boundaries in the contract. If a status record expires, the caller should learn that the record is no longer available rather than being told that the preview never existed. Keep an appropriate resource lookup path where the service supports one, and distinguish that lookup from repeating the original creation request.

Use explicit time zones or unambiguous timestamps for expiration and observations. A human looking from a phone in another region should not need to guess which computer's local time a deadline uses. Test the displayed meaning with a different client time zone and an expired fixture. These details are small, but they determine whether recovery remains understandable after the immediate conversation has ended and the agent returns to an operation whose original response is no longer in its active context.

## Maintain the contract as the service evolves

Version the observable behavior when a change can alter an agent's next action. Renaming a field, changing the meaning of complete, removing a status operation or changing idempotency retention can break callers even if the function name stays the same. Keep example responses and failure cases beside the implementation. During an upgrade, test an older supported client against the new server and a new client against the oldest supported server. Compatibility is a relationship between actual versions, not a sentence in a release note.

Finish the workshop by writing a short contract review: what each operation targets, what a response establishes, which effects are repeatable, how uncertainty is recovered and where authorization is enforced. Link the tests that exercise those promises. This document can be read by the agent implementing the tool, the human reviewing a phone request and the developer investigating a failed run. A good MCP integration is therefore more than a discoverable function catalog. It is an interface whose behavior remains understandable when the first attempt is interrupted, the caller is mistaken or the service is changing underneath it.`;
