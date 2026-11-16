export const body = String.raw`
Real projects rarely live in one folder on one machine. A web client and its API sit in separate repositories. A mobile app has a shared package next to it. One checkout is on the laptop you carry, another on a workstation that runs the long builds, and the agents doing the work may be Claude Code on one and Codex on the other. If the phone showed you that work as a flat list of chats, you would spend your time working out which chat belongs to which part of which project.

GrantTap's answer is the Mesh: one project, with its repositories, computers, people and rules, as a single place on the phone. This guide explains what a Mesh is, how it is formed, how repositories are bound on each computer, how to start and move Tasks inside it, and how GrantTap keeps short helper runs, such as image generation, under the chat that started them instead of turning each into a project of its own. Where a feature depends on a specific app or helper version, the version is named.

## What a Mesh is

GrantTap uses two kinds of Mesh, and it helps to keep them apart. Your Account Mesh is the personal network of your devices and computers, joined with a passkey. It answers "which machines are mine". A Project Mesh, usually just called a Mesh, is a scope of work: the repositories of one project, the computers that hold them, the people it is shared with, and the Governance rules for its agents. Most of this guide is about the second kind.

Inside a Mesh, work is organised as Tasks. A Task is one goal with its visible history. An Execution is one agent session doing part of that goal on one computer. A Task can start in Claude Code on the laptop and continue in Codex on the workstation; the Task keeps its identity while the executions change. Nested agents that a provider starts inside a chat appear as nested conversations of that chat, not as new root Tasks.

A Mesh also gives the agents in it a bounded shared context: which Task owns what, dependencies, claims on resources, questions and answers. A claim is a time-limited statement of intent, such as "this Task is about to change order.mjs", so another agent can notice an overlap before it becomes a merge conflict. It is not a file lock, and it does not prove the file has changed. Agents do not receive each other's full transcripts or hidden reasoning. Technical coordination stays between agents; product, security and destructive decisions, and conflicts they cannot resolve, come to you in Needs You.

A Mesh can also be shared with another person. On iPhone or iPad they join it from the Mesh list with Join a Mesh with invite, using an invitation from you, and their computers join separately in Devices. Sharing stays explicit: a device receives access to selected Meshes and a role, and a Mesh invitation does not change anyone's permissions at your Git provider. Two linked projects can show relationships between their repositories and still remain separate access scopes, with their own keys and members.

## How a Mesh forms

You do not create a Mesh by hand. A Mesh appears after an agent works in a repository on a connected computer. The computer reports the repository's identity, and the phone groups the work it sees by project.

Grouping follows a project's own and bound repositories, not every folder its Tasks happened to visit. A chat that ran one command in a neighbouring checkout does not drag that checkout into the project. GrantTap also does not decide that two folders are the same repository because they have the same name. A folder name does not prove Git identity, and a folder without Git is not treated as a verified repository just because it looks like one.

A Mesh can include several repositories, and one repository can have different checkouts on different computers. Each computer's own report decides which repositories it holds in a Mesh. If the workstation has both the API and the web client checked out, and the laptop has only the web client, the Mesh shows exactly that. You can see the bindings from the Mesh's Repositories section, and from there jump to the chats that worked in each repository.

## Finding your way in the Mesh list

After a few weeks, the Mesh list grows. GrantTap 1.0.1 for iPhone and iPad added tools to keep it manageable. The search field at the top searches Mesh names, repositories and computers. The filter menu next to it narrows the list by state and, when you have more than one computer, by computer.

A Mesh you are no longer working on can be archived. Swipe its row or open its context menu and choose Archive. The Archive is a section below the main list, closed by default, with the number of Meshes it holds. A Mesh nobody has used for 30 days moves there by itself and returns as soon as an agent works in it again. One you archive yourself stays there until you unarchive it, and its work also leaves the Now and Tasks lists. Search and filters still find archived Meshes, listed after the ones in use.

Rename is in the same menu. The name you choose is shown only on that device; the sheet tells you the name the computer reports, and Use reported name goes back to it. This is useful when several repositories report similar names, or when a Mesh named after a folder deserves a clearer label.

Delete from this phone is the strongest action, and its confirmation says exactly what it does. The Mesh's Tasks, Governance draft, members and key on this phone are removed, and its computers' reports of it are ignored. Nothing changes on any computer. The Mesh comes back only if an agent works in it again. Use it for a Mesh that should never have appeared, such as an experiment in a temporary folder, not as a way to tidy the list; for that, archive.

## Starting a Task from a Mesh or a folder

Version 1.0.1 combined two ways of starting work into one New Task form. At the top, under Where, a segmented control chooses Start from Mesh or Folder.

With Mesh, you pick the Mesh, then the computer, then the repository on that computer. Only the repositories that computer holds in that Mesh are offered, so the first message lands in the right checkout. Meshes for which no computer can start a Task right now are listed separately under "No computer can start these now", instead of failing after you press Create. The New Task button on a Mesh's own screen opens the same form with that Mesh already selected, and each repository row in the Mesh has a New Task action of its own.

With Folder, you pick a computer and one of the folders agents have already worked in there. This is for work that has no repository, or that does not belong to a project yet. Folders appear after an agent works in them on a connected computer; the form does not browse the whole disk.

Below that you choose the agent and model, then write the Task. A good first message states the goal, the part of the project it concerns, what may be changed, how to verify the result and what to report back. The form accepts up to 8,000 characters, and longer material is better attached as a file. Create Task shows Creating Task… until the computer confirms that the native session exists. If the screen closes before that, look for the Task in Now before trying again, because the first attempt may already have started the agent. The [New Task chapter](/guide/new-task) covers the form field by field.

## Moving work between computers

Sometimes the right place for a Task changes. The laptop is going into a bag, the build needs the workstation's GPU, or Codex is better suited to the next step than Claude Code. Transfer to moves the Task to another agent or computer while keeping its goal and identity.

Swipe a Task's card in Now or Tasks and choose Send, or open the transfer action from the Task's controls. Choose the destination computer and agent, and the model and effort that the destination computer reported. Add a Comment for the next agent: what has been done, what to check, what comes next. If the form offers several repositories, choose the real source checkout; the destination list has a search field that matches on name and path.

The transfer carries an encrypted Task Capsule with the goal, the known status, the committed revision and the visible context of the conversation. It does not copy the disk. Uncommitted changes stay on the source computer, and the form warns you about them. If you want them to travel, choose a checkpoint: the source computer writes them as a separate commit on a separate branch, using a temporary index, without switching your branch or touching your working tree. Files recognised as secrets by their names are left out. A checkpoint does not push anything. For another computer to use it, the revision has to be reachable there by your usual Git route.

When the destination is ready, its chat waits for your first message; preparing it does not start a new agent turn by itself. The source chat shows Open destination and Continue anyway. Continue anyway keeps working on the old branch in parallel after a separate confirmation, so both sides can change files independently. In most cases, open the destination. The [transfer chapter](/guide/handoff) describes each state, including Check again, which reads the existing transfer instead of starting a second one.

## Editing a Mesh's repositories

Sometimes the computer's view of a Mesh is not the one you want. A tooling repository keeps being grouped into the project, or a second checkout of the API should belong to it but no agent has worked there yet. Editing a Mesh's repositories from the client handles this.

In the Mesh's Repositories section, Edit repositories asks one of the Mesh's computers for its list. The list has three parts: the repositories in this Mesh, which can be removed after a confirmation; other repositories its chats have worked in, which can be added; and repositories another Mesh holds on that computer. A repository the list does not show can be added by the full path of its checkout. If more than one of the Mesh's computers is reachable, a picker chooses between them, and an offline computer is shown as offline.

The change is made by that computer, and its answer is final. If it refuses, the editor shows the computer's own words. If it does not answer within 20 seconds, the editor says "The computer did not answer." A removed repository stays out of the Mesh through later scans until it is added again, and the last repository of a Mesh cannot be removed.

Two requirements apply. The computer needs MCP 0.8.180 or later, published on November 15. On the client side, the repository editor and Rename Mesh in the More actions menu of the Mesh's own screen are part of GrantTap 1.0.1 for Mac (build 291), which was submitted to App Review on November 15 and is available by TestFlight invitation until Apple publishes it. App Store version 1.0.1 for iPhone and iPad (build 289) does not include the repository editor; on iPhone and iPad, Rename is available from the Mesh list as described above.

## Helper runs stay with the chat that started them

Image generation is a good example of work that is not a project. A chat asks for a picture. A script starts its own short headless agent session, often Grok, in a folder it creates for that one request, saves the image and deletes the folder. Before these changes, the computer saw a new session in a new folder and reported it like any other: as a new chat and, worse, as a new Mesh. A day of illustrations could leave a dozen Meshes behind, named after throwaway folders.

From MCP 0.8.174, such a run is shown under the chat that started it, as one of that chat's nested conversations, labelled Image generation. From 0.8.175, the pictures the run makes are kept and shown on its card, reduced on a Mac to a JPEG of at most 1,600 pixels on the long side, with up to twelve per run. GrantTap 1.0.1 for iPhone and iPad shows these runs and their pictures under their chat.

How does the computer know which chat started a run? Claude Code and Codex give every command a chat runs that chat's id, and the run inherits it. The helper looks at a process only if its working folder is one made for a run, and then reads only that id from its environment. Nothing else read from the process is logged or kept. A run whose parent cannot be identified is not published at all; the provider's own history still has it.

Two later helper versions finished the cleanup. MCP 0.8.181, published on November 15, recognises a run by what became of its folder, whatever the script called it: one request, no checkout of its own, and the folder gone again or made minutes earlier. MCP 0.8.184, published on November 16, leaves a Git-less Mesh for a folder inside a Git checkout out of the computer's Mesh list, whether the folder still exists or not; a chat working in such a folder belongs to the checkout's Mesh. If old entries left by a picture script still sit in your list, Delete from this phone removes them, and a current helper does not report them again.

## A small setup to try

A two-repository project is enough to see all of this. Put an API and a web client on two computers, with the web client checked out on both, run granttap setup on each, and link both to your Account Mesh with the same passkey. Ask an agent on each computer a harmless question in each repository, for example to explain its README. One Mesh should appear, showing which computer holds which repository.

Then start a Task from that Mesh on the computer that has both repositories, and transfer it to the other computer once it has committed a small change. Watch the warning about uncommitted work if there is any, and open the destination when it is ready. Finally, rename the Mesh on your phone, archive it, and bring it back. The [Mesh chapter of the guide](/guide/mesh-projects) and the [Mesh overview](/project-mesh) go further, into Governance, members and Graph.
`;
