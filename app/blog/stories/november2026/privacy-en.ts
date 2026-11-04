export const body = String.raw`
“Local agent” and “encrypted connection” are useful descriptions, but neither answers every privacy question. A command can run on your computer while its model context goes to a provider. An encrypted relay can protect a message in transit while an authorized device reads it normally. A browser controller can use encryption while still depending on the security of the website code and browser profile that hold its keys.

For a GrantTap workflow, the practical question is which component receives which information for a specific task. That includes the phone, computer, provider, tools, relay, and any exported record. This guide offers a way to map those boundaries and choose sensible controls. It is an engineering guide, not a legal opinion or a claim that one setting makes every coding workflow private under all circumstances. Product behavior and provider policies should be checked for the environment actually being used.

## Trace one piece of information

Begin with a concrete item, such as the source file an agent needs to inspect. Where is the file stored? Which process opens it? Does that process include its contents in a model request? Can a tool send it somewhere else? Does an answer containing part of the source synchronize to a controller? Following that one item is more informative than assigning a broad Local or Cloud label to the whole product.

Do the same for a human decision. An approval starts on the phone, travels as a message, and is applied at a supported boundary on the computer. Its operation details may already have come from that computer. The relay's role in carrying ciphertext differs from the endpoints' role in reading the request. Those distinctions explain why transport encryption and endpoint trust are complementary rather than interchangeable assurances.

Write the route in plain language. Name the source, intended recipients, and the reason each needs access. Mark unknown destinations rather than assuming they do not exist. A tool that performs an external search has a different data route from a local file reader. If the agent adds a new tool later, revisit the map for that operation. Privacy is easier to manage when the route follows actual task behavior instead of remaining a fixed marketing diagram.

## Separate command execution from model processing

A local CLI owns a process on your machine. It can read files and run commands according to its environment and permissions. That does not establish where the model runs. Many coding tools communicate with a provider service for inference. The useful privacy description therefore distinguishes local execution, model processing, external tool calls, and controller synchronization. Each can involve a different recipient and a different set of data.

This distinction also clarifies what GrantTap does not replace. A controller can carry decisions and observations for a local integration without becoming the model provider. Provider authentication, account terms, and data handling remain separate dependencies. A change in the controller's transport does not automatically change where a CLI sends model context. Likewise, a provider's cloud feature should not be described as local merely because the person starts it from a phone connected to a local computer.

When evaluating a task, identify the actual provider mode and configuration. Avoid relying on a product family name alone. An installed tool may support several execution modes with different boundaries. If the route cannot be established from available configuration and documentation, keep it unknown until checked. That is a better basis for a decision than a confident assumption that happens to match how another tool or another account worked previously.

## Understand what transport encryption establishes

GrantTap's [security page](/security) describes encrypted communication between authorized endpoints and a relay that routes ciphertext. This protects a particular transport boundary. It does not mean that endpoint devices cannot read the content; reading it is necessary for the phone to show a task and for the computer to apply an instruction. It also does not certify the behavior of every tool an agent might launch afterward.

Metadata remains a separate category. A service may need connection and routing information to deliver encrypted packets. Timing, size, and availability observations can carry operational meaning even when content is unreadable there. Read the product's current privacy explanation for the specific categories involved. Do not infer that encryption means an absence of all server-visible information or that it changes every retention rule associated with the surrounding account and network service.

The practical review asks what the relay receives, what it retains, and what only endpoints can interpret. Then review the endpoints independently. A secure route to a compromised device still ends at a compromised device. This is not a reason to dismiss encryption; it is a reason to describe its value precisely. Clear boundaries help you choose the next control, whether that is revoking a device, reducing tool access, or improving a local account's security.

## Pair only the controller you intend to trust

Device pairing establishes a relationship that deserves a deliberate human check. Confirm the computer and controller identities through the supported connection flow. A QR code or invitation is not ordinary documentation to paste into a public issue. Its purpose and lifetime matter. A pairing flow and a Project Mesh invitation also solve different problems: trusting a device connection does not automatically grant every participant access to every project.

If several phones or tablets are connected, treat each as a recipient with its own lifecycle. A device that is no longer yours should not remain trusted merely because it once worked. Review the relevant link and revoke it through the supported control when needed. Then verify the resulting state on the affected route. A renamed device is not necessarily a new identity, and a familiar name alone is not enough to establish that the current device is still the intended one.

Keep recovery practical. Store important project work through its normal backup and version-control paths rather than depending on a single controller as the only copy. Device revocation and provider sign-out are different actions, so use the one that matches the relationship you need to end. A well-understood inventory helps you remove obsolete access without unnecessarily disrupting the computer, provider account, and other controllers that still serve active work.

## A browser controller has a different trust boundary

The repository's browser-control explanation notes that browser keys live in browser storage and that code running in that origin can access them. That is a different isolation boundary from native protected storage. The relevant question is not whether the browser uses encryption at all. It is what code and profile state you trust on that device, and whether the browser is an appropriate endpoint for the tasks you plan to inspect.

Use a browser profile and computer you control. Consider the effect of extensions, shared sessions, and account access on that endpoint. A public or borrowed workstation may be unsuitable for a project even when the website connection itself is protected. Signing into an account and explicitly pairing a computer are also distinct steps. Neither should be assumed to authorize an unrelated browser or grant access to a project that has not been shared.

After using a browser controller, understand how to end the relationship and what local state remains under the product's supported controls. Closing a tab is not always equivalent to removing stored keys or revoking a connection. Avoid inventing a universal cleanup command for every browser. Inspect the actual endpoint and use the relevant sign-out, revocation, or local-data controls with their documented scope, then confirm that the intended access has ended.

## Treat tools as additional recipients

A coding agent can read local source, query a search service, inspect an issue tracker, or call another MCP server. Each capability can create another data path. A tool's friendly name does not tell you which endpoint it contacts, which account it uses, or what arguments it receives. Before enabling a capability for a sensitive task, inspect its actual role and grant only the scope needed for that work.

The permission to use a tool and the fact that it was used are different observations. A capability catalog can show what is configured, while activity evidence shows what happened in a particular execution. Neither should be mistaken for a complete security audit of the tool. For a concrete task, inspect the relevant call and result when available, and keep unsupported or unobserved coverage explicit rather than treating an empty list as proof that nothing occurred.

If a tool's access is no longer needed, remove or narrow the appropriate grant rather than merely hiding its card. The enforcement boundary determines whether the change affects future calls. Verify a harmless allowed or blocked operation within the supported path when assurance matters. This avoids a common mismatch: the interface looks cleaner, but the underlying process still retains the same authority because only presentation changed.

## Keep project relationships separate from access

A product can span an app, bridge, relay, website, and private operational repository. Linking those components helps people understand the system. It does not mean every collaborator should receive every file or every task history. GrantTap's Mesh material makes that distinction important: relationships describe coordination, while grants and roles describe access. A useful project map should preserve both facts rather than letting a visual connection silently broaden permission.

Summaries need the same care as source. A short note can reveal private code, deployment details, or a user's message. Reducing a transcript to a context packet does not make it public. Before sharing or handing off, check who can receive the derived material. If the receiver lacks the source's permissions, a reference with a visible access requirement can be more appropriate than copying the sensitive contents into a broadly readable note.

This becomes especially relevant when switching provider or computer. The destination may be trusted for some projects but not others. A successful transfer preparation should not be interpreted as permission to copy every adjacent repository or credential. Keep the packet scoped to the Task and its authorized evidence. If a missing grant blocks continuation, report it as a requirement rather than bypassing the boundary through a conversation attachment.

## Diagnostics can disclose more than the original task

Troubleshooting encourages people to gather everything: terminal output, process arguments, configuration files, screenshots, and network traces. Those materials can contain tokens, account identifiers, private paths, or source snippets unrelated to the issue. A support report should start with the symptom and the smallest evidence that identifies the failed boundary. More output is not automatically more useful, especially when the investigator cannot distinguish relevant transitions from background activity.

Prefer structured facts: the affected component, version, observation time, request stage, and exact non-secret error. Keep private request identifiers in a private channel when they are needed for correlation. Redact values rather than removing the entire meaning of the error. For example, it is useful to know that authentication failed at the provider, while the credential itself should not be copied into the report as an attempt to make the diagnosis easier.

Review screenshots as data exports. A picture of an approval may include a private command or a project path. A process table may include sensitive arguments. Product illustrations and deterministic demo captures are better choices for a public article or issue when the real account information is not essential. The goal is a report that someone can act on without receiving unrelated information or accidentally distributing a reusable secret through ordinary conversation history.

## Review retention and deletion by category

Different data deserves different handling. A derived index can often be rebuilt. A downloaded package can often be obtained again. A task decision may be valuable historical evidence. Pairing keys are credentials. Clearing a cache should not silently remove the only retained work record or revoke an unrelated provider account. A privacy review becomes more useful when it asks which category is stored where and what each cleanup operation actually changes.

Before deletion, identify whether the data is active, reconstructable, and covered by the intended operation. A local cache action and a server retention rule are separate controls. Deleting a phone's copy does not inherently delete another endpoint's copy. Revoking a device link does not rewrite every external service's existing records. Read the relevant product explanation and verify the scope, especially when a task has already exported files or sent information to a provider.

The practical objective is a workflow whose information routes you can explain. You know which devices are trusted, where the agent executes, which service processes model context, which tools add recipients, and how records are retained. That understanding supports useful choices without relying on one reassuring label. GrantTap can help keep tasks and decisions visible across devices; a clear privacy map helps you decide what belongs in that shared view and what should remain within a narrower boundary.
`;
