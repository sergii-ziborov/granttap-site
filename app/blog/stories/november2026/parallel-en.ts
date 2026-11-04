export const body = String.raw`
More agents can produce more activity without producing a finished change sooner. One agent edits an API while another changes its caller, both run the same heavy build, and a third summarizes a revision that is already obsolete. The bottleneck has moved from writing code to coordinating ownership, evidence, and integration. Parallel work becomes useful when the pieces are genuinely separable and someone remains responsible for the combined result.

GrantTap's task view is useful for understanding that coordination from another device. The person needs to know which work belongs to which execution, what each agent is changing, and why a task is waiting. This guide describes a practical approach to parallel coding work, including worktrees, shared resources, review, and workstation cost. It is a workflow method, not a recommendation to spawn agents for every task or a claim that each provider exposes the same delegation controls.

## Split by an outcome that can be checked

Begin with the finished behavior, then look for independent outcomes inside it. A documentation update and a narrowly scoped API regression test may be separable. Two agents rewriting the same state machine are much less independent, even if one is described as working on the UI and the other on transport. Shared types, lifecycle assumptions, and generated files can connect work that initially appears to live in different folders.

Give each parallel task a concrete result and a verification boundary. The task should name its inputs, intended change, relevant constraints, and evidence required before integration. “Inspect whether old responses can update a new request” is a better research assignment than “look at approvals.” A bounded assignment produces a result another engineer can assess without needing to reconstruct every command or accept the agent's overall confidence.

Not every task should be split. A small coherent fix may finish faster in one execution because coordination and integration have a cost. Use parallelism when independent work can materially shorten the path to the shared outcome. If each agent needs to wait for the others' changing implementation, the split is probably premature. Clarify the contract first, or keep the tightly coupled part under one owner while delegating genuinely independent investigation.

## Distinguish a Task from its executions

A stable Task describes the human objective. An execution describes a provider session doing some part of that work. Child-agent activity may belong inside an execution rather than becoming another unrelated top-level request. Preserving these relationships helps the person see the overall objective without losing the boundaries between contributors. A flat list of similarly named conversations can hide which agent owns the next action or whether two conversations are actually competing for the same work.

Provider support also matters. An integration can expose a main conversation while providing limited or no structured child-agent events. An empty Agents view then requires interpretation within that coverage. It should not automatically be read as proof that no delegation happened, nor should the controller invent agents from arbitrary tool text. The useful presentation distinguishes observed child activity, unsupported visibility, and a genuinely empty set when the source can establish it.

For task design, make ownership explicit even when the UI has limited visibility. Identify the person or execution responsible for each result and the owner of integration. This can be recorded in the task brief and handoff notes. A model name is not an ownership system. Several sessions can use the same provider, and one session can continue work begun by another provider after a deliberate transfer.

## Isolate file changes before parallel editing

Git's [worktree documentation](https://git-scm.com/docs/git-worktree) describes multiple working trees associated with one repository. That is a useful basis for separate checkouts while sharing repository storage. For agent work, the operational benefit is straightforward: each editing task can have its own working tree and branch, making its changes easier to inspect without both agents writing directly into the same mutable directory.

A separate worktree is not a complete sandbox. Processes can still share ports, caches, credentials, databases, signing identities, or external services. An agent in one worktree can also access other paths if its operating-system permissions allow it. Keep these boundaries distinct. Worktree isolation helps manage source changes; it does not automatically enforce project policy, prevent every cross-task effect, or establish who may publish a resulting artifact.

Before starting, record the base revision and how the result will reach integration. If both tasks start from the same commit, reviewers can see their individual diffs against that baseline. If one depends on another's new contract, represent that dependency explicitly. Avoid silently rebasing or resetting a colleague's active tree to make the branches look aligned. The integration owner should understand where each candidate came from and which assumptions it expects the final code to satisfy.

## Reserve shared resources explicitly

Consider two agents testing separate web changes. Both may try to bind the same development port. Separate files do not prevent that collision. Two mobile builds may compete for the same simulator or signing operation. Two deployment tasks may target one production service. Identify these shared resources before they become mysterious failures in logs, and decide whether to allocate distinct resources or serialize the relevant step.

A resource claim is useful when it describes the actual thing being protected and has a clear owner and lifetime. A vague claim on “the project” can block unrelated work, while an omitted claim can allow conflicting actions. Keep the scope practical: a test port, a particular device, a release destination, or a mutable database. Review stale claims carefully so a departed execution does not prevent progress forever.

Waiting can be the correct result. A task that has finished editing may wait for the shared integration check or physical device. The controller should explain that boundary instead of treating every wait as a broken agent. This is particularly important away from the desk, where the person may otherwise press Run again and create another process that competes for the same scarce resource without moving the overall task forward.

## Share contracts instead of constant transcript copies

Parallel contributors need a common understanding of the interface they are changing. Share the relevant contract, source revision, and constraints before implementation. A UI contributor may need the lifecycle states and ordering rules; a transport contributor may need the payload identity and acknowledgment semantics. Sending every transcript line to everyone can consume context while making the actual agreed boundary harder to find.

Record changes to the contract as explicit decisions. If the transport outcome gains a terminal state, the UI task needs that fact and the source that defines it. A private assumption in one conversation is not enough. The update should say what changed, why, and which dependent work must be rechecked. This gives other contributors a bounded refresh rather than forcing them to reread a growing discussion to discover a new requirement.

Keep evidence scoped to the recipient's permissions. Parallel work does not make every repository or operational note universally shared. A concise summary can still contain sensitive source or credentials. The shared contract should include what the collaborator needs and can receive. Missing access is a dependency to resolve, not a reason to paste protected material into an otherwise public task note.

## Let one owner integrate the result

Independent branches are candidates, not a finished combined system. An integration owner reviews their interaction, chooses the order of application, and resolves conflicts with awareness of the shared objective. This role can be performed by a human or an authorized agent, but it needs a clear scope. If every contributor assumes another will handle the final combination, individually successful tasks can leave the user with no usable result.

Before integration, inspect each diff and its evidence. A reported test pass must correspond to the candidate revision, not an earlier worktree state. If one change modifies a shared type, revisit dependent tests even when the other branch had passed independently. Mechanical conflict resolution is not enough: two changes can merge cleanly while disagreeing about lifecycle or behavior. The combined verification should exercise the user-visible scenario that motivated the work.

Preserve the distinction between accepting a contribution and shipping it. Merging local code does not prove a package was published, a service updated, or a build reached testers. When release is part of the authorized task, the integration owner should carry that sequence through with artifact identity and serving checks. When it is not, report the concrete reviewable candidate and the remaining release decision without implying that users already have the change.

## Measure work rather than process count

A workstation can legitimately run several bridge, provider, and build processes. Their number alone does not tell you whether parallelism is healthy. Inspect parent relationships, task ownership, active commands, and sustained resource use. A waiting stdio connection differs from a duplicate monitor scanning the same history. A heavy compiler can be doing useful work while a lightweight orphan can repeatedly trigger expensive downstream operations.

Measure over an interval that reflects the workload. A single CPU snapshot can catch a transient peak or miss periodic repeated work. Compare total time to the verified result, repeated builds, duplicated reads, memory pressure, and interruption cost. More model output is not an independent benefit. If parallel agents spend most of their time refreshing the same context or waiting on the same build, a smaller coordinated set may finish sooner with clearer evidence.

Optimize repeated work carefully. Shared immutable caches can help, while mutable derived state may need isolation or coordination. Skipping unchanged observations can reduce background cost, but it should not hide a fresh execution transition. A quiet process that serves obsolete evidence is not healthy merely because its CPU use is low. The useful target is less unnecessary work with the same correct, current result and an understandable ownership trail.

## Handle failure without restarting every contributor

When one parallel task fails, identify its boundary before restarting the group. A port conflict, missing provider login, and failed assertion need different repairs. Other contributors may have useful work in progress. A broad stop command based on a provider name can terminate unrelated user sessions as well. Prefer operations that know which process they own and preserve the work that does not depend on the failed component.

Retain a concise failure record: candidate revision, relevant command, observed error, and whether any side effect occurred. If a deployment outcome is unknown, inspect the destination before trying again. If a task's test failed because a shared resource was occupied, fix that scheduling problem rather than changing product code until the test happens to pass. Evidence should guide recovery so the group does not turn a coordination issue into a new implementation defect.

After recovery, rerun the checks justified by the changed conditions. There is no need to repeat every successful independent check unless a new edit or dependency invalidates it. This keeps verification meaningful and avoids expensive loops of identical builds. The integration owner should record which results remain applicable and which were refreshed, so the final report can explain the combined state without claiming that every possible environment was tested.

## Keep the final integration queue small

Finished branches can also form a backlog. If contributors keep producing candidates faster than anyone can review and combine them, additional agents increase work in progress rather than delivery. Limit that queue according to the team's actual review capacity. A small number of clearly verified candidates is easier to integrate than a large collection whose assumptions have begun to diverge from the current source.

When integration is the bottleneck, direct effort toward the missing shared check or contract decision. That can be more valuable than starting another independent implementation. Parallelism should serve completion, including the human attention needed to assess the result.

## Close with a combined evidence record

The final record should identify the objective, contributors' results, integrated revision, relevant checks, and release state. It should also retain material limitations, such as a physical-device check that was not available. This is enough for the next engineer to understand what was completed without reading every conversation. It also helps the person using GrantTap from a phone see the outcome instead of a collection of disconnected Done messages.

Review whether parallelism helped. Did independent investigation shorten the critical path? Did separate worktrees reduce conflicts? Were shared resources actually coordinated? Which repeated steps could be removed next time? These questions produce a useful improvement to the workflow. Counting agents, messages, or terminal commands without connecting them to completion encourages activity that can feel impressive while increasing the time before the user receives a reliable change.

Parallel coding works best as a disciplined division of responsibility. Each contributor has a bounded result, shared contracts remain explicit, resources have owners, and one integration path produces the finished behavior. GrantTap can make those tasks and decisions visible across devices when the underlying observations support them. The goal is a result the person can understand and verify, with concurrency used where it genuinely helps that result arrive sooner.
`;
