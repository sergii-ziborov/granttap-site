import { composeStory } from "./compose";

const sources = [
  { label: "GrantTap setup, supported providers, and local runtime", url: "https://github.com/sergii-ziborov/granttap-mcp" },
  { label: "GrantTap device pairing guide", url: "/blog/connect-iphone-with-qr" },
  { label: "GrantTap task continuity guide", url: "/blog/task-continuity-across-agents" },
  { label: "GrantTap Mesh and handoff", url: "/project-mesh" },
];

export const iphoneClaudeCodex = composeStory({
  slug: "control-claude-code-codex-iphone-granttap",
  date: "2026-10-05",
  cover: "/blog/control-claude-code-codex-iphone-granttap-cover.webp",
  inlineIllustration: "/blog/control-claude-code-codex-iphone-granttap-a.webp",
  additionalIllustration: "/blog/control-claude-code-codex-iphone-granttap-b.webp",
  screenshot: "/product/iphone-command-center.png",
  en: {
    title: "How to control Claude Code and Codex from iPhone with GrantTap",
    summary: "A practical path from local setup and device pairing to one Task view, approvals, and honest handoff across coding agents.",
    category: "GrantTap guide",
    screenshotCaption: "The real GrantTap Now interface on iPhone, captured with deterministic sample tasks and computers; names and status are illustrative.",
    illustrationCaption: "Generated concept of local Claude Code and Codex work reaching one trusted phone; it is not a product screenshot.",
    additionalIllustrationCaption: "Generated concept of a Task continuing across computers; it does not represent a copied provider session.",
    closing: "Start with one local computer and one test Task. Verify the route end to end, then add another provider or computer only when you can identify the next action and its actual outcome.",
    sources,
    body: `Claude Code and Codex can both work on a repository while you are away from your desk. Their own sessions, permission modes, and transcripts remain distinct. GrantTap adds a personal control center around supported local work: an iPhone view of Tasks, decisions that reach the computer, and a bounded way to continue. The useful starting question is not whether a phone can display a transcript. It is whether you can identify the computer, the Task, the requested action, and the evidence that the action finished.

GrantTap calls the user's durable objective a Task. One provider-native session doing that work is an Execution; a provider child agent stays inside its parent execution. This vocabulary matters when Claude Code finishes one attempt and Codex begins another. The objective can remain visible without pretending that private model state or hidden reasoning moved between tools. The current integration is deepest for local Claude Code and Codex. Cursor has narrower supported controls, and Grok Build is observable only where its local runtime exposes events. Read the [provider coverage guide](/blog/coding-agents-on-your-phone-2026) before assuming equal behavior.

## Prepare the local computer

Install a supported coding tool and the matching GrantTap plugin on the computer that owns the repository. The standalone granttap-mcp runtime supplies the local helper, MCP server, provider hooks, and adapters. Its documented setup command is 'npm install -g granttap-mcp' followed by 'granttap setup'; the setup flow detects supported local tools and installs or repairs the relevant hooks. It also reports when a separately distributed Engine is needed for Project Governance. A plugin card alone is not proof that its host hook is active.

Open the GrantTap connection card in the coding app after setup. The card can report saved pairing, readiness, and a one-time QR when another device must be linked. A newly installed plugin may need the coding app to reload before its hooks can be used. Check the local helper and provider status rather than guessing from a relay light. The desktop is the execution environment: it holds checkout files and provider credentials, and it is where supported actions must be enforced. The phone is a controller, not a second copy of the agent runtime.

## Pair the phone through the device flow

In GrantTap on iPhone, open Devices and Add a device to scan the computer's short-lived QR. Confirm that both sides name the intended computer. Never paste the QR into a prompt, support chat, or issue tracker. The pairing QR authorizes a trusted controller link; a Project Mesh invite instead adds a person or device to a collaboration scope. Conflating the two would make access difficult to reason about. The [pairing walkthrough](/blog/connect-iphone-with-qr) explains the distinction in detail.

After pairing, look for the computer in Connections and inspect its current readiness. A saved link means the devices have a relationship, not that Claude Code, Codex, a relay, every hook, and every approval path are currently healthy. Create a harmless test Task and ask the local agent to report a simple progress event. Confirm that the iPhone shows the right provider, computer, workspace, and delivery state. If one part is missing, check that part specifically. Do not infer a successful command from a task card that merely received a message.

## Put work in one Project Mesh

A Project is GrantTap's coordination scope. Its Mesh binds relevant repositories, people, computers, rules, and Tasks. That gives one place to understand work even when a provider changes. It does not merge provider projects, grant repository access automatically, or copy full transcripts into a shared space. The bounded Mesh events include progress, questions, dependency notices, and conflict claims. Resource identity includes the repository, so two identical relative filenames in different repositories are not silently treated as one file.

For a first run, choose a single repository and one clear Task: for example, fix a failing unit test in a disposable branch. Start locally in Claude Code or Codex and observe it on the phone. When another execution appears, confirm whether it belongs to the same Task or a new user request. A child agent should remain nested under its provider execution. This arrangement helps the Now view prioritize Needs You, active work, and recent outcomes instead of filling the screen with unrelated sessions.

## Make approvals meaningful

An approval on iPhone matters only when it reaches the computer before the sensitive tool executes. GrantTap's Project Governance lets a Project policy allow, ask, or deny capability kinds such as skills, MCP servers, shell, file writes, deploy, and network, with narrower named rules where supported. Global provider configuration can still deny an action, and that deny wins. Each computer reports the policy revision it applied and its enforcement coverage; an observed-only or unsupported path must stay visibly different from an enforced one.

The simpler personal approval modes also exist for supported task paths. Neither mode turns an unobserved provider-native route into a GrantTap-enforced route. In a test repository, request one harmless action that policy permits and another that policy denies. Inspect the host's response and the provider transcript. A phone card saying Allow records a decision; a completed tool result is separate evidence. The [approval-boundary analysis](/blog/agent-approvals-at-the-execution-boundary) explains how to test this distinction without touching real credentials.

## Continue without inventing a transfer

The Task can survive a new provider session or target computer. A supported handoff carries bounded Task and git facts, decisions, blockers, an explicit destination, and a receipt from the receiving side. It does not ship hidden reasoning, a provider's private session state, or uncommitted files as if they were portable. Before moving work, check repository identity, target checkout, branch, local changes, and the destination tool's actual availability. The same branch name on another machine does not guarantee the same tree.

If the target is unavailable, show that as a routing failure or pending state. If a provider lacks a deterministic hook for a particular action, do not advertise remote blocking there. A completed handoff receipt says the next execution accepted the route; it does not prove the task's code change passed tests. These details are why the [Task continuity guide](/blog/task-continuity-beyond-an-agent-session) treats transfer as an evidence chain. They also explain why one Project may need different policies on different computers even when its objective is shared.

## Inspect usage and the outcome

GrantTap derives usage from native provider transcripts and local operating-system samples. A listed capability may be available but not allowed; an allowed capability may never be invoked. A reported invocation can have unknown resource use if the process was not sampled, and a reported successful edit request does not prove a changed file. The app must preserve these differences. The [usage evidence guide](/blog/what-agent-usage-metrics-can-prove) gives a better reading of numbers than treating every visible row as a cost claim.

After the first end-to-end Task, verify the source tree and the test result on the computer. The phone helps you find what needs your attention and continue a bounded conversation, but the final technical evidence still belongs to the runtime and repository. If you use both Claude Code and Codex, repeat the test with each; if you add another computer, repeat the pairing and checkout check. That small routine exposes real integration gaps early and makes the control center more useful than a collection of attractive status cards.`,
  },
  ru: {
    title: "Как управлять Claude Code и Codex с iPhone через GrantTap",
    summary: "Практический путь от локальной установки и привязки iPhone до единой Task, решений и проверяемой передачи работы между агентами.",
    category: "Руководство GrantTap",
    screenshotCaption: "Настоящий экран Now приложения GrantTap на iPhone, снятый с детерминированными тестовыми задачами и компьютерами; названия и статусы служат примером.",
    illustrationCaption: "Сгенерированный образ локальной работы Claude Code и Codex с доверенным телефоном; это не скриншот продукта.",
    additionalIllustrationCaption: "Сгенерированный образ продолжения Task на другом компьютере; сессия провайдера при этом не копируется.",
    closing: "Начните с одного локального компьютера и одной тестовой Task. Проверьте весь маршрут, а затем добавляйте провайдера или компьютер, когда можете назвать следующее действие и его действительный итог.",
    sources,
    body: `Claude Code и Codex умеют работать с репозиторием, пока вы отошли от стола. Их сессии, режимы разрешений и транскрипты остаются разными. GrantTap добавляет персональный центр управления вокруг поддерживаемой локальной работы: вид Tasks на iPhone, решения, доходящие до компьютера, и ограниченное продолжение. Полезный вопрос не в том, можно ли показать на телефоне переписку. Нужно знать компьютер, Task, запрошенное действие и свидетельство того, что действие закончилось.

Устойчивую цель пользователя GrantTap называет Task. Одна native session провайдера, которая выполняет её, называется Execution; дочерний агент остаётся внутри своего исполнения. Это важно, когда Claude Code заканчивает попытку и Codex начинает следующую. Цель остаётся видимой без притворства, будто между инструментами перенесли приватное состояние модели или скрытые рассуждения. Сейчас наиболее полная локальная интеграция у Claude Code и Codex. У Cursor путь управления уже, а Grok Build наблюдается только там, где его локальный runtime сообщает события. Перед сравнением прочитайте [обзор покрытий](/blog/coding-agents-on-your-phone-2026).

## Подготовьте локальный компьютер

Установите поддерживаемый coding-инструмент и соответствующий GrantTap plugin на компьютере с репозиторием. Отдельный runtime granttap-mcp содержит локальный helper, MCP server, provider hooks и adapters. Документированный путь: 'npm install -g granttap-mcp', затем 'granttap setup'. Настройка обнаруживает поддерживаемые локальные инструменты и ставит либо исправляет нужные hooks. Она также сообщает, если для Project Governance нужен отдельно распространяемый Engine. Одна карточка plugin ещё не доказывает, что хук на компьютере действует.

После настройки откройте панель подключения GrantTap в coding app. Она показывает сохранённую привязку, готовность и одноразовый QR, когда требуется добавить устройство. Только что установленному plugin может понадобиться перезапуск coding app. Проверяйте helper и статус провайдера отдельно, не гадая по индикатору relay. Именно desktop остаётся средой исполнения: он хранит checkout и учётные данные провайдера и должен применять поддерживаемые правила. Телефон служит контроллером, а не второй копией agent runtime.

## Привяжите iPhone через отдельный маршрут устройств

На iPhone в GrantTap откройте Devices и Add a device, затем отсканируйте временный QR с компьютера. Подтвердите с обеих сторон, что указан нужный компьютер. Не вставляйте QR в prompt, переписку с поддержкой или issue tracker. Этот код добавляет доверенную управляющую связь; приглашение в Project Mesh открывает доступ к области совместной работы. Смешение двух действий делает права непрозрачными. [Инструкция по привязке](/blog/connect-iphone-with-qr) подробно объясняет разницу.

После сканирования найдите компьютер в Connections и проверьте текущую готовность. Сохранённая связь означает отношение между устройствами, а не одновременную исправность Claude Code, Codex, relay, каждого hook и каждого маршрута approval. Создайте безопасную тестовую Task и попросите локального агента отправить простой progress event. Убедитесь, что iPhone показывает верного провайдера, компьютер, workspace и статус доставки. Если части данных нет, проверяйте именно её. Карточка Task, получившая сообщение, ещё не доказывает успешную команду.

## Соберите работу в одном Project Mesh

Project в GrantTap — область координации. Его Mesh связывает нужные репозитории, людей, компьютеры, правила и Tasks. Это помогает понимать работу при смене провайдера. Mesh не объединяет нативные проекты разных инструментов, не выдаёт доступ к репозиторию автоматически и не складывает полные транскрипты в общее пространство. Ограниченные Mesh events включают progress, вопросы, зависимости и claims о пересечении работы. Identity ресурса учитывает репозиторий, поэтому одинаковые относительные имена файлов в разных проектах не превращаются в один файл.

Для первой проверки выберите один репозиторий и одну ясную Task: например, починить падающий unit test в экспериментальной ветке. Начните локально в Claude Code или Codex и проследите работу на телефоне. При появлении нового исполнения убедитесь, относится ли оно к той же Task или это другой запрос человека. Дочерний агент должен оставаться вложенным в execution провайдера. Так экран Now ставит Needs You, текущую работу и недавние итоги выше разрозненных сессий.

## Сделайте подтверждение осмысленным

Approval на iPhone имеет значение, только если доходит до компьютера до выполнения чувствительного инструмента. Project Governance в GrantTap позволяет задавать allow, ask или deny для типов возможностей: skills, MCP servers, shell, file writes, deploy и network. Где поддерживается, можно задать отдельное правило для конкретной возможности. Глобальная конфигурация провайдера также может запретить действие, и такой запрет сильнее правила Project. Каждый компьютер сообщает применённую ревизию policy и покрытие; observed-only и unsupported нельзя выдавать за enforced.

Для поддерживаемых маршрутов Task доступны и более простые персональные режимы подтверждения. Ни один режим не превращает ненаблюдаемый native путь провайдера в путь, принудительно контролируемый GrantTap. В тестовом репозитории запросите одно безвредное разрешённое и одно запрещённое действие. Сверьте ответ host и транскрипт провайдера. Карточка Allow на телефоне фиксирует решение; завершившийся вызов инструмента — отдельное свидетельство. [Разбор границ approval](/blog/agent-approvals-at-the-execution-boundary) объясняет такую проверку без доступа к настоящим секретам.

## Продолжайте без выдуманного переноса сессии

Task может пережить новую сессию провайдера или смену компьютера. Поддерживаемый handoff переносит ограниченные факты Task и git, решения, блокеры, адрес назначения и receipt принимающей стороны. Он не перевозит скрытые рассуждения, приватное состояние провайдера или незакоммиченные файлы как портативный пакет. Перед передачей проверьте identity репозитория, целевой checkout, ветку, локальные правки и фактическую доступность инструмента у получателя. Одинаковое имя ветки на двух машинах не гарантирует одинаковое дерево.

Если цель недоступна, интерфейс должен показать ошибку маршрута или ожидание. Если провайдер не даёт детерминированный hook для действия, нельзя обещать удалённую блокировку этого действия. Receipt о приёме handoff означает, что следующее execution приняло маршрут, но не доказывает прохождение тестов. Поэтому [руководство по сохранению Task](/blog/task-continuity-beyond-an-agent-session) рассматривает передачу как цепочку свидетельств. По той же причине общая цель Project не делает политики на разных компьютерах автоматически одинаковыми.

## Проверяйте usage и результат

GrantTap получает сведения об использовании из native transcripts провайдеров и локальных замеров операционной системы. Возможность может быть доступна, но не разрешена; разрешённый инструмент может ни разу не запускаться. Для вызова расход ресурсов может остаться неизвестным, если процесс не был измерен. Сообщение об удачном edit request само по себе не доказывает изменение файла. Приложение обязано сохранять эту разницу. [Руководство по usage](/blog/what-agent-usage-metrics-can-prove) помогает читать числа без превращения каждой видимой строки в денежное обещание.

После первой полной Task проверьте дерево исходников и результат теста на компьютере. Телефон помогает увидеть, где нужно ваше внимание, и продолжить ограниченный разговор, но итоговое техническое evidence находится в runtime и репозитории. Используете оба инструмента — повторите проверку для Claude Code и Codex отдельно. Добавляете второй компьютер — повторите привязку и проверку checkout. Такая привычка быстро выявляет настоящие пробелы интеграции и делает центр управления полезнее набора красивых статусных карточек.

Если результат на телефоне расходится с состоянием компьютера, запишите время, провайдера, идентификатор Task и последнее подтверждённое событие. Сначала проверьте, был ли доставлен запрос, затем получил ли его provider hook и только после этого ищите исход инструмента. Разница между задержкой доставки и ошибкой выполнения подскажет, где исправлять проблему. Не создавайте вторую Task только потому, что первая временно перестала обновляться: сначала выясните, существует ли её прежнее execution и не продолжает ли оно работу локально. Это сохраняет понятную историю решений и уменьшает риск параллельных правок одного файла.`,
  },
});
