import { composeStory } from "./compose";

const sources = [
  { label: "Microsoft: What's new in Agent 365, September 2026", url: "https://techcommunity.microsoft.com/blog/agent-365-blog/whats-new-in-agent-365---september-2026/4560803" },
  { label: "GrantTap runtime and Project Governance", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
  { label: "GrantTap capability status guide", url: "/blog/mcp-skills-and-governance-status" },
  { label: "GrantTap approvals at the execution boundary", url: "/blog/agent-approvals-at-the-execution-boundary" },
];

export const microsoftAgent365Tools = composeStory({
  slug: "microsoft-agent-365-mcp-tool-governance-september-2026",
  date: "2026-10-05",
  cover: "/blog/microsoft-agent-365-mcp-tool-governance-september-2026-cover.webp",
  inlineIllustration: "/blog/microsoft-agent-365-mcp-tool-governance-september-2026-a.webp",
  additionalIllustration: "/blog/microsoft-agent-365-mcp-tool-governance-september-2026-b.webp",
  screenshot: "/product/iphone-governance.png",
  en: {
    title: "Microsoft Agent 365 expands MCP tool governance: what local coding agents should learn",
    summary: "Microsoft's September 2026 controls separate tool inventory, administrator approval, and runtime policy. Here is the narrower, practical GrantTap connection.",
    category: "AI security news",
    screenshotCaption: "Real GrantTap Project Governance interface, captured with deterministic sample policy and coverage. It is not a Microsoft Agent 365 screen or proof of a live block.",
    illustrationCaption: "Original generated interpretation of an agent-tool review path; no Microsoft product screen is depicted.",
    additionalIllustrationCaption: "Original generated interpretation of a tool inventory; the objects are conceptual, not measured tenant assets.",
    closing: "The shared lesson is to name the tool, the policy owner, the enforcing runtime, and the observed call. The products apply that lesson at different scales and on different paths.",
    sources,
    body: `Microsoft's September 30, 2026 Agent 365 update is a useful sign of where agent governance is going. Its Tools management is described as generally available for MCP servers, plugins, skills, and connectors. The same announcement says developers can register custom MCP servers for administrator review in public preview, Agent Management Rules are in public preview, and an Azure API Management integration begins rolling out from September 30. These are Microsoft's stated release statuses, not independent verification that every tenant or agent route already has every control.

The interesting point for a developer running Claude Code or Codex on a personal computer is structural. A tool may be discoverable, approved, actually reachable, invoked, and successful at different times. Treating those states as one green check makes governance hard to trust. GrantTap has a much smaller, personal and local scope than Agent 365. It coordinates supported local coding tools through Project Mesh and host-reported capability coverage. It does not claim a Microsoft tenant inventory, Entra identity governance, or Azure API Management enforcement. We use Microsoft's news as an occasion to ask better questions of our own path.

## What Microsoft actually announced

The official Microsoft post describes a central Tools management view where administrators can discover connected tools, inspect metadata and usage, and apply tenant-wide allow or block decisions across several tool classes. It also distinguishes custom MCP registration from approval: a developer can submit a server, while an administrator can inspect its description, publisher, requestor, endpoint, and capabilities before accepting it. The approval path matters because an MCP server name alone does not reveal what network destination or account access the server will use.

Agent Management Rules are a separate public-preview feature for automating lifecycle actions such as blocking agents or rejecting publication requests when conditions match. Microsoft also says the Agent 365 connection to Azure API Management is rolling out, with discovered AI assets and runtime authentication, routing, and controls on traffic that passes through that service. A reasonable reading is that registry visibility, administrative decision, and runtime enforcement are related layers. It would be wrong to compress the announcement into a claim that all tools on all endpoints became universally blockable on September 30.

## Why MCP governance matters to coding work

An MCP server can put repository information, ticketing systems, cloud services, or deployment functions near an agent. A skill can provide instructions or scripts that change how that agent works. A connector may expose data without appearing as a shell command. The risk is not that any one category is inherently bad. The risk is that the person approving work cannot tell which exact capability was present, how it was configured, and whether a later action used it. Agent inventories and review queues answer part of that problem before execution.

For a local developer, identity is more precise than a marketing name. Two MCP configurations with the same display label can launch different binaries or carry different endpoints. A skill bundle can change on disk after approval. A robust review therefore needs a digest, version or exact configuration when available, plus the host and Project where it applies. The [GrantTap capability status guide](/blog/mcp-skills-and-governance-status) explains why discovered, requested, approved, initialized, and observed usage must remain separate. Those states are useful even to someone who never operates a corporate tenant.

## What GrantTap does on the local path

GrantTap's Project Governance lets a person set allow, ask, or deny for capability kinds such as skills, MCP servers, shell and scripts, file writes, deployment, and network actions. Named rules can narrow a kind to a specific capability. The Project policy is written on the phone, delivered encrypted, applied on each Project computer through the separately distributed GrantTap Engine, and acknowledged with the revision held by that computer. The app reports coverage as enforced, observed only, unsupported, or unknown. A global provider deny wins over a Project allow.

That is a host-and-Project control for supported local integrations. Claude Code and Codex are the primary paths. Cursor has narrower coverage, and Grok Build remains observable where its local runtime permits it. If a provider-native route bypasses a GrantTap hook, the app cannot truthfully show it as blocked by GrantTap. Likewise, a saved policy on the phone is intent until the target host reports application. The [approval-boundary article](/blog/agent-approvals-at-the-execution-boundary) describes how to test a harmless denial at the computer instead of trusting a card color.

## Inventory is not execution evidence

Microsoft's announcement talks about tool usage in its management experience. GrantTap has its own evidence boundary. A tool being configured on a computer is an availability signal. A policy allowing it is a decision. Initialization tells you that a particular host made it usable. A provider transcript or attributed hook event can report a call. Even a reported successful call is not automatically proof that the intended file changed or a deployment completed. The GrantTap runtime explicitly leaves unverified filesystem changes unknown instead of manufacturing them from edit-tool requests.

This distinction is important for SEO headlines too. Saying a control center “knows every tool an agent used” would exceed the current observation paths. A more honest claim is that GrantTap reports what its supported provider adapters and local host can actually observe, with gaps exposed. The real screenshot in this article is a deterministic GrantTap Project Governance capture. It shows the layout and status vocabulary; it does not demonstrate that a live Microsoft tenant rule or a production local denial fired. The two conceptual images likewise explain an idea rather than showing telemetry.

## A practical review for one Project

Choose a disposable repository and list the MCP servers, skills, and shell actions the agent may need. Record the exact host and provider, then choose a Project rule for one harmless capability. Confirm that the target computer acknowledges the new policy revision and reports enforcement coverage. Ask the agent to try both an allowed and a denied operation. Inspect the provider transcript and the host-side denial record, including the rule and capability fingerprint. If the denied action still happens, stop relying on that route for sensitive work until its coverage is understood.

Next repeat after a provider update or a configuration change. A newly configured MCP server may share a familiar label but have a different command or endpoint. Check that an old approval did not silently become authority for a different capability. If one computer is asleep, wait for its acknowledgment rather than assuming all Project machines applied the edit. The relay can retain an encrypted policy packet, but receipt and enforcement remain host facts. This is the difference between a policy distributed to machines and a policy actually in force.

## How to compare different governance systems fairly

Agent 365 is positioned for organization-wide agent inventory and Microsoft tenant controls. AgentCore policies govern calls passing through an AWS gateway. GrantTap coordinates supported local coding-agent work and reports host coverage in a personal Project. The common questions are who owns a rule, which identity it covers, where it is enforced, how updates reach each target, and what evidence exists afterward. The answers differ because the systems sit on different execution paths. A feature table that says simply “supports governance” loses the essential boundary.

The local lesson from Microsoft's release is still valuable: make tools first-class reviewable objects, keep publication separate from actual use, and connect administrative intent to runtime control. GrantTap applies this idea where a developer's coding work lives, while leaving unknown outcomes and unsupported paths visible. Readers who want to examine that local model can continue with [Project Mesh](/project-mesh), [capability status](/blog/mcp-skills-and-governance-status), and the [usage evidence guide](/blog/what-agent-usage-metrics-can-prove).`,
  },
  ru: {
    title: "Microsoft Agent 365 расширил управление MCP-инструментами: что важно для локальных coding-агентов",
    summary: "Сентябрьские нововведения Microsoft разделяют инвентарь инструментов, решение администратора и применение правила. Разбираем связь с локальным GrantTap.",
    category: "Новости AI Security",
    screenshotCaption: "Настоящий интерфейс Project Governance в GrantTap на детерминированных тестовых policy и coverage. Это не экран Agent 365 и не доказательство живой блокировки.",
    illustrationCaption: "Оригинальная сгенерированная интерпретация маршрута review инструмента; интерфейс Microsoft здесь не показан.",
    additionalIllustrationCaption: "Оригинальная сгенерированная интерпретация каталога инструментов; объекты условны и не обозначают измеренный tenant.",
    closing: "Общий вывод: называйте инструмент, владельца правила, исполняющий runtime и наблюдаемый вызов. Продукты применяют этот принцип в разном масштабе и на разных маршрутах.",
    sources,
    body: `Обновление Agent 365 от Microsoft, опубликованное 30 сентября 2026 года, показывает направление развития agent governance. По описанию компании, Tools management стало общедоступным для MCP servers, plugins, skills и connectors. Та же публикация относит регистрацию собственных MCP servers для проверки администратором и Agent Management Rules к public preview; интеграция с Azure API Management начинает развёртываться с 30 сентября. Это статусы, объявленные Microsoft, а не независимое подтверждение, что каждая функция уже работает в любом tenant и на любом маршруте агента.

Для разработчика, запускающего Claude Code или Codex на своём компьютере, полезна сама структура. Инструмент может быть обнаружен, одобрен, доступен на хосте, реально вызван и успешно завершён в разные моменты. Один зелёный значок для всех этих состояний делает governance ненадёжным. GrantTap имеет гораздо более узкий персональный и локальный охват, чем Agent 365. Он координирует поддерживаемые coding tools через Project Mesh и показывает coverage, сообщаемое компьютером. Мы не называем его инвентарём tenant Microsoft, управлением Entra identities или механизмом Azure API Management. Новость помогает точнее задать вопросы о собственном маршруте.

## Что именно объявила Microsoft

Официальная публикация описывает единый Tools management, где администратор видит подключённые инструменты, их метаданные и usage и может задавать allow либо block на уровне tenant для нескольких классов инструментов. Регистрация собственного MCP server отделена от его одобрения: разработчик отправляет запрос, а администратор проверяет описание, publisher, requestor, endpoint и capabilities. Это разделение существенно: одно имя MCP server не рассказывает, к какому сетевому адресу и аккаунту тот получит доступ.

Agent Management Rules — отдельная функция в public preview. Она автоматизирует действия жизненного цикла, например блокировку агента или отклонение заявки на публикацию при выполнении условий. Microsoft также пишет, что связь Agent 365 с Azure API Management постепенно разворачивается: появляются обнаружение AI assets и runtime controls для трафика, проходящего через этот сервис. Разумный вывод: видимость в registry, административное решение и применение правила во время выполнения — связанные, но отдельные уровни. Превращать объявление в обещание универсальной блокировки всех инструментов на всех endpoints с 30 сентября было бы неверно.

## Зачем это локальному coding-агенту

MCP server может дать агенту доступ к данным репозитория, задачам, облачным сервисам или функциям публикации. Skill иногда содержит инструкции или скрипты, меняющие поведение агента. Connector способен открыть данные, не выглядя shell-командой. Риск не в том, что одна категория сама по себе плоха. Риск в невозможности узнать, какая точная capability была доступна, как настроена и использовалась ли позднее. Каталог и очередь review отвечают на часть вопросов до исполнения.

Локальному разработчику нужна identity точнее рекламного имени. Две конфигурации MCP с одинаковой подписью могут запускать разные бинарники или обращаться к разным endpoints. Skill bundle может измениться на диске после одобрения. Поэтому review полезно привязать к digest, версии или точной конфигурации там, где это возможно, а также к host и Project. [Гид GrantTap по статусам capabilities](/blog/mcp-skills-and-governance-status) объясняет, почему обнаружение, запрос, одобрение, инициализация и наблюдаемое использование нельзя сливать. Эти различия помогают и человеку без корпоративного tenant.

## Что делает GrantTap на локальном маршруте

Project Governance в GrantTap задаёт allow, ask или deny для типов возможностей: skills, MCP servers, shell и scripts, file writes, deploy и network. Именованное правило может сузить тип до отдельной capability. Policy для Project создаётся на телефоне, доставляется в зашифрованном виде, применяется на компьютерах Project через отдельно распространяемый GrantTap Engine и подтверждается ревизией, которую держит каждый компьютер. Приложение показывает coverage как enforced, observed only, unsupported либо unknown. Глобальный deny провайдера побеждает allow Project.

Это контроль host и Project для поддерживаемых локальных интеграций. Основные пути — Claude Code и Codex. У Cursor покрытие уже, а Grok Build наблюдаем только там, где его локальный runtime раскрывает события. Если native маршрут провайдера обходит GrantTap hook, приложение не вправе показывать блокировку GrantTap. Сохранённая на телефоне policy остаётся намерением до ответа целевого компьютера. [Статья о границе approval](/blog/agent-approvals-at-the-execution-boundary) объясняет, как испытать безопасный запрет на хосте, а не доверять цвету карточки.

## Инвентарь не доказывает исполнение

Microsoft говорит об usage инструментов в своей панели. У GrantTap собственная граница evidence. Настроенный на компьютере инструмент означает доступность. Разрешение в policy — решение. Инициализация подтверждает готовность конкретного host. Транскрипт провайдера или атрибутированный hook event сообщает о вызове. Даже reported successful call не обязательно доказывает, что нужный файл изменён или deployment завершён. Runtime GrantTap явно оставляет неподтверждённые filesystem changes неизвестными, а не выдумывает их из edit-tool requests.

Это важно и для заголовков. Обещание, что центр управления «знает каждый использованный агентом инструмент», превышало бы текущий охват наблюдения. Честнее говорить, что GrantTap сообщает факты, которые действительно видят его provider adapters и локальный host, и показывает пробелы. Реальный скриншот в этой статье — детерминированный capture Project Governance. Он демонстрирует интерфейс и словарь статусов, но не свидетельствует о блокировке в живом tenant Microsoft или production локальной сессии. Две тематические иллюстрации также объясняют идею, а не изображают телеметрию.

## Проверка одного Project на практике

Возьмите тестовый репозиторий и перечислите MCP servers, skills и shell-действия, нужные агенту. Укажите конкретный host и provider, затем выберите правило Project для одной безвредной capability. Убедитесь, что целевой компьютер подтвердил новую ревизию policy и сообщил enforcement coverage. Попросите агента попробовать разрешённую и запрещённую операции. Посмотрите транскрипт провайдера и запись отказа на host с применённым правилом и fingerprint возможности. Если запретное действие всё-таки произошло, перестаньте полагаться на этот маршрут для чувствительной работы, пока не станет понятен его охват.

Повторите проверку после обновления провайдера или изменения конфигурации. Новый MCP server может иметь старое знакомое название, но иную команду или endpoint. Убедитесь, что прежнее одобрение не стало случайным разрешением другой capability. Если один компьютер спит, дождитесь его acknowledgment вместо предположения, что весь Project уже применил изменение. Relay может хранить зашифрованный policy packet, но получение и enforcement остаются фактами host. Именно здесь проходит граница между разосланной политикой и действующей политикой.

## Как честно сравнивать системы governance

Agent 365 рассчитан на инвентарь агентов организации и правила tenant Microsoft. AgentCore управляет вызовами, проходящими через AWS gateway. GrantTap координирует поддерживаемую локальную работу coding-агентов и показывает покрытие host в персональном Project. Общие вопросы: кто владеет правилом, какую identity оно покрывает, где применяется, как обновляется на каждой цели и какие есть свидетельства результата. Ответы различны, потому что системы стоят на разных маршрутах исполнения. Таблица с одной галочкой «есть governance» теряет эту главную границу.

Локальный урок из релиза Microsoft всё же полезен: сделать инструменты объектами review, отделить публикацию от использования и связать административное намерение с runtime control. GrantTap следует этой идее там, где выполняется работа разработчика, сохраняя видимыми неизвестный результат и неподдерживаемые пути. Подробнее локальную модель раскрывают [Project Mesh](/project-mesh), [статусы capabilities](/blog/mcp-skills-and-governance-status) и [разбор usage evidence](/blog/what-agent-usage-metrics-can-prove).`,
  },
});
