export const body = String.raw`
A model name is only one part of choosing an agent for a task. The provider must be available on the intended computer, authenticated for the account being used, able to access the relevant working context, and integrated with the controls the person needs. A highly capable model does not help if the selected CLI cannot start or if the destination lacks the repository that contains the work.

GrantTap makes these dependencies visible around a Task that can continue across supported executions. The useful selection question is therefore practical: which available route can complete this work with the required evidence and control? This guide proposes a method for answering it. It does not rank current providers, promise that a particular model is available to every account, or treat a static model list as a durable source of truth. Availability and product capabilities should be checked at the point of use.

## Separate provider, model and execution mode

A provider integration supplies a way to communicate with an agent tool. A model identifies the inference option used within a supported route. An execution mode determines where the work and tools run. These choices interact, but they are not the same setting. Updating a CLI does not necessarily change the selected model, and selecting a model does not automatically create a compatible local execution environment.

This distinction explains many confusing failures. The phone can show a model label while the computer's provider session has signed out. The provider can be installed while a particular operation is unsupported by the integration. A session may expose readable history without exposing the same steering or child-agent controls as another provider. The selector should reflect real capabilities rather than implying that every route becomes interchangeable once a name appears in its menu.

Start a selection record with the provider, intended computer, model option when applicable, and execution mode. Then add the relevant control requirements. This makes a later diagnosis more precise: a missing login, unavailable model, unsupported operation, or absent working copy each has its own repair. A generic statement that the agent does not work hides those boundaries and encourages changes to settings that may already be correct.

## Describe what the Task actually needs

Begin with an observable outcome. A code investigation may need repository search and a source-backed explanation. A small implementation task may need file edits, a local test runner, and a reviewable diff. A mobile release task may need a compatible build environment and signing access. Those requirements narrow the route more usefully than a general reputation for intelligence or a preference for the newest model label.

Name constraints that change the choice. The work may require a particular operating system, an offline test, a physical device, a private repository, or an approval hook. A provider with an attractive general benchmark can still be unsuitable for that route. The task brief should distinguish mandatory requirements from preferences so the agent does not spend time satisfying a convenient preference while missing the environment required for completion.

Keep the result small enough to evaluate. “Investigate this lifecycle failure and provide a reproduction” has a clearer acceptance boundary than “improve reliability.” A bounded result lets you judge whether the chosen route can find the relevant evidence, avoid unsupported assumptions, and report limitations. That practical fit is the foundation for selection; a model ranking can only be additional context after the execution requirements are understood.

## Inspect the available catalog with freshness

A model catalog should be treated as observed configuration, not a permanent universal menu. Options can depend on the installed provider version, account access, organization settings, and execution mode. A cached list may be useful while offline, but its age and source matter. If the provider rejects an option, the interface should preserve that fact rather than quietly substituting a different model and presenting the result as the requested execution.

Human-friendly labels and stable identifiers also serve different purposes. A display name helps the person choose, while the actual provider identifier determines the request. Renaming a label should not silently reroute a Task. When a model becomes unavailable, a clear refusal or explicit alternative is more trustworthy than an unexplained fallback. The user can then decide whether the alternative still satisfies the task's privacy, capability, and output requirements.

For a remote workflow, verify the catalog against the intended computer and account when the integration supports that observation. A list obtained from another host may describe a different installation or grant. Keep unknown availability visible until checked. This avoids a frustrating loop in which the phone offers a plausible option, the computer cannot use it, and repeated sends merely reproduce the same readiness problem under a reassuring model label.

## Check the host and working context

The selected computer owns the local environment. Confirm that the relevant provider is installed there, that its running integration is current enough for the intended operation, and that the working context is accessible. A repository may exist in several checkouts with different revisions. A directory can also contain useful work without being a Git repository. The task should identify the context that actually exists instead of forcing an imaginary repository identity into every kind of request.

If the workflow requires a repository, verify its identity and revision. If it only needs a directory or an attached document, describe that scope accurately and use a supported route. An absent repository should produce a meaningful next step rather than an unusable picker that insists on selecting something nonexistent. The same principle applies to search: a long list of similarly named projects is not an adequate substitute for identifying the intended working copy.

Do not switch computers casually to repair an unavailable provider. Another host may lack local changes, tools, account access, or a required device. A deliberate [Task transfer](/blog/move-a-task-without-losing-work) can prepare the destination and preserve the necessary context. A silent route substitution changes the environment without the person's informed decision. Readiness is about the complete task route, not merely finding any machine that answers a connection check.

## Include control and privacy in the choice

Different tasks require different forms of human control. One may need observation only; another may need approvals, follow-up messages, stopping an owned process, or a supported transfer. Check those operations for the specific integration. A readable transcript does not establish that every command can be blocked before execution. An empty child-agent list does not establish complete visibility when the provider does not expose structured delegation events.

Data routes also matter. A locally running CLI can use a remote model service. A tool call can add another recipient. A browser controller has a different endpoint trust boundary from a native controller. Choose the route whose actual data handling fits the project, using the [privacy map](/blog/granttap-agent-privacy-devices-tools-data) as a practical method. A model's output quality does not erase the need to understand where the task's source and context go.

Review the authority available to the agent as well. A more capable model is not a reason to grant unrelated access. Scope tools and resources to the task, and preserve the distinction between configured policy and observed enforcement. If a required control is unsupported, keep that limitation visible in the choice. The person may select another route or adjust the task, but should not be told that the control exists simply because the provider is generally supported.

## Preserve context when changing an execution

Changing the model within a provider and transferring a Task to another provider are different continuity operations. The new execution needs the current objective, relevant source state, decisions, and unresolved checks. It does not inherit another model's private reasoning. A concise evidence-based continuation is more useful than an attempt to reconstruct hidden thought or an assumption that the new tool can read every earlier private session automatically.

Before a switch, identify what work remains active. A provider may still own background commands even after producing a visible reply. Starting another CLI over the same session or checkout can create a conflict. The transition should respect physical ownership and any supported handoff boundary. A faster model choice is not an improvement if its first action competes with an unfinished build or overwrites local changes that were never included in the continuation record.

After preparation, confirm the destination before assuming that work has started there. Receiving context, preparing a checkout, and starting a new agent turn are separate stages. The exact supported flow depends on the integration. Keep those acknowledgments meaningful. A transfer result should say what the destination actually accepted and which next action starts execution, instead of using a single optimistic completion label for the entire chain.

## Compare a small representative task

If several routes satisfy the requirements, try a bounded task representative of the real work. Use the same source revision, objective, evidence, and acceptance scenario. A useful comparison might ask each route to explain one suspected state transition and propose a reproduction without editing files. That isolates investigation quality before adding build time, package installation, or release authority that can obscure the comparison.

Judge the result by correctness, traceability, and usefulness. Did the agent find the relevant source? Did it distinguish a fact from an assumption? Did it identify missing evidence? Could another engineer reproduce the conclusion? A fluent explanation is not enough, and a larger diff is not automatically better. A route that honestly reports a missing environment can be more useful than one that confidently invents a completed test.

Keep the comparison within its scope. One task is not a universal benchmark, and repeated identical tasks can benefit from warmed caches or prior context. Record conditions and avoid claiming a permanent winner from a small probe. The goal is to make a practical choice for the current project. You can revisit it when requirements, provider behavior, or available integration controls change.

## Measure the complete path to a verified result

Perceived speed includes delivery, readiness, queue admission, model work, tools, checks, and result synchronization. A quick first token does not necessarily mean a quick finished fix. A slower initial response may lead to a correct result with fewer revisions. Measure the interval that matters for the task and keep intermediate stages visible enough to explain a delay without immediately blaming the selected model.

Resource cost should also be compared at the workflow level. Repeated failed attempts, duplicated tool reads, unnecessary builds, and manual review consume time even when a narrow model call appears inexpensive. When exact usage is available, report it with its source and limitations. Do not convert an estimated context count into an exact provider bill or assume that a smaller prompt guarantees the same proportional reduction in end-to-end latency.

The best practical choice balances a verified result with the controls and resources the task requires. That balance can differ between a short explanation, a difficult refactor, and a release operation. Keep the evaluation tied to those outcomes rather than chasing a single number. An agent controller should help the person understand which stage is consuming time, not hide every delay behind the model name in the composer.

## Preserve the reason for an unavailable choice

An unavailable option is useful diagnostic information. Keep the provider's non-secret error, the observed catalog source, and the intended route together. A later refresh can then show whether availability changed or whether the earlier request used the wrong identifier. Simply removing the rejected choice from the screen loses that distinction and can leave the user unsure whether their selection was applied.

If an alternative is offered, describe the material difference before continuing. The alternative might use another execution environment, expose different controls, or require a new login. It should be chosen deliberately within the task's existing authority and requirements. This makes fallback understandable and gives the eventual result an accurate record of which route actually performed the work.

## Repair readiness before sending again

If the selected agent does not start, inspect the original request's route and newest acknowledgment. A provider login failure needs the provider's supported sign-in flow. An unavailable model needs a refreshed availability check or an explicit alternative. A missing checkout needs working-context preparation. A busy physical process needs a supported steering route or a safe queue. These conditions are different, and repeated sends usually do not remove them.

Use the device maintenance path for the relevant component where supported. Check the running runtime version, provider authentication, and active owned requests before restarting anything. A managed MCP restart differs from interrupting the provider's work. After repair, inspect the original logical instruction so it is not executed twice merely because its first receipt was delayed. Recovery should preserve the history that explains what was attempted and which boundary was actually restored.

Record the final selection with a short reason: this route has the needed environment, exposes the required control, and produced acceptable evidence for this task. Keep any limitation beside it. That record can survive a session change and help the next person understand why the choice was made. GrantTap's stable Task is valuable when providers and model options can change without losing the objective, authority, and evidence that make the work worth completing.
`;
