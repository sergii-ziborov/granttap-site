import { composeStory } from "./compose";

const sources = [
  { label: "Claude Code Remote Control and permissions", url: "https://code.claude.com/docs/en/remote-control" },
  { label: "OpenAI: Codex on mobile", url: "https://openai.com/index/work-with-codex-from-anywhere/" },
  { label: "Cursor agent run modes", url: "https://cursor.com/docs/agent/security/run-modes" },
  { label: "AWS AgentCore Policy", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
  { label: "GrantTap runtime", url: "https://github.com/sergii-ziborov/granttap-mcp" },
];

export const approvalBoundaries = composeStory({
  slug: "agent-approvals-at-the-execution-boundary",
  date: "2026-11-14",
  cover: "/blog/approval-boundary.webp",
  inlineIllustration: "/blog/agent-approvals-at-the-execution-boundary-a.webp",
  additionalIllustration: "/blog/agent-approvals-at-the-execution-boundary-b.webp",
  screenshot: "/product/iphone-governance.png",
  en: {
    title: "An agent approval is only as strong as its execution boundary",
    summary: "How to tell a displayed decision from an enforced one across local, cloud, and hybrid coding agents.",
    category: "Governance",
    screenshotCaption: "GrantTap governance view with deterministic sample status. A sample card does not prove a live tool call was allowed or blocked.",
    illustrationCaption: "AI-generated depiction of a decision crossing a computer boundary, not an implementation diagram.",
    additionalIllustrationCaption: "AI-generated view of policy layers and evidence; no real provider interface is represented.",
    closing: "For every sensitive action, locate the enforcing process, the applicable rule, and the evidence of the resulting tool outcome.",
    sources,
    graphic: { title: "Approval chain", caption: "Each stage needs its own evidence.", rows: [
      { label: "Proposed", detail: "Which exact action and target?" },
      { label: "Decided", detail: "Who allowed or denied it?" },
      { label: "Enforced", detail: "Which runtime applied the decision?" },
      { label: "Observed", detail: "What actually happened afterward?" },
    ] },
    body: `“Approve on your phone” sounds precise until you ask what is being approved. A coding agent might request a shell command, a file edit, a network connection, a secret-bearing tool call, or a deployment. The phone can display the request, but it rarely performs the action. The meaningful security boundary is the runtime that holds the repository and credentials. Its decision must happen before the side effect, and the record should distinguish a proposal, a human response, policy enforcement, and the final result. These are separate events even if a product presents them on one card.

The official documents linked below describe different environments. Claude Code Remote Control connects a mobile or web client to a local Claude Code session with its own permission modes. OpenAI describes mobile Codex approvals for connected work. Cursor documents run modes that affect interruptions for tool calls, while its cloud agents may run commands automatically inside dedicated machines. AWS AgentCore Policy is a different class of managed gateway control: it evaluates tool access through a gateway, not the local shell of every coding assistant. We checked these descriptions on October 3, 2026. A fair comparison begins by naming the tool path that each policy actually covers.

## Follow the action to its runtime

Imagine an agent wants to read a production credential. A push alert might show the proposed command and an Allow button. That visible prompt is useful only if the local process or cloud worker pauses and requires the decision before access. If the UI updates while the host is offline, the user may have recorded an intention rather than authorization that reached the tool. If the agent executes through another route, the policy may not apply at all. The safest evaluation uses a harmless stand-in credential and watches both sides of the boundary in a dedicated test environment.

In GrantTap's model, the phone is a controller for supported local executions. The computer applies global capability denies and task policy, with a global deny winning. This is a product rule about that integrated runtime, not a claim that GrantTap controls all possible provider tools everywhere. A capability can be available without being enabled, enabled without being used, and requested without a confirmed run. Keeping those states separate prevents a settings screen from becoming false evidence. For every provider adapter, inspect which actions actually route through the enforcing hook and which remain provider-native.

## Permission modes are not interchangeable

Claude Code's Remote Control documentation describes a permission mode for sessions the server starts and says interactive sessions can be controlled remotely. Its native permission handling remains part of the Claude process on the computer. Codex's mobile preview brings approval requests into a mobile surface, but exact sandbox and approval settings belong to the connected Codex execution. Cursor's run modes govern when its agent interrupts the user for approval. Its documentation also says cloud agents run in their own dedicated machines and do not ask for an action-by-action approval in the same way. These differences do not form a simple “more secure” ranking.

Instead, choose a desired operating rule. For a personal scratch repository, broad auto-run within a restricted sandbox may be appropriate. For a repository with deploy credentials, explicit review of network and filesystem effects may matter more. For a mixed setup, decide which agent can reach which files and tools before comparing phone screens. A mobile button cannot strengthen a runtime that has already been given unrestricted credentials. Conversely, a well-configured native permission system can be sufficient without adding another control layer. Verify the policy configuration where execution happens and record its scope.

## Managed gateways cover a different path

AWS AgentCore Policy illustrates a useful principle: enforce a rule outside the agent's prompt at a boundary it must cross. Its documentation describes policy engines attached to gateways, with enforcement of agent requests that pass through those gateways. That can provide deterministic decisions and logs for gateway-mediated tool calls. It does not imply that a command run directly by a local coding agent on a laptop is intercepted by AWS. A product comparison that treats “governance” as one undifferentiated checkbox hides this scope distinction and may invite unsafe assumptions.

The same principle applies to any local controller. A rule has value when the actual action must cross its enforcement point. Draw the route from proposed action to tool, write down which component can deny it, and test a denied case. Include alternate paths such as provider-native tools, MCP servers, shell access, and cloud workers. If one path bypasses a controller, say so explicitly rather than presenting a global guarantee. This scope map makes it possible to use multiple controls together without claiming that one interface is the universal authority over every tool.

## Record four different outcomes

A request can be displayed but never delivered to a phone. It can be delivered and approved but fail to reach an offline computer. The computer can receive it and deny the action under a stronger rule. The tool can run but fail for an unrelated reason. These paths have different meanings. A useful event trail records a proposed action, a decision, a host-side enforcement result, and a tool outcome with timestamps and identity. The UI should avoid collapsing them into one success badge. “Unknown” is a legitimate answer when an integration did not report the outcome.

The GrantTap screenshot in this article is a deterministic demo capture. It shows how governance status is presented, not proof of a production enforcement result. In a real evaluation, use one dedicated test Task and two benign tool requests: one permitted, one denied. Watch the host log and provider transcript, then disconnect the phone and repeat. Check whether a queued decision expires, whether policy remains effective while offline, and whether the final state is reported accurately. The test should be safe enough to repeat whenever an adapter or provider version changes.

## Put the human at the right point

Requiring approval for every trivial read can overload a person; allowing every action can make the word “approval” meaningless. Group actions by consequence: read-only inspection, local reversible edits, network access, credential use, and irreversible publication. Configure the runtime's default limits first. Then use a phone to decide exceptional requests with enough detail to understand their target and scope. If the phone cannot show that detail, defer the action until you can inspect it at the computer. This is a workflow judgment, not a claim that one provider has discovered a perfect universal policy.

Finally, check what happens after the decision. An approved deployment still needs a successful command, a reachable destination, and verification of the deployed state. A denied operation should leave the protected resource untouched. A governance system earns trust by representing these outcomes honestly and by exposing where its authority ends. The user's strongest question remains simple: which process stopped or allowed this exact action, under which rule, and what evidence shows the outcome?`,
  },
  ru: {
    title: "Надёжность approval агента определяется границей исполнения",
    summary: "Как отличить решение на экране от реально применённого правила в локальных, облачных и гибридных coding-агентах.",
    category: "Управление",
    screenshotCaption: "Экран governance в GrantTap с детерминированным тестовым состоянием. Карточка сама по себе не доказывает разрешение или блокировку живого вызова инструмента.",
    illustrationCaption: "Сгенерированное изображение решения на границе компьютера, не схема реализации.",
    additionalIllustrationCaption: "Сгенерированная иллюстрация слоёв политики и evidence; она не изображает интерфейс провайдера.",
    closing: "Для каждого чувствительного действия определяйте исполняющий процесс, действующее правило и свидетельство результата инструмента.",
    sources,
    graphic: { title: "Цепочка approval", caption: "Каждый этап требует собственного evidence.", rows: [
      { label: "Запрос", detail: "Какое именно действие и цель?" },
      { label: "Решение", detail: "Кто разрешил или запретил?" },
      { label: "Применение", detail: "Какой runtime исполнил правило?" },
      { label: "Итог", detail: "Что действительно произошло?" },
    ] },
    body: `Фраза «подтвердить на телефоне» кажется точной, пока не спросишь, что именно подтверждается. Coding-агент может предложить shell-команду, изменение файла, сетевое соединение, вызов инструмента с доступом к секретам или публикацию. Телефон показывает запрос, но обычно не исполняет действие. Значимая граница безопасности — runtime с репозиторием и учётными данными. Его решение должно предшествовать побочному эффекту, а журналу полезно различать предложение, ответ человека, применение политики и итоговый результат. Это разные события, даже если продукт помещает их на одну карточку.

Официальные документы ниже описывают разные среды. Claude Code Remote Control связывает мобильный или веб-клиент с локальной сессией Claude Code и её режимами разрешений. OpenAI описывает мобильные approval для подключённой работы Codex. Cursor документирует run modes, определяющие прерывания перед инструментами, а его cloud agents могут выполнять команды автоматически в выделенных машинах. AWS AgentCore Policy относится к другому классу: управляет доступом к инструментам через gateway, а не к локальному shell любого помощника. Мы сверили эти сведения 3 октября 2026 года. Честное сравнение начинается с указания маршрута инструмента, покрытого каждой политикой.

## Проследите действие до runtime

Представим, что агент хочет прочитать production credential. Push-уведомление может показать команду и кнопку Allow. Видимый запрос полезен лишь тогда, когда локальный процесс или облачный работник остановился и требует решения до доступа. Если интерфейс обновился, пока хост был offline, пользователь мог зафиксировать намерение, которое до инструмента не дошло. Если агент выполнил действие другим маршрутом, политика может не сработать вообще. Для безопасной проверки используйте безвредный заменитель секрета в выделенной тестовой среде и наблюдайте обе стороны границы.

В модели GrantTap телефон управляет поддерживаемыми локальными executions. Компьютер применяет глобальные запреты возможностей и правила Task, причём глобальный deny побеждает. Это правило интегрированного runtime, а не утверждение, что GrantTap управляет всеми инструментами любого провайдера повсюду. Возможность может быть доступной без разрешения, разрешённой без использования и запрошенной без подтверждённого запуска. Разделение этих состояний не позволяет экрану настроек выдавать ложное evidence. Для каждого адаптера проверьте, какие действия действительно проходят через enforcing hook, а какие остаются нативными для провайдера.

## Режимы разрешений нельзя приравнивать

Документация Claude Code Remote Control описывает permission mode для сессий, создаваемых сервером, и возможность управлять интерактивной сессией удалённо. Нативные разрешения остаются частью процесса Claude на компьютере. Мобильная предварительная версия Codex переносит запросы approval на телефон, но точные настройки sandbox и разрешений принадлежат подключённому исполнению Codex. Run modes Cursor задают, когда агент прерывает работу ради человека. Документация также говорит, что cloud agents работают на выделенных машинах и не спрашивают отдельное подтверждение на каждое действие в том же смысле. Простого рейтинга «безопаснее» из этого не получается.

Сначала выберите желаемое рабочее правило. Для личного чернового репозитория широкий auto-run внутри ограниченного sandbox может быть уместным. Для проекта с ключами развёртывания важнее явный просмотр сетевых и файловых эффектов. В смешанной среде до сравнения экранов решите, какому агенту доступны какие файлы и инструменты. Мобильная кнопка не усилит runtime, которому уже выданы неограниченные credentials. И наоборот, хорошо настроенной нативной системы разрешений может хватить без дополнительного слоя. Проверяйте конфигурацию политики там, где действие выполняется, и фиксируйте её область.

## Управляемый gateway покрывает иной маршрут

AWS AgentCore Policy показывает полезный принцип: применять правило вне prompt агента на границе, которую инструмент обязан пересечь. Документация описывает policy engines, привязанные к gateways, и проверку запросов агента, проходящих через такие gateways. Это может дать детерминированные решения и журналы для соответствующих вызовов. Из этого не следует, что AWS перехватывает команду локального coding-агента на ноутбуке. Сравнение, где «governance» превращается в одну безымянную галочку, скрывает область действия и создаёт опасные ожидания.

Тот же принцип относится к любому локальному контроллеру. Правило ценно, когда фактическое действие обязано пройти через его точку применения. Нарисуйте маршрут от предложения агента до инструмента, укажите компонент, способный отказать, и испытайте запрет. Учтите альтернативные пути: нативные инструменты провайдера, MCP servers, доступ к shell и облачных работников. Если какой-то путь обходит контроллер, назовите это явно вместо объявления глобальной гарантии. Такая карта позволяет совмещать несколько защитных механизмов, не назначая один интерфейс универсальной властью над каждым инструментом.

## Записывайте четыре разных итога

Запрос может появиться, но не дойти до телефона. Он может быть доставлен и одобрен, но не попасть на отключённый компьютер. Компьютер может получить его и отклонить по более сильному правилу. Инструмент может запуститься и завершиться ошибкой по другой причине. Значение у этих путей различно. Полезная история событий фиксирует предложенное действие, решение, применение правила на хосте и результат инструмента со временем и идентичностью. Интерфейсу не следует сворачивать их в один значок успеха. Если интеграция не сообщила результат, ответ «неизвестно» вполне корректен.

Скриншот GrantTap в статье сделан на детерминированных демоданных. Он показывает представление governance status, а не доказательство production enforcement. Для настоящей проверки создайте одну выделенную тестовую Task и два безвредных запроса к инструменту: разрешённый и запрещённый. Смотрите лог хоста и транскрипт провайдера, затем отключите телефон и повторите. Выясните, истекает ли отложенное решение, продолжает ли действовать политика offline и точно ли передано итоговое состояние. Тест должен быть настолько безопасным, чтобы его можно было повторять после обновлений адаптера или провайдера.

## Ставьте человека в правильную точку

Если спрашивать approval на каждое тривиальное чтение, человек быстро устанет; если разрешать всё, само слово «подтверждение» потеряет смысл. Разделите действия по последствиям: только чтение, обратимые локальные правки, сеть, работа с credentials, необратимая публикация. Сначала настройте базовые пределы runtime. Затем с телефона решайте исключения, получив детали цели и области действия. Если этих деталей нет, отложите действие до проверки за компьютером. Это практическое суждение, а не заявление, будто один провайдер нашёл универсальную идеальную политику.

Наконец, посмотрите, что произошло после решения. Одобренное развёртывание всё ещё требует успешной команды, доступного назначения и проверки опубликованного состояния. Запрещённая операция не должна менять защищённый ресурс. Governance заслуживает доверия, когда честно представляет результаты и показывает предел собственной власти. Самый сильный вопрос пользователя прост: какой процесс остановил или разрешил это точное действие, по какому правилу и какое evidence подтверждает итог?

Полезно повторить испытание после обновления провайдера или интеграции. Даже когда экран не меняется, обновлённый runtime может иначе классифицировать инструменты или пересылать запросы. Зафиксируйте версию компонента, точную тестовую команду и ожидаемый отказ. Если отказ перестал применяться, проблема находится в границе исполнения и её нужно исправить до чувствительной работы. Если отказ применяется, но телефон показывает одобрение, проблема в представлении состояния. Эти два дефекта требуют разных исправлений. Видимый журнал событий должен помогать отличить их, не заставляя пользователя угадывать по цвету карточки.

При этом не переносите правила автоматически между устройствами с разными владельцами и доступом. Один и тот же запрос может быть безопасным в изолированном тестовом checkout и недопустимым на компьютере с production credentials. Контекст авторизации включает машину, репозиторий, конкретный инструмент и время действия разрешения. Без этих полей широкое «разрешить» слишком неоднозначно, чтобы считать его устойчивым решением.`,
  },
});
