import { composeStory } from "../compose";
import { body as transferEn } from "./transfer-en";
import { body as transferRu } from "./transfer-ru";
import { body as queueEn } from "./queue-en";
import { body as queueRu } from "./queue-ru";

const handoffRuntime = { label: "GrantTap runtime: Project Mesh and task handoff", url: "https://github.com/sergii-ziborov/granttap-mcp#project-mesh-and-task-handoff" };
const handoffRuntimeRu = { label: "Runtime GrantTap: Project Mesh и передача Task", url: handoffRuntime.url };

export const taskTransferStory = composeStory({
  slug: "move-a-task-without-losing-work", date: "2026-10-16",
  cover: "/blog/move-a-task-without-losing-work-cover.webp",
  inlineIllustration: "/blog/move-a-task-without-losing-work-a.webp",
  additionalIllustration: "/blog/move-a-task-without-losing-work-b.webp",
  screenshot: "/product/iphone-chat.png",
  en: {
    title: "Move a Task to another agent without losing work",
    summary: "A Task can continue with another agent or on another computer. Uncommitted changes now raise a warning instead of blocking the move, a local checkpoint can keep them, and the destination confirms before the new chat opens.",
    category: "Continuity", body: transferEn,
    illustrationCaption: "Infographic of the uncommitted-changes choice: the transfer goes ahead with a warning and the changes stay on the source computer, or a checkpoint commits them to a local granttap/checkpoint/ branch without touching HEAD, the current branch or the working tree.",
    additionalIllustrationCaption: "A prepared transfer: choose the computer, agent, model and note; the destination prepares the capsule and a separate worktree, confirms the commit and resource claims, and only then opens the new chat. Your first message there starts the agent.",
    screenshotCaption: "GrantTap Task conversation with deterministic sample data. The transfer appears as Handoff requested and Handoff accepted events, and the header names the agent now working on the Task. The capture contains no user's private Task.",
    closing: "Move the Task, not the guesswork: name the commit, decide what happens to uncommitted changes, and let the destination confirm before the next agent starts.",
    sources: [handoffRuntime, { label: "Project Mesh guide", url: "/project-mesh" }, { label: "A task can outlive an agent session", url: "/blog/task-continuity-beyond-an-agent-session" }],
  },
  ru: {
    title: "Как передать Task другому агенту и не потерять работу",
    summary: "Task может продолжиться у другого агента или на другом компьютере. Незакоммиченные изменения теперь вызывают предупреждение, а не блокировку, локальный checkpoint может их сохранить, а компьютер назначения подтверждает передачу до открытия нового чата.",
    category: "Продолжение работы", body: transferRu,
    illustrationCaption: "Инфографика выбора при незакоммиченных изменениях: передача идёт дальше с предупреждением, а изменения остаются на исходном компьютере, или checkpoint коммитит их в локальную ветку granttap/checkpoint/, не трогая HEAD, текущую ветку и рабочее дерево.",
    additionalIllustrationCaption: "Подготовленная передача: выберите компьютер, агента, модель и заметку; компьютер назначения готовит capsule и отдельный worktree, проверяет commit и claims на ресурсы и только потом открывает новый чат. Ваше первое сообщение в нём запускает агента.",
    screenshotCaption: "Разговор Task в GrantTap на детерминированных тестовых данных. Передача видна как события Handoff requested и Handoff accepted, а в заголовке указан агент, который теперь работает над Task. Снимок не содержит приватной Task пользователя.",
    closing: "Передавайте Task, а не догадки: назовите commit, решите судьбу незакоммиченных изменений и дайте компьютеру назначения подтвердить готовность до старта следующего агента.",
    sources: [handoffRuntimeRu, { label: "Руководство по Project Mesh", url: "/project-mesh" }, { label: "Task живёт дольше сессии агента", url: "/blog/task-continuity-beyond-an-agent-session" }],
  },
});

// No existing capture shows a message's delivery marks, so this story has no product screenshot.
export const waitingMessagesStory = composeStory({
  slug: "messages-that-wait-for-the-computer", date: "2026-10-16",
  cover: "/blog/messages-that-wait-for-the-computer-cover.webp",
  inlineIllustration: "/blog/messages-that-wait-for-the-computer-a.webp",
  additionalIllustration: "/blog/messages-that-wait-for-the-computer-b.webp",
  en: {
    title: "Messages that wait for the computer",
    summary: "A queued request can wait on the encrypted relay until its computer reconnects, even with the phone closed. What each mark on your message means, what the relay can see, and where waiting stops.",
    category: "GrantTap guide", body: queueEn,
    illustrationCaption: "Infographic of the four delivery marks on your own messages: Queued, Sent, Delivered, and Not delivered with Retry. Delivered means the computer confirmed the message, not that the agent finished the work.",
    additionalIllustrationCaption: "What the relay can see compared with what only your devices can read, as listed on GrantTap's Security and Privacy pages. The relay routes ciphertext and metadata; message content stays on authorized endpoints.",
    closing: "A waiting request is only as useful as the facts around it: one route, a sealed message, a mark that says how far it got, and a reply in the same conversation.",
    sources: [
      { label: "GrantTap Help: sending, queueing and scheduled work", url: "/support" },
      { label: "GrantTap security: what the relay can see", url: "/security" },
      { label: "GrantTap privacy policy", url: "/privacy" },
      { label: "GrantTap ciphertext relay", url: "https://github.com/sergii-ziborov/granttap-relay" },
    ],
  },
  ru: {
    title: "Сообщения, которые дожидаются компьютера",
    summary: "Запрос из очереди может ждать на зашифрованном relay, пока компьютер не подключится, даже если телефон закрыт. Что означает каждая отметка на сообщении, что видит relay и где ожидание заканчивается.",
    category: "Руководство GrantTap", body: queueRu,
    illustrationCaption: "Инфографика четырёх отметок доставки на ваших сообщениях: Queued, Sent, Delivered и Not delivered с кнопкой Retry. Delivered означает, что компьютер подтвердил получение, а не что агент закончил работу.",
    additionalIllustrationCaption: "Что видит relay и что могут прочитать только ваши устройства — по страницам Security и Privacy GrantTap. Relay передаёт шифротекст и метаданные; содержимое сообщений остаётся на авторизованных устройствах.",
    closing: "Ожидающий запрос полезен настолько, насколько ясны факты вокруг него: один маршрут, запечатанное сообщение, отметка о том, как далеко оно продвинулось, и ответ в том же разговоре.",
    sources: [
      { label: "Справка GrantTap: отправка, очередь и отложенная работа", url: "/support" },
      { label: "Безопасность GrantTap: что видит relay", url: "/security" },
      { label: "Политика конфиденциальности GrantTap", url: "/privacy" },
      { label: "Relay шифротекста GrantTap", url: "https://github.com/sergii-ziborov/granttap-relay" },
    ],
  },
});
