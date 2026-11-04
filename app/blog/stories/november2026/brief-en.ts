export const body = String.raw`
The most expensive instruction to a coding agent is often a vague one that sounds complete. “Finish the app” leaves the agent to decide what is broken, what counts as finished, which repository to change, and whether a release is authorized. When the person is away from the desk, those guesses can continue for a long time before anyone notices. A useful task brief reduces that uncertainty before the first consequential command.

GrantTap makes this practical because a phone can carry a precise instruction and a later decision to the computer that owns the work. The phone does not need to become a desktop editor. It needs to communicate enough context for the agent to act within the intended scope and return verifiable results. This guide shows how to prepare that instruction, using an imaginary delivery bug as a running example rather than claiming that a particular project or release has already been tested.

## Describe the moment that fails

Begin with the user's action and the visible result. “After I approve a request on the phone, the sheet remains Applying and the computer does not continue” is more useful than “Approvals are broken.” It identifies a trigger, a surface, and an expected continuation. It also leaves room for several possible causes. The interface may be stale, the decision may not have reached the host, or the provider may be waiting on another boundary.

Add the conditions you actually know: the affected Task, intended computer, provider, and approximate time. Include a screenshot when it clarifies the interface, but do not rely on the screenshot to explain every step. A cropped image may omit the task route or the pending request's identity. A short written sequence gives the investigator a reproducible path without asking them to infer the entire scenario from visual fragments.

Keep observation separate from diagnosis. If you suspect the relay, label that as a hypothesis. Do not require a relay rewrite merely because the message is delayed. The agent should first establish which acknowledgment is missing. A task brief is strongest when it constrains the result while allowing the investigation to follow evidence. Prematurely specifying the cause can make a capable agent efficiently repair a component that was never responsible for the failure.

## Name the intended behavior

Describe what should happen after the trigger. In the approval example, the decision should apply to the correct pending request, the computer should acknowledge the outcome, and the phone should stop presenting the action as unresolved once fresh evidence arrives. These are observable behaviors. They are more durable than a demand to call a particular function or set a particular flag, because implementation details may change during the fix.

Include the important negative cases. An answer to an expired request should not approve a newer request. A reconnect should not duplicate the decision. Opening an old notification should not invent a live permission prompt. Those cases define the edges of the desired behavior. They also help the agent choose meaningful tests instead of writing a check that merely confirms the new implementation's internal shape.

Avoid claiming a universal performance target without an environment. “The screen should update promptly after computer acknowledgment” is a useful initial requirement. A precise timing budget can follow a baseline measurement on the relevant devices and network. If the task genuinely requires a fixed limit, state the conditions and how it will be measured. This prevents a fast local simulation from being mistaken for proof about every physical phone and mobile connection.

## Keep the scope small enough to review

An investigation can touch several repositories while still having one coherent goal. The UI, bridge, and relay may all participate in approval delivery. Name the repositories that are relevant and the boundaries the agent may inspect. Also say which adjacent systems should remain outside the change unless evidence makes them necessary. This helps prevent an understandable bug report from becoming a broad rewrite of authentication, deployment, and project storage.

Scope is not a prohibition on discovering dependencies. If a required fix crosses the original boundary, the agent should explain the dependency and make the resulting change reviewable. The important distinction is between necessary connected work and speculative expansion. A new feature does not become part of the task simply because it would be convenient to implement while a file is open. Keeping the objective visible helps both the agent and human judge that distinction.

For remote work, a smaller review unit also improves communication. The person can understand a specific before-and-after behavior on a phone, inspect a concise diff summary, and answer a concrete question. A large unexplained collection of changes is harder to approve responsibly. If the repair has several independent parts, ask the agent to identify them and preserve their verification boundaries rather than presenting every edit as one indivisible success.

## Identify the working environment

Name the intended repository or project directory when known. If there are several checkouts, identify the relevant branch or revision. The same repository can exist in a release checkout, an experimental worktree, and a user's active development folder. A folder with a familiar name is not enough to establish which copy should change. The brief should help the agent find the environment without silently substituting another project.

Include constraints that affect reproducibility. A bug seen on a physical phone may not occur in a simulator. An offline test is different from a normal network test. A provider started directly in a terminal may have a different environment from a managed service. These distinctions should guide the first inspection. They should not be buried in a late comment after the agent has already completed a repair under unrelated conditions.

The [Task transfer guide](/blog/move-a-task-without-losing-work) is useful when the work really must move. Transfer is a deliberate operation with source and destination state, not a shortcut for guessing where the files are. Before changing hosts or providers, preserve the current objective, working copy, local changes, and unresolved checks. A well-prepared brief makes that continuation possible without pretending that all environments share identical files or credentials.

## State authority in concrete terms

An agent needs to know which actions are already authorized. Reading source, making a local fix, running checks, pushing a branch, merging, publishing a package, and deploying a service are different operations. The brief can authorize the intended sequence explicitly. Once that authorization exists, the agent should use it rather than repeatedly interrupting the person for the same routine step. Clear authority supports both autonomy and accountability.

Be specific about consequential actions. “Prepare a release candidate and report the evidence” differs from “Publish the verified candidate to the existing internal TestFlight group.” “Clean generated files for this build” differs from “Delete old project archives across the disk.” Precise wording lets the agent complete the work that is actually intended while keeping the result concrete and reviewable. It also avoids an approval request that arrives before there is anything meaningful to inspect.

Authority still has scope. An instruction to fix one service does not authorize sending messages to unrelated people or changing another product's production database. If the investigation reveals a genuinely new consequential dependency, the agent should make it concrete and explain why it is needed. The goal is fewer unnecessary interruptions, supported by a clear task record, rather than a vague permission statement that can be stretched to cover any later idea.

## Provide evidence that narrows the first search

Useful starting evidence includes an exact error message, an affected request identifier kept privately, a short reproduction sequence, and the last known working behavior. A timestamp helps correlate observations across devices. A version helps locate the relevant code and runtime. None of these facts proves the cause, but together they can reduce the investigation from an entire product to a specific path and interval.

Do not flood the initial brief with every available log. Large unfiltered output can hide the one relevant transition, consume context, and expose information that does not belong in the task. Start with the smallest complete evidence that explains the symptom. Keep deeper material available through references. The agent can then retrieve the next source based on the current question rather than repeatedly scanning a large collection without a stopping rule.

If evidence is missing, say so. “I did not check the computer terminal” is useful information because it prevents a later summary from treating native delivery as established. “The screenshot is from the previous build” changes how it should be interpreted. Explicit unknowns help the investigator design the next check. A polished but ambiguous report is less valuable than a plain account that distinguishes what was seen, what was attempted, and what remains unverified.

## Define completion through an observable scenario

Acceptance criteria should describe the user's path. For the approval bug, open a fresh request, choose a decision on the phone, observe computer acknowledgment, and confirm that the provider continues only when the decision permits it. Then try the stale-request case and a reconnect. The task ends when the relevant behavior is demonstrated with evidence, not when the agent has edited a likely function or written a confident summary.

Choose checks that can detect the original failure. A test that only compares a newly added field with itself provides little assurance. A controlled race between an old response and a new request can be much more useful because it exercises the actual boundary. The required test depth should match the risk. A small copy change usually does not need a large new test suite, while decision routing deserves meaningful regression coverage.

Keep the difference between completed and planned checks visible. A simulator pass is a real result for that simulator. It is not a physical-device result. A successful build does not establish that a provider accepted the decision. A release upload does not establish that the build is available to testers. The brief should invite this precise reporting so the human can make a decision without reconstructing the limits from scattered caveats later.

## Ask for progress that changes your understanding

Useful progress reports explain what the agent learned, what remains uncertain, and which next step will resolve it. “The phone created the decision, but the host has no matching receipt; I am checking that route” narrows the problem. A stream of generic Working updates does not. The person should be able to tell whether the task is advancing, waiting on an external condition, or revisiting an assumption that has already been disproved.

For longer work, ask the agent to retain a concise continuation record. It should identify the current revision, changes made, checks completed, and next required action. This prevents a new session from repeating old experiments or misreading an unfinished release as a completed one. The record should preserve existing authorization and constraints. It need not contain private model reasoning or every line of terminal output to support competent continuation.

A question to the human should be self-contained and limited to information that is genuinely missing. If the answer already exists in the task history, local configuration, or connected source, the agent should inspect that evidence first. This matters on a phone, where repeated questions can be more disruptive than the coding work itself. The brief can request autonomous routine progress while reserving questions for decisions that actually change scope, risk, or the desired product behavior.

## Use a brief that survives the next handoff

A practical final brief can be written in connected prose: reproduce the approval that stays Applying; inspect the named Task and computer; preserve request identity across reconnects; fix the relevant path; run a regression that includes a stale response; prepare the authorized release; report the exact build and remaining device checks. Add the current source references. This tells the next execution what result to achieve and what evidence must support its claim of completion.

Review the brief for accidental contradictions. If it asks for immediate execution while forbidding interruption of an active provider, the agent needs a safe queue or a supported steering route. If it asks for a physical-device result while the phone is disconnected, the report must keep that dependency visible. A good instruction does not make real limitations disappear. It makes them specific enough to handle without losing the overall objective or repeatedly asking the same question.

The payoff is better work with fewer messages. The agent can investigate independently because the objective, environment, authority, and completion scenario are clear. The person can review progress from a phone because each update refers to a concrete boundary. GrantTap's role is to carry those instructions and decisions between devices while keeping the Task understandable. The quality of that shared task record is one of the most practical improvements a team can make before adding another model or another automation.
`;
