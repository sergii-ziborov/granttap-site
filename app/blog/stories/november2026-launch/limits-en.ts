export const body = String.raw`
Subscription plans for coding agents come with usage windows. Claude's plans, for example, measure use over a five-hour window and over a week, and some models have a weekly limit of their own. When a window is full, the provider refuses the next request until it resets. For an agent working through a long task, that refusal is not an error in your code. It is a pause with a known end, and the only question is what happens when the end arrives.

GrantTap 1.0.1 and recent versions of the computer helper handle that pause in three ways. They show how much room is left before you hit a limit, show a chat that has hit one as waiting rather than finished, and continue that chat by itself when the window has room again, unless you turn that off. This guide explains each part, which versions provide it, and where its limits are.

## Where the readings come from

GrantTap does not estimate your provider allowance. It reads the numbers the provider reports to the signed-in account on your computer. The helper reads Claude, Codex, Cursor and Grok account usage through each provider's own interface, without starting a sign-in, refreshing credentials or changing provider settings. For Claude it also observes the rate limit information Claude Code reports after a response, through GrantTap's status line wrapper, which keeps any status line command you already had.

Readings are shared per computer and refreshed at most once every two minutes, so several chats on one machine do not multiply requests to the provider. Only usage percentages, window durations, reset times and the time of the reading travel to your phone, over the same encrypted channel as everything else. Account identity, credentials, credits and raw provider responses stay on the computer.

A missing reading stays missing. If the provider does not report a window, or the computer cannot read it, GrantTap shows that it does not know rather than showing a full allowance. Session tokens, context size and tool activity are measured separately and are never used as a stand-in for the subscription limit.

A few details make these numbers easier to trust. From MCP 0.8.165, the computer reports separately that a provider sign-in has expired, so the sheet names that and offers to sign in again instead of showing nothing. From MCP 0.8.168, the last known limits survive a failed read, a helper restart and a token waiting to be renewed. In the Usage section, a window that has not been refreshed for a long time is marked Update needed and does not turn into "100 percent available" on its own.

## The limit ring beside the model

In a chat, the composer shows the model button and, to its right, a small ring. The number in the ring is the percentage still available in the tightest current window. If the provider reports both a five-hour and a weekly window, the ring shows whichever has less left, because that is the one that will stop the agent first. The ring is green, turns yellow at 30 percent or less, and red at 10 percent or less.

Tap the ring to open the limits sheet. It lists each window with its reset time and shows the tokens this chat has used. If limits are missing, the sheet explains why. An exclamation mark in the ring means the limits could not be read at all; the most common reason is that Claude Code's own sign-in on that computer has expired, which the [provider sign-in chapter](/guide/provider-sign-in#expired) covers.

Version 1.0.1 changed how age is shown. A reading up to ten minutes old counts as current. An older one is no longer wiped: the ring keeps the last number, dimmed, and the sheet shows how old the reading is. This matters on a computer that went to sleep. You can still see that the weekly window was at 12 percent an hour ago, and you can judge for yourself whether that is likely to have changed.

## Limits that belong to one model

Some plans have a limit that applies only to one model, for example a weekly limit for a particular Claude model alongside the account's general weekly window. Before 1.0.1 such a limit was easy to misread, because it looked like the account's limit.

In 1.0.1 a model's own limit is shown under that model's name in the sheet. It counts in the composer ring only while the chat is running that model. If you switch the chat to a different model, the ring goes back to the account's windows, because the model-specific limit no longer applies to the next turn. The computer publishes Claude's per-model limit from MCP 0.8.172.

This gives a practical option when one model's weekly limit is used up: switch the chat to another model. Changing the model of an existing conversation asks for confirmation, because the next turn may reload the context and spend input tokens; the history, the Task and its permissions stay. Whether that is worth it depends on how much context the chat carries and how far away the reset is.

## A chat that is waiting on a limit

When a Claude Code chat's last request is refused by a subscription window, the computer publishes that fact with the chat: which window refused it and when it resets. The phone then shows the chat in its own color, so a chat that will go on by itself never looks like a finished report waiting to be read.

Open the chat and a bar above the activity rail shows an hourglass and a line such as "Limit reached. Resets at 14:05." Beside it is an Auto-continue switch, which is on by default. In Now and Tasks, the card's state reads "Resumes 14:05" while automatic continuation is on, or "Limit reached" when it is off. When the reset time has passed, the bar says "The limit has reset. Continuing…" until the chat starts again.

A related state uses a different color and a gear icon: a chat whose turn ended while its own background tasks are still running. The bar reads "Waiting on 2 background tasks. It continues by itself", and the card says In background. Both states exist for the same reason. A chat that has stopped talking to you is not necessarily done, and the list should say what it is waiting for.

There is one cut-off. A chat left at a limit that reset more than an hour ago is treated as abandoned rather than waiting. It shows as an ordinary idle chat, and the computer does not wake it.

## What the computer does at the reset

The automatic continuation does not depend on your phone being awake. When the helper sees a limited chat, it puts one message for that chat on the relay's durable queue, due one minute after the reset time the provider stated. The extra minute covers the small difference between the provider's clock and the computer's. The relay holds the message while the computer sleeps or the phone is out of reach, and offers it back like any queued phone message: the chat receives it when it is idle.

The agent then reads a short, fixed instruction: "GrantTap: the subscription limit that stopped this chat has reset. Continue the work from where you stopped." It picks up from its own conversation history. GrantTap does not rewrite the task or replay earlier messages; it only tells the agent that it may go on.

This continuation has been available since the helper versions published on November 12 and 13 (MCP 0.8.167 and 0.8.168). MCP 0.8.183, published on November 16, fixed a case that matters for weekly limits. A chat refused by a weekly limit that reset a day or more later could lose its queued continuation the first time it became busy for a moment, while the phone still showed it as continuing. The computer now also looks at chat history, and a queued continuation is withdrawn only when the chat is no longer held by that limit or you turned it off.

## Continuing early when there is room

The window often has room again before the time the refusal stated: the reading for that window can drop below full, or the window can roll over to a new one earlier than the refusal said. Since MCP 0.8.181, published on November 15, the computer checks for this.

While a continuation waits, the helper looks at the account's readings for the same window that refused the chat. If a reading taken after the continuation was queued, and no more than ten minutes old, shows that window below 98 percent used, or shows that the window has already rolled over to one that ends more than five minutes earlier, the computer queues one more continuation, due at once. The 98 percent threshold is deliberate: readings lag and round, so a window that is just under full is still treated as full.

The early attempt is made once per chat and reset time. If the provider refuses it again, nothing else happens early, and the continuation due at the reset stays queued. Some cases never go early: a refusal by a window that no reading covers, such as Claude's included overage, a signed-out account, and missing readings. In those cases the chat simply continues at the reset.

## An example night

Here is how the pieces fit together in an illustrative case, not a measured one. You start a long refactor in Claude Code at 22:00 and go to bed. At 23:40 the five-hour window is full. The provider refuses the next request and states a reset at 02:15. On your phone the chat changes to the limit color, and its card reads "Resumes 02:15". On the computer, a continuation is now queued on the relay, due at 02:16.

If a later reading shows that same window below 98 percent before then, for example because it rolled over earlier than stated, the computer sends one continuation at once. Otherwise the agent resumes at 02:16. Either way, in the morning the chat history shows GrantTap's one-line continuation message followed by the agent's further work, and the card is back in Working or Recently Finished.

The same rules apply to every limited chat separately. If three Claude chats on one account hit the same window, each gets its own continuation, and all three resume when the window resets. That can use up the new window quickly. If one of them matters more, turn off Auto-continue for the others and start them again yourself later.

## Turning it off for one chat

Automatic continuation is a reasonable default for a long refactor or a test fix that ran out of quota halfway through. It is the wrong default for other work. You may have reviewed the last result and decided to change direction. The task may touch a production system and you want to be present when it resumes. You may simply prefer to spend the next window on a different chat.

For those cases, switch off Auto-continue in the bar of that chat. The setting belongs to the chat on its computer, not to the whole account. The computer takes back the queued continuations from the relay, and if a copy is still offered later, it is refused at delivery. The same happens when the chat went on by itself first, for example because you sent it a message after the reset. Turning the switch back on while the limit still holds lets the computer queue a new continuation.

Sending your own message during the wait is not harmful. If the window is still full, the provider refuses it the same way it refused the agent, and since MCP 0.8.183 that refusal no longer cancels the continuation. If you want to line up instructions for later, the message queue is the better tool: Hold queue keeps queued messages on the phone until you resume it, without stopping the agent.

## A short routine when a limit hits

When a notification or a colored card tells you a chat has stopped at a limit, a few taps are enough to decide what should happen next.

First, open the chat and read the bar. It names the reset time, and its switch shows whether the chat will continue by itself. Second, tap the limit ring to see which window refused the request. A five-hour window that resets in forty minutes is a different situation from a weekly window that resets on Thursday, and a model's own weekly limit can often be avoided by switching the model.

Third, decide. For most long-running work, leaving Auto-continue on is the simplest choice: the agent resumes from its own history, and you review the result later. If the next step needs you, turn the switch off and come back to the chat when you are ready. If the work cannot wait, switch the model or transfer the Task.

Finally, check the card later in Now. "Resumes" means the continuation is still queued. "Limit reached" with the switch off means the chat will wait for you. A chat that has started again moves back to Working.

## What this does not cover

Automatic continuation currently applies to Claude Code chats, because that is where the computer can tell which window refused a request and when it resets. The limit ring can show the readings Codex, Cursor and Grok report as well, but a chat refused by those providers is not continued automatically. Continuation does not promise an exact minute either. The relay hands the message over when the chat is idle, and the computer has to be awake and connected to receive it; a laptop that sleeps until morning continues in the morning.

GrantTap does not raise or bypass any limit, move work to another provider on its own, or buy extra usage. If waiting is not acceptable, the choices are yours: switch the chat's model, or use [Transfer to](/guide/handoff) to continue the Task with another agent or on another computer, which keeps the Task and starts a separate execution. Neither the ring nor the continuation is a billing statement; for cost, use your provider's own reports.

## Checking your setup

Three versions decide what you see. The app needs version 1.0.1 for the waiting colors, the Auto-continue switch, per-model limits and reading ages. The computer needs MCP 0.8.181 or later for early continuation and 0.8.183 or later for the weekly-limit fix. Claude Code must be signed in on that computer, or there are no readings to act on.

Check the app build in About and the MCP version in Devices, which also offers Check for MCP update and Restart MCP. On the computer, granttap --version prints the installed version, and granttap status shows whether the helper and the Claude integration are ready. A normal update keeps your chats, history and pairings. The [chat chapter of the guide](/guide/chat#model-effort) and the [Usage chapter](/guide/usage-reports) describe the screens in more detail.
`;
