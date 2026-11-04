export const body = String.raw`
A coding agent can have a long conversation and still miss the one fact that matters: which checkout contains the fix, why an earlier approach was rejected, or whether the latest test ran after the last edit. Adding more text does not automatically repair that gap. Useful context is a selected, current account of the work, with a route back to the evidence behind important claims.

For GrantTap, this question appears whenever a Task continues after a pause, crosses an execution boundary, or is inspected from another device. The phone needs a concise account that supports a decision. The computer and agent need enough grounded material to do the next step. This guide develops a practical context method around those needs, building on the existing [Cortex Loom guide](/blog/cortex-loom-inside-granttap-token-economy) without treating a smaller prompt as proof of a better outcome.

## Start with the next decision

Imagine an agent investigating a delayed approval. The repository contains UI code, relay transport, provider adapters, old screenshots, release logs, and several previous attempts. Loading all of it creates an impressive context window but leaves the immediate question vague. A useful first question is smaller: did the computer receive the decision for the exact request that is still visible on the phone? That question determines which evidence to retrieve first.

The next decision might instead concern a release, a test failure, or a change of execution host. Each needs a different packet. A release decision needs provenance and checks for the candidate artifact. A handoff needs the current objective, checkout, constraints, and unresolved work. A provider login problem needs a recent readiness observation. The repository is a source of answers, but its entire contents are not the unit that a human or agent needs to receive.

Write the question explicitly before gathering material. Include the expected decision and the conditions that would change it. This gives context selection a stopping rule. Once the evidence answers that question, the agent can act or explain the remaining gap. Without such a rule, reading becomes its own activity: more files are collected, the task grows harder to summarize, and old assumptions survive simply because they occupy a large share of the conversation.

## Separate the objective from the evidence

A durable objective describes the result the user wants. Evidence describes what has been observed so far. Those should travel together without becoming interchangeable. The statement that a task should restore reliable message delivery is an objective. The statement that one native user entry exists for a particular request is an observation. The claim that the model understood the request is an interpretation unless the available evidence supports it directly.

A compact task record can distinguish the objective, current state, decisions, open questions, and next check. This is an authoring discipline rather than a claim that every interface exposes those exact fields. Its purpose is to prevent a persuasive summary from turning assumptions into requirements. When an interpretation is necessary, name it as an interpretation and state what observation could confirm or disprove it.

The distinction is especially useful across providers. A new agent does not inherit the previous model's private reasoning. It can receive an explicit objective and the relevant evidence. That is enough to continue useful work when the record is well prepared. Trying to recreate hidden thought is both unnecessary and less verifiable than preserving the concrete decisions, source revisions, results, and remaining uncertainties that a competent engineer would need.

## Bind code claims to a revision

An explanation of a function is only as current as the source it describes. The same path can contain different code in two worktrees. A branch name can advance while a report is being read. A context item that cites only a filename may therefore be ambiguous. For decisions involving code, include the repository identity and revision, or explicitly state that the evidence describes uncommitted working-tree content.

Suppose a report says that the queue releases ownership after a visible model reply. Before implementing a change based on that report, inspect the current code path and its callers. The behavior may already have changed, or the report may describe only a presentation layer. A revision-bound reference lets the agent ask a precise follow-up instead of treating an old explanation as a live architecture contract.

Freshness does not mean rereading every file constantly. It means knowing which changes invalidate a conclusion. A rename might invalidate a path reference. A provider adapter change might invalidate an execution assumption. A pure copy edit may not affect a transport result. Good context carries enough provenance to make those distinctions, allowing small targeted refreshes instead of repeatedly rebuilding a large narrative from scratch.

## Keep a path from summaries to source

A useful summary helps the reader orient quickly. It should also make expansion possible. If it says that a callback can target an obsolete request, the reader needs a way to inspect the relevant request identity checks and the test that exercises the race. Without that path, compression may remove exactly the information required to challenge the conclusion. A shorter packet can then become more authoritative while being less accountable.

References can point to a source window, a test result, an artifact manifest, or a documented external contract. They do not all need to be copied into the first packet. The important property is that the receiver can request the underlying material when it becomes relevant, within the same permissions. This lets an initial account remain concise while preserving enough depth for implementation and review.

Treat broken references as real gaps. A missing log does not become a passed test because the summary remembers it that way. An inaccessible repository does not become shared merely because its name appears in a Mesh. If the evidence cannot be retrieved, downgrade the claim or regenerate the observation. Context quality improves when uncertainty remains visible rather than being polished away during summarization.

## Understand what compaction can lose

Anthropic's [context engineering discussion](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) treats context as a limited resource and discusses techniques for longer-running work, including compaction and structured notes. That provides a useful starting point. The engineering question for a specific workflow is what must survive when the conversation is shortened, and how you will detect if an important constraint disappeared.

For a GrantTap Task, examples include the authorized destination, whether publication is allowed, a restriction on stopping active work, and the exact test still needed. A summary that retains implementation details but drops those constraints can lead the next agent in the wrong direction. Preserve operational boundaries alongside the goal. They are part of the task state, not optional background that can safely be removed when the token budget becomes tight.

After a significant compaction or restart, ask for a short reconstruction of the next action and its evidence. Compare it with the durable record. This is more useful than asking whether the agent remembers everything. The response should identify the current checkout, remaining work, relevant constraints, and verification step. Any mismatch becomes a concrete repair to the context before additional commands affect the project.

## Record rejected approaches with their reasons

A task can waste considerable time when each new execution rediscovers a failed approach. Keep a brief note of important rejected options and the evidence that ruled them out. For example, a parser change may be irrelevant because the request never reached the computer. A transport restart may be unsafe while the provider owns a build. The reason prevents a later agent from reviving the idea just because its original discussion was compacted.

This record should remain selective. Every abandoned wording choice does not deserve permanent memory. Preserve decisions that affect architecture, safety, compatibility, or the next likely investigation. State what was tested and under which conditions. An experiment that failed on one provider version should not become a permanent universal prohibition; its evidence may need to be revisited after the relevant environment changes.

The useful format is a decision with scope. Name the option, why it was set aside, and the condition that would justify reopening it. That keeps memory from becoming dogma. It also helps a human reviewing the Task from a phone understand why a seemingly obvious fix was not chosen, without requiring a replay of the entire terminal session or access to private reasoning.

## Protect permissions while reusing context

Context reuse is also a data-access decision. Two linked repositories may belong to the same product while having different members or grants. A summary derived from a private source can still reveal that source's contents. Reducing its size does not remove the need for authorization. The receiver must be entitled to the information in the packet, not merely able to open a related task title.

This applies to screenshots, logs, and operational notes as well as source code. A deployment log might include hostnames or account identifiers. A screenshot might contain a private conversation. An authentication failure can tempt an investigator to paste credentials into a record that later travels between devices. Keep the task's reusable evidence minimal and scoped. When sensitive material is necessary, preserve the appropriate access boundary rather than copying it into a broadly shared summary.

GrantTap's Mesh and governance material separates relationships from permissions. Apply that distinction during context preparation: a repository binding tells you where work can be found, while a grant determines who can receive protected information or take an action. If a handoff destination lacks access, the packet should name the missing requirement. It should not work around the boundary by embedding the protected material in an otherwise harmless-looking task note.

## Test completeness before celebrating token savings

A smaller context packet is valuable when it still supports the intended task. Compare what was requested, what evidence was selected, and what actually reached the agent. Count omitted required items and unavailable references, not just bytes or estimated tokens. A packet that saves most of the input by dropping the failure reproduction may make a benchmark look excellent while increasing the number of implementation attempts.

Use a small task-specific checklist. For an approval bug, it might require the request identity, affected code path, rejection conditions, and a reproducible test. For a release, it might require the commit, artifact identity, relevant checks, and remaining device validation. Evaluate the agent's result against that list. This measures whether the context supported the decision, instead of rewarding shortness as an independent goal.

Keep estimates separate from billing and performance. Character-based token estimates can help compare representations, but they are not the provider's invoice. A context reduction does not guarantee a proportional latency reduction because tools, network, and model work contribute other costs. Report the environment, method, and outcome together. The most useful result is a smaller complete exchange that still lets the next engineer verify the conclusion.

## Keep a small refresh contract

For each important context item, identify what would make it stale. A test result may need the same source revision and environment. A readiness observation may need a recent connection and provider login. A decision may remain valid until its owner changes the scope. These lifetimes differ, so a single cache age cannot describe all of them. A small refresh contract gives the next execution a reason to recheck a particular item without discarding every useful fact.

When refreshing, retain the earlier observation as history when appropriate and label the new one clearly. This supports comparison instead of forcing the reader to guess why a conclusion changed. A newer result should supersede an older claim only within the source and scope it actually covers.

## Assemble a context packet for a real continuation

Suppose you leave the desk while a fix is being verified. A useful continuation note names the user-visible problem, the current repository and revision, the change already made, and the exact checks completed. It then identifies the remaining check and the action authorized after it passes. Link the relevant evidence. If the provider still owns a background process, preserve that fact so a new execution does not accidentally compete with it.

Before handing off, review the note from the receiver's perspective. Could someone find the working copy? Can they distinguish a planned test from a completed one? Would they know whether a push, release, or restart is authorized? Can they identify the observation that ends the task? These questions expose context gaps much more reliably than making the summary longer or adding a generic instruction to be careful.

The result should support one meaningful next step. After that step, update the record with its outcome and any changed assumptions. This creates a living evidence trail rather than an ever-growing transcript. In a mobile workflow, that trail gives the phone a useful decision surface and gives the computer a bounded task context. The work remains understandable even when sessions, models, and devices change.
`;
