export const body = String.raw`
“Done” can describe an edited file, a passing test, a built package, or a release that users can actually open. Those are different milestones. In a mobile coding workflow, the distinction becomes immediate: the agent says the fix is finished, you open the app on your phone, and the old behavior is still there. The missing step may be distribution or activation rather than implementation.

GrantTap keeps a Task and its observations visible across devices, which makes it a useful place to retain the evidence behind a completion claim. The objective is not a larger report. It is a short, traceable connection between the user's problem, the changed source, the relevant checks, and the artifact or service now in use. This guide explains how to build that connection and report its limits without converting every task into an unnecessary release ceremony.

## Define what the user should be able to do

Start with the original scenario. If a repository picker jumps back to the top while scrolling, completion means that a person can select the intended repository without the view fighting their interaction. A successful compile is useful but does not exercise that behavior. The acceptance scenario should describe the trigger, expected result, and relevant edge cases, including an empty list or an unavailable repository when those are part of the product requirement.

The same principle applies to delivery. A receipt can prove that a computer received an instruction without proving that the provider ran it. A visible answer can appear before a background build finishes. Choose evidence that corresponds to the user's actual outcome. Otherwise, a report can contain many true facts while never establishing the one fact the person needs to decide whether the problem is resolved.

Write the completion boundary before implementation where possible. It helps the agent select meaningful checks and prevents the definition of success from drifting toward whatever happened to pass. A low-impact text change may need only a rendered inspection and normal checks. A request-routing race needs a controlled timing scenario. The amount of evidence should follow the change's consequences, rather than the length of the task description or the agent's enthusiasm.

## Identify the source that was checked

Record the repository and revision for the candidate. If checks ran against uncommitted content, preserve a concrete account of that working-tree state. A branch name alone is insufficient because it can move. A familiar folder name is also insufficient when several worktrees exist. The reviewer should be able to locate the exact source behind the result without guessing which of several similar checkouts the agent used.

Connect each significant check to that source. If another edit occurs after the check, decide whether it invalidates the result. A code change in the tested path usually needs a relevant recheck. A documentation correction may not justify rebuilding an unrelated mobile binary. This is a dependency decision. Repeating everything blindly wastes resources, while retaining every old pass regardless of source changes weakens the completion claim.

Keep source provenance separate from release availability. A commit pushed to the repository proves that the change reached that repository. It does not prove that a package registry, deployment, or installed app contains it. The source record is the beginning of the chain. Subsequent evidence should identify which artifact was built from it and where that artifact was verified, so the report can distinguish a reviewable change from a released behavior.

## Use tests that can expose the original failure

A regression check is strongest when it would have detected the problem before the fix. For a stale response bug, control the ordering of the old response and the new request. For a queue duplicate, exercise reconnection or repeated delivery of one logical instruction. These tests examine behavior at the relevant boundary. A test that simply asserts the presence of a newly added flag may pass while the original user scenario still fails.

Read a passing test within its scope. A parser test establishes parsing behavior for its inputs. A simulated transport test establishes the modeled exchange. A UI test can exercise interaction on its configured device and environment. None of those results automatically covers every provider, physical device, or network. Their value increases when the report states what was tested precisely and does not inflate a narrow result into a universal product guarantee.

When a required check fails, investigate the failure before weakening the check. The expected result may be outdated because a legitimate content count changed, or it may reveal a real regression. Those are different situations. Update obsolete assumptions while preserving the test's behavioral purpose. If the failure is environmental, report that evidence and resolve the relevant dependency. A green command obtained by skipping the important boundary is not the same result.

## Describe the environment as part of the result

A simulator and a physical phone exercise different conditions. A synthetic relay and the production network exercise different conditions. A development process and a managed service may load different configuration or runtime versions. Name the environment that produced the observation. This is not an apology for a useful test; it is the information needed to know what the test supports and which check should come next.

For performance claims, include the boundary measured. A fast encryption microbenchmark can establish reduced cryptographic overhead for its workload. It does not establish the same speedup for a full message delivery that includes sleeping computers, authentication, queue admission, model work, and mobile networking. Keep the unit, environment, and method together. A precise small result is more useful than an impressive number applied to a broader workflow without evidence.

If the required environment is unavailable, preserve the open condition. Do not repeatedly run unrelated local checks until the missing physical test disappears from the summary. The task can still produce a concrete candidate and completed evidence. The report should explain the remaining dependency and its practical significance, so the person can distinguish a ready-to-test artifact from a verified result on the environment that originally failed.

## Bind the built artifact to the source

Once a candidate is built, identify the artifact itself. A version label helps humans, but a concrete build identity or cryptographic digest distinguishes bytes. The record should connect that artifact to the source revision and relevant build configuration. This matters when several candidates share a similar filename or when an old package remains in a download directory beside a newer one.

Preserve the artifact that passed the intended checks when the release path requires exact provenance. Rebuilding later may produce another candidate with different inputs, even when the source commit is unchanged. If a rebuild is necessary, treat it as a new artifact and perform the checks justified by that change. The purpose is not to freeze every development output forever; it is to avoid claiming that one artifact was tested and silently distributing another.

For a website, the same idea applies to the built server and static assets. Source can be correct while an old container continues serving the previous bundle. A deployment record should identify the image and its source. The final serving check then asks which image is actually running and whether its public routes contain the expected behavior or content. That closes a gap that a successful local build cannot close by itself.

## Distinguish upload from availability

External distribution usually has several stages. A service can accept an upload before it has processed the artifact or made it available to the intended audience. A package registry can acknowledge publication before every read path reflects the new version. An app distribution system can receive a build before testers can install it. Treat each acknowledgment as evidence for its own stage rather than using the first accepted response as the entire release result.

Verify the intended destination. For a package, check the public version metadata and artifact identity through the relevant registry route. For an app build, verify the platform, version, build identity, and intended testing group or release state. For a website, request the public URL after the serving update. The exact method depends on the system, but the question remains stable: can the intended recipient obtain the candidate that was prepared and verified?

When the outcome is uncertain, inspect before repeating. Re-uploading or republishing with a new identity can create confusion or duplicate side effects. A delayed acknowledgment deserves a status check against the original operation. Keep its identifier privately when needed for correlation. This is the release equivalent of preserving one message identity during delivery recovery: understand what happened to the existing attempt before creating another operation that may succeed independently.

## Verify what is actually running

Installed and active software can differ. A new runtime package may be selected for the next launch while an existing process continues using an older version. A phone may still have the previous app build. A server may serve an older image behind the expected domain. The final check should inspect the active component rather than assuming that a successful installer changed every long-lived process immediately.

Use the same route the user will use. A candidate container on a private port is valuable before switching production, but the public domain still needs its own check afterward. A local Node client can isolate encrypted synchronization, but the physical app remains another boundary. A provider version command can establish the installed CLI while a running session uses its earlier process. Name those distinctions in the evidence instead of collapsing them into a single Updated statement.

Activation should respect active work. Restarting a bridge differs from terminating a provider that owns commands and file changes. A safe update may wait for an appropriate idle boundary, and that wait should remain visible. Faster distribution is useful, but forcing activation through live work can create a worse incident than the original delay. The result to verify is the new behavior under the intended operating conditions, not merely a changed process identifier.

## Retain a bounded recovery path

Before replacing a serving component, identify how to restore the previous verified version if the candidate fails. For a stateless site, that may be a retained image and configuration. Stateful services need a recovery strategy that also respects new writes. The task's scope determines the appropriate preparation. A small blog update should not casually replace an account service or change its storage merely because the two share a domain.

A candidate check can reduce the chance of a failed switch. Verify the relevant routes or behavior before making the candidate public, then repeat the important checks after activation. Keep the old serving identity available until the new one is established. If activation fails, restore the known route and report the outcome. An accepted deployment command is not evidence that the replacement stayed healthy or that the user reached it successfully.

Recovery evidence should stay proportionate and private where appropriate. The user needs to know the result and material limitation, not receive raw environment files or deployment secrets. A concise record can retain source and image identities, health observations, and the rollback version without exposing credentials. This supports future maintenance while keeping the final task report readable on a phone and focused on the behavior the user asked to change.

## Check scheduled content at the intended date

Publishing a site bundle can include content that should become visible later. Verify both sides of that rule: current stories appear in the journal and future stories remain unavailable through their public routes until the configured publication day. The timezone belongs to the rule, not to whichever workstation built the bundle. A deployment that contains all the right files can still have the wrong editorial behavior if it exposes tomorrow's material early or requires another manual build to release a prepared story.

Retain the dated publication inventory alongside the candidate evidence. It helps distinguish missing content from correctly scheduled content and gives the next maintainer a concrete calendar to inspect.

## Make the final report independently understandable

Lead with what the user can now do or install. Name the version or public route when relevant. Explain the changed behavior, the meaningful validation, and any remaining required check. The report should stand on its own because intermediate messages may be collapsed or forgotten. A reader should not need to reconstruct the whole conversation to learn whether the change is local, published, active, or still waiting for a specific environment.

Be precise about limitations without adding hypothetical warnings. If the physical phone was disconnected, say that the candidate has not been checked there. If a provider exposes observation only, do not claim enforcement. If the public page is live, provide its direct link. These facts help the person act. A long list of generic risks can obscure the practical result just as much as an overconfident Done can hide unfinished work.

Completion is a chain of supported claims. The user scenario leads to source, source leads to checks, checks lead to an identified artifact, and distribution leads to an observed active result. GrantTap can retain that trail around the Task so decisions remain understandable across devices and sessions. The best report is short because the evidence is well organized, not because the uncertain parts were removed from the story.
`;
