export const body = String.raw`
A recurring agent task should earn its place on your computer. It needs a useful purpose, a bounded operation, a clear result, and a reliable way to stop. Without those properties, a schedule can create more work than it saves: repeated conversations, duplicate commands, noisy notifications, and background processes that compete with the task you are actually trying to finish.

GrantTap brings task control to the devices you use away from the desk. In that setting, automation is valuable when the person can understand what will run, inspect what happened, and change the future behavior through supported controls. This article explains how to design and review recurring agent work. It describes a method and illustrative scenarios, not a request to create any schedule or a promise that every provider exposes the same automation operations.

## Choose work with a repeatable question

A good recurring task answers a question whose answer can change usefully over time. For example, a project might need a periodic report of unresolved build failures against its current revision. The operation has an identifiable input and a result a person can review. “Make the product better every hour” is much less suitable because it leaves scope, priority, authority, and completion open to interpretation on every run.

Start with observation when possible. A report that identifies a concrete change or failure is easier to bound than an unattended loop that edits, merges, and deploys arbitrary improvements. This does not rule out automated changes. It means the authority for those changes should be explicit and their verification should be strong enough for the consequences. A schedule supplies timing; it does not supply a missing product decision or permission boundary.

Before adding the recurrence, ask whether an event would be a better trigger. A check after a relevant commit may be more useful than polling an unchanged repository every hour. A reminder may be sufficient when only a human decision is needed. The best automation is not necessarily the most frequent one. It is the smallest reliable operation that produces useful information or authorized work at the moment that information or work matters.

## Define the destination before the clock

A schedule needs a route: the Task or project context, computer, provider, and relevant working copy. A familiar project name is not enough when several hosts have similar checkouts. The machine that can inspect a repository may not have the credentials or tools needed for another operation. Recurring work should retain an explicit destination instead of choosing whichever computer happens to be online when the timer fires.

The route also determines what happens when the computer is unavailable. Does the operation wait, expire, skip that interval, or report that it could not start? Those policies have different user consequences. A report that was useful at noon might be misleading if it runs several days later against a changed working tree. The schedule should define its useful lifetime, not merely retain every missed invocation as an ever-growing backlog.

For a GrantTap workflow, preserve the distinction between the stable Task and the provider execution that performs one run. A recurring job can produce a sequence of attempts and results without creating unrelated duplicate tasks. If the provider session changes, the continuation needs a current objective and evidence. Reusing a task title should not be mistaken for reusing the correct execution context, especially after updates, transfers, or a change in repository revision.

## Make time and timezone visible

A recurring time is incomplete without a timezone. “Every morning” can mean the owner's location, the computer's system settings, or the service's clock. Those values can differ. Daylight-saving transitions add another ambiguity: a local time may be skipped or repeated. A useful schedule describes its timezone and shows the next planned occurrence in a form the person can compare with the clock on their device.

Intervals and wall-clock times solve different needs. Running every six hours measures elapsed spacing, while running at a named local time follows a calendar convention. Neither is universally better. Choose the one that matches the question. An operational check may care about elapsed time since the previous result; a daily review may care about the person's working day. Avoid hiding that decision behind an attractive label that omits the actual timing rule.

When reviewing a schedule, inspect both its next occurrence and its last observed attempt. A future date does not prove the previous run succeeded. A recent result does not prove the next recurrence is configured correctly. These facts belong together but remain separate. On a phone, that small amount of timing evidence is much more useful than a clock icon whose meaning requires opening a desktop application to discover.

## Prevent overlapping work deliberately

If a scheduled run lasts longer than its interval, the next occurrence creates an ownership question. Starting another agent on the same checkout may cause duplicate commands or conflicting file edits. A useful design specifies whether to skip, defer, or coalesce the next occurrence while work is active. The choice should follow the task's semantics rather than allowing the timer to launch unlimited independent copies.

Physical process ownership matters in addition to a visible model reply. A provider can finish a response while a background command continues. Releasing another scheduled invocation solely because a chat paragraph ended can therefore be unsafe. The admission boundary needs to know whether the previous execution still owns relevant resources. A schedule that waits for that boundary is behaving differently from one that failed to dispatch, even when both temporarily show no new conversation output.

Separate independent work where it is truly independent. Two read-only observations may be able to run concurrently, while two release operations should usually serialize their shared destination. A claim or lock should identify the actual resource being protected. A global lock on every task can waste capacity, but no lock at all can waste work. The goal is controlled concurrency based on known ownership, with a visible reason when the next run is waiting.

## Treat each occurrence as one logical operation

Networks retry. Services reconnect. A scheduler may restart after submitting a run but before recording its acknowledgment. Without stable identity, that uncertainty can become duplicate work. An occurrence should remain identifiable across ordinary transport attempts, allowing the receiver and history to distinguish another delivery attempt from a genuinely new scheduled operation. Matching only on the instruction's text is insufficient because legitimate recurrences often have identical wording.

This is a practical foundation for deduplication, not a promise of perfect exactly-once effects under every failure. An external publication might complete before its receipt is durable. The recovery procedure must inspect that destination before creating another publication. A report-only job has different consequences, but duplicates can still generate noise and consume resources. Define how uncertainty is resolved for the operation you are scheduling, rather than assuming every retry is harmless.

The history should show one occurrence with its attempts and outcome where the integration supports it. A new chat bubble for every network retry makes the system look active while obscuring which instruction was actually accepted. For investigations, retain the occurrence identity privately and correlate it with the destination's activity. This makes it possible to repair the original route instead of creating a second scheduled job that repeats the same uncertainty indefinitely.

## Keep authority smaller than the schedule's lifetime

A schedule can survive changes in a project, team, provider, or release policy. Its original wording should not become unlimited permanent authority. State which operations are allowed, which resources are in scope, and when a human decision is required. A weekly diagnostic report and an unattended production deployment need different authority and verification, even if both are represented by a simple recurring card in the interface.

Review the dependencies after significant changes. If a repository moves or a provider signs out, the schedule should report a readiness problem rather than selecting another destination or bypassing authorization. If the human changes policy, future runs should use the applicable effective rule. A cached description of an old policy is not evidence that the computer will enforce the new one. The controller should make pending or unknown coverage visible where it matters.

Sensitive operations benefit from an explicit final boundary. An automation can prepare an artifact and evidence, then wait for an authorized release decision. When publication is already authorized for that bounded workflow, it should proceed under those terms without inventing repetitive approval steps. The important property is traceable authority, not maximum interruption. A person should be able to understand why a particular occurrence was allowed to perform its concrete action.

## Report results instead of producing background noise

A useful recurring result explains what changed, what was checked, and what needs attention. If nothing relevant changed, a quiet retained observation can be preferable to another long chat message and push notification. Define the communication rule with the task. A critical failure may deserve immediate attention, while a stable daily report may belong in history for later review. Frequency alone does not establish urgency or value.

Avoid equating activity volume with usefulness. Repeated file reads, tool calls, and generated summaries can consume CPU and model context without answering a new question. Measure the operation against its original objective. Did it identify a changed dependency, catch a regression, or prepare an authorized result? If the answer is consistently no, reduce its frequency, change the trigger, narrow the scope, or disable the automation rather than expanding the narrative around its activity.

Notification text should be concise and safe for a lock screen. It can identify the project and reason for attention without including secrets, private commands, or a large excerpt of task history. The detailed result belongs in the authorized task view. This keeps the phone useful as a decision surface while respecting the fact that notifications may be seen in a different context from the protected conversation that produced them.

## Make pause, disable, and deletion distinct

Stopping future occurrences is different from interrupting a run already in progress. Removing a schedule's card is different from disabling its timer. Deleting historical results is different again. A trustworthy control names the effect and confirms it at the component that owns the schedule. Otherwise, the interface can look clean while background work continues because only the presentation was removed.

When a user disables a recurrence, verify the resulting next-run state through supported observations. If an occurrence is already active, show it separately and provide the appropriate stop or continuation behavior for that execution. Do not assume a schedule change safely terminates a provider command. The current run may own file changes or a build that needs an explicit interruption decision. Clear lifecycle distinctions prevent a cleanup action from unexpectedly destroying useful work.

Keep enough history to explain the result. A disabled automation can remain as an inspectable record without continuing to execute. If the user wants it removed, preserve only what the product's retention rules and the authorized action require. The key acceptance check is behavioral: the recurrence no longer launches future work. A disappeared clock icon is not sufficient evidence when the underlying scheduler and the task history live in different components.

## Review the workstation cost

Recurring work consumes more than model tokens. It can wake a computer, scan repositories, retain helper processes, use network bandwidth, and compete with builds. Examine cost over a useful interval and associate it with actual runs. A process snapshot may catch a short active moment or miss a periodic spike. The relevant comparison is whether the automation's useful outcome justifies its total resource use and interruption cost.

Before adding another job, inspect existing ones for duplicate purpose. Two schedules that inspect the same project may be replaceable with one clearer operation. Use scoped caching and change detection when appropriate, but verify that retained evidence remains current. A very quiet job that silently reuses obsolete results is not an improvement. The optimization should reduce repeated work while preserving the question, evidence, and freshness that make the report useful.

A practical review ends with a small inventory: purpose, destination, timing, last result, next occurrence, authority, overlap policy, and stop behavior. If those facts are understandable from the controlling device, automation becomes manageable rather than mysterious. GrantTap's task-centered approach is useful when it keeps recurring work attached to an explainable objective and observed outcome. The measure of success is less unnecessary attention and more reliable progress, with a stop control that genuinely changes what the computer will do next.
`;
