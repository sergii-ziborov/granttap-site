import { composeStory } from "./compose";

const sources = [
  { label: "AWS: Securing AI agents with temporal policies in AgentCore, August 6, 2026", url: "https://aws.amazon.com/blogs/machine-learning/securing-ai-agents-with-temporal-policies-in-amazon-bedrock-agentcore/" },
  { label: "AWS AgentCore Policy documentation", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
  { label: "GrantTap Project Governance and local enforcement", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
  { label: "GrantTap approval boundary analysis", url: "/blog/agent-approvals-at-the-execution-boundary" },
];

export const awsTemporalPolicy = composeStory({
  slug: "aws-agentcore-temporal-policy-agent-security-2026",
  date: "2026-10-05",
  cover: "/blog/aws-agentcore-temporal-policy-agent-security-2026-cover.webp",
  inlineIllustration: "/blog/aws-agentcore-temporal-policy-agent-security-2026-a.webp",
  additionalIllustration: "/blog/aws-agentcore-temporal-policy-agent-security-2026-b.webp",
  screenshot: "/product/iphone-governance.png",
  en: {
    title: "AWS AgentCore temporal policies make agent history part of authorization",
    summary: "AWS now describes stateful gateway checks for tool sequences, cumulative exposure, and human approval. We map the lesson to GrantTap's local boundary without claiming feature parity.",
    category: "AI security news",
    screenshotCaption: "Real GrantTap Project Governance screen with deterministic sample data. It shows local Project policy, not AWS temporal policy or a production trajectory.",
    illustrationCaption: "Original generated concept of a tool sequence pausing at an authorization gate; not an AWS architecture diagram.",
    additionalIllustrationCaption: "Original generated concept of past actions informing a gate; it does not show GrantTap trajectory-aware enforcement.",
    closing: "For any agent, ask which exact actions pass through the enforcing boundary and which previous events that boundary can actually remember.",
    sources,
    body: `An agent may make a series of individually reasonable tool calls whose combined effect is unsafe. A read from an untrusted source can be followed by an unexpected network transfer. Several small operations can exceed a budget that no single operation breaches. On August 6, 2026, AWS published a detailed explanation of temporal policies for Amazon Bedrock AgentCore. The important change is that a request routed through AgentCore Gateway can be judged against earlier events in the same trajectory rather than against its arguments alone.

This is news about an AWS gateway, not a new feature announcement for GrantTap. GrantTap's current Project Governance applies allow, ask, and deny rules for supported local coding-agent capabilities, with coverage reported by each computer. It does not advertise AWS-style trajectory state, cumulative trading limits, or a universal gateway for every provider-native action. The AWS design still provides a sharp question for any local controller: does the decision point know enough history to justify this exact action, and can the agent bypass that point? The answer depends on the route, not on the word “policy” in a menu.

## What AWS published

AWS describes temporal policies as stateful authorization for requests reaching AgentCore Gateway targets. The current request is evaluated with prior events in a bounded agent trajectory. The article gives examples for ordering calls, checking that a later input matches an earlier tool output, requiring fresh data, limiting cumulative exposure, consuming one approval for one privileged action, and reducing write access after a period without human engagement. These examples appear in a hypothetical banking workflow; they should not be mistaken for measured outcomes from a real financial deployment.

The post also describes the enforcement point precisely. Policy runs at the AgentCore Gateway perimeter, outside the agent's own code, for traffic routed through that gateway. It returns allow or deny and logs decision context. A session is associated with a principal and session identifier, and the article describes a bounded look-back period. These details matter because starting a fresh session or taking a route outside the gateway changes what the policy can observe. The official [AgentCore documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html) is the source for configuration and current service limits.

## Why a single tool check may be insufficient

Imagine a coding agent allowed to read an internal document and allowed to call an external HTTP client. A simple allow rule on each tool does not answer whether sending text from that document to the destination is appropriate. A history-aware policy could deny a protected sequence if both actions cross the same enforcing boundary and the relevant data lineage is represented. That conditional is crucial. A gateway cannot evaluate an invisible local shell command by wishing it had happened through the gateway.

Another example is repeated deployment. A human may approve one release operation, while an agent loops and attempts three. A one-time approval model needs to tie the approval to one action identity or consume it after use; otherwise a broad “approved” state may cover more than intended. AWS's article uses a high-value trade example to demonstrate that pattern. For coding work, the corresponding review question is whether an approval covers this exact command, repository, branch, destination, and time window. The [GrantTap approval guide](/blog/agent-approvals-at-the-execution-boundary) starts with that execution boundary.

## What GrantTap governs today

GrantTap applies Project Governance to supported local integrations. A Project rule may allow, ask, or deny capability kinds including skills, MCP servers, shell and scripts, writes, deployment, and network activity; a named rule can target one capability. The phone authors a revision, the encrypted route delivers it to Project computers, and each computer reports the revision and whether a kind is enforced, observed only, unsupported, or unknown. A global provider deny remains stronger than a Project allow. The local hook evaluates a covered action before it runs.

This model addresses a different unit of control from AWS temporal policy. It helps the user decide and inspect what happens on their own coding computers, especially for primary Claude Code and Codex paths. It does not claim to reconstruct a complete multi-call causal history or authorize a later action by matching an earlier output. A provider-native route outside the hook remains outside GrantTap enforcement. A selected policy without a host acknowledgment remains an intended policy, not an applied one. Those explicit limits are valuable because users can test them rather than infer a guarantee from a phone screenshot.

## Build an evidence chain before adding complexity

A useful history-aware rule first needs trustworthy events. Which process made the call? Which tool identity and version did it use? Did the tool run, fail, or only receive an approval? Did a file actually change? GrantTap's runtime distinguishes Invocation history from verified filesystem effects; it currently leaves unverified file changes unknown. That is the right foundation for later reasoning, even when it means the interface says less. A policy engine that consumes ambiguous event data may be more elaborate without being more reliable.

For one local Project, draw a timeline with four columns: proposed action, applicable rule, host decision, and observed outcome. Try a safe denied shell action and inspect the local refusal. Then run an allowed action and verify its actual result in the repository. Add the provider version and policy revision to the test record. If a later agent action depends on the first one, identify where that dependency can be checked today and where it cannot. This exercise is more informative than describing the whole product as “stateful governance.”

## Consider the new failure modes

Stateful authorization introduces session boundaries. If an agent resumes under a new identifier, does it inherit past approvals or start with empty history? If policies change mid-task, what happens to active sessions? If a tool response arrives late, is it appended before the next request? AWS explicitly discusses session identity, look-back limits, and invalidation on policy changes. Developers adopting any trajectory model must document those rules, test concurrent requests, and avoid making old approvals silently durable.

Local coding work adds computer and checkout boundaries. A Task can continue on another machine in GrantTap, but a new execution may have different tools, policy coverage, credentials, and repository revision. A history from one host cannot simply be assumed to authorize a privileged action on another. The [Task handoff guide](/blog/task-continuity-beyond-an-agent-session) describes the bounded facts that travel today. If a future policy ever uses history across that handoff, it will need a clearly defined identity, fresh host evidence, and explicit limits on which past events count.

## How to read this news without overclaiming

AWS's examples show a promising way to constrain agents at a managed gateway when all relevant calls flow through it. They do not prove that every agent action everywhere is now safe, or that prompt injection is solved. GrantTap solves a narrower, everyday problem: seeing supported local coding work, making bounded decisions, and reporting host enforcement coverage without equating selected policy with confirmed use. These approaches can coexist because they cover different routes. The practical test is to trace one sensitive action from agent request to tool execution and ask exactly which process can still say no.

Readers can compare the local side in [Project Mesh](/project-mesh), the [Project Governance guide](/blog/governance-that-reaches-the-computer), and [usage evidence](/blog/what-agent-usage-metrics-can-prove). For an AWS deployment, consult the current service documentation and reproduce the gateway example with harmless tools before extending it to sensitive data. For a GrantTap deployment, reproduce a denied local action on the actual provider and computer. In both cases, a visible denial with a specific boundary is stronger evidence than a broad policy description.`,
  },
  ru: {
    title: "AWS AgentCore ввёл temporal policies: история действий влияет на разрешение агента",
    summary: "AWS описал stateful-проверки последовательности инструментов, суммарного риска и одобрения человека. Разбираем урок для локального GrantTap без заявления о равенстве функций.",
    category: "Новости AI Security",
    screenshotCaption: "Настоящий экран Project Governance в GrantTap с детерминированными тестовыми данными. Он показывает локальную policy Project, а не AWS temporal policy или production trajectory.",
    illustrationCaption: "Оригинальная сгенерированная сцена последовательности вызовов у границы разрешения; это не архитектурная схема AWS.",
    additionalIllustrationCaption: "Оригинальная сгенерированная сцена учёта предыдущих действий; она не изображает trajectory-aware enforcement в GrantTap.",
    closing: "Для любого агента спрашивайте, какие конкретные действия проходят через контрольную точку и какие предыдущие события эта точка действительно помнит.",
    sources,
    body: `Агент может выполнить несколько по отдельности разумных вызовов инструментов, которые вместе создают опасный результат. За чтением недоверенного источника может последовать неожиданная передача данных в сеть. Несколько небольших операций способны превысить общий лимит, хотя ни одна отдельно его не нарушает. 6 августа 2026 года AWS опубликовала подробный разбор temporal policies для Amazon Bedrock AgentCore. Изменение состоит в том, что запрос через AgentCore Gateway можно оценить в контексте прежних событий той же trajectory, а не только по текущим аргументам.

Это новость об AWS gateway, а не объявление новой функции GrantTap. Нынешний Project Governance GrantTap применяет allow, ask и deny к поддерживаемым возможностям локальных coding-агентов, а каждый компьютер сообщает покрытие. Мы не заявляем AWS-подобное состояние trajectory, суммарные лимиты сделок или универсальный gateway для всех native действий провайдера. Но схема AWS даёт сильный вопрос и для локального контроллера: знает ли место принятия решения достаточно истории для этого действия и может ли агент обойти его? Ответ зависит от маршрута, а не от слова «policy» в меню.

## Что опубликовала AWS

AWS описывает temporal policies как stateful-авторизацию запросов к целям AgentCore Gateway. Текущий запрос проверяется вместе с предыдущими событиями ограниченной agent trajectory. Статья разбирает порядок вызовов, сравнение нового аргумента с прошлым ответом инструмента, свежесть данных, общий лимит операций, одноразовое подтверждение привилегированного действия и потерю права на запись после долгого отсутствия человека. Примеры даны для гипотетического банковского сценария; их нельзя выдавать за измеренные результаты реального финансового внедрения.

Точка применения названа точно. Policy работает на периметре AgentCore Gateway, вне кода агента, для трафика, который действительно проходит через gateway. Она возвращает allow или deny и записывает контекст решения. Session связана с principal и session ID; публикация описывает ограниченное окно просмотра истории. Детали важны: новая сессия или маршрут вне gateway меняют то, что видит правило. Официальная [документация AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html) остаётся источником текущей конфигурации и ограничений сервиса.

## Почему одной проверки вызова мало

Представьте coding-агента, которому разрешено читать внутренний документ и пользоваться внешним HTTP client. Простое allow для каждого инструмента не отвечает, допустимо ли отправлять текст документа по этому адресу. Правило с историей могло бы запретить защищённую последовательность, если оба действия проходят через одну enforcing boundary и нужное происхождение данных представлено в событиях. Последнее условие принципиально: gateway не сможет оценить невидимую локальную shell-команду только потому, что мы хотим видеть её в журнале.

Другой пример — повторная публикация. Человек мог одобрить один релиз, а агент попытался выполнить три. Для одноразового approval его нужно привязать к точной identity действия или погасить после использования; иначе широкое состояние «одобрено» покрывает больше задуманного. В статье AWS эту схему показывает сделка большой стоимости. Для coding-задачи аналогичный вопрос: покрывает ли согласие именно эту команду, репозиторий, ветку, назначение и время? [Разбор approval в GrantTap](/blog/agent-approvals-at-the-execution-boundary) начинает с границы исполнения.

## Что GrantTap контролирует сейчас

GrantTap применяет Project Governance к поддерживаемым локальным интеграциям. Правило Project может разрешать, запрашивать или запрещать типы возможностей: skills, MCP servers, shell и scripts, запись файлов, deployment и сеть. Именованное правило относится к одной возможности. Телефон создаёт ревизию, зашифрованный маршрут доставляет её компьютерам Project, а каждый компьютер сообщает свою ревизию и статус типа: enforced, observed only, unsupported или unknown. Глобальный deny провайдера остаётся сильнее allow Project. Локальный hook оценивает покрытое действие до запуска.

Это другая единица контроля, чем AWS temporal policy. GrantTap помогает человеку решать и проверять происходящее на собственных coding-компьютерах, прежде всего по основным маршрутам Claude Code и Codex. Мы не утверждаем, что продукт восстанавливает всю причинную историю вызовов или разрешает новое действие сравнением с прошлым ответом. Native путь вне hook остаётся вне enforcement GrantTap. Выбранная policy без ответа host — намерение, а не применённое правило. Эти ограничения полезны тем, что их можно испытать вместо вывода гарантии из снимка телефона.

## Сначала соберите цепочку evidence

Для разумного правила с историей нужны надёжные события. Какой процесс сделал вызов? Какая identity и версия инструмента использовалась? Инструмент завершился, упал или только получил approval? Изменился ли файл? Runtime GrantTap различает историю Invocations и подтверждённые filesystem effects; неподтверждённые изменения файла сейчас остаются неизвестными. Это правильная основа для будущего анализа, даже если из-за неё интерфейс говорит меньше. Policy engine, который питается неоднозначными событиями, может стать сложнее, но не надёжнее.

Для одного локального Project нарисуйте таблицу из четырёх колонок: запрошенное действие, действующее правило, решение host и наблюдаемый итог. Испытайте безопасную запрещённую shell-операцию и проверьте локальный отказ. Затем выполните разрешённую операцию и подтвердите результат в репозитории. Сохраните версию провайдера и ревизию policy. Если следующее действие зависит от первого, отметьте, где эту зависимость сегодня можно проверить, а где нельзя. Такое упражнение полезнее абстрактной надписи «stateful governance».

## Учитывайте новые режимы ошибки

Stateful-авторизация приносит вопрос границ session. Если агент продолжил работу с новым идентификатором, наследуются ли прошлые одобрения или история пуста? Что происходит с активной session при изменении policy? Будет ли поздний ответ инструмента записан до следующего запроса? AWS отдельно обсуждает session identity, ограничение истории и сброс состояния после обновления правил. Любая система с trajectory должна документировать эти свойства, испытывать одновременные запросы и не делать старые approvals бесконечными молча.

Локальная coding-работа добавляет границы компьютера и checkout. Task в GrantTap может продолжиться на другой машине, но новое execution получит иные инструменты, coverage, credentials и revision репозитория. Историю одного host нельзя автоматически считать разрешением привилегированного действия на другом. [Гид по handoff](/blog/task-continuity-beyond-an-agent-session) объясняет ограниченные факты, которые передаются сегодня. Если будущая policy когда-либо будет учитывать историю после передачи, ей понадобятся чёткая identity, свежие сведения host и явный предел того, какие старые события действуют.

## Как читать новость без преувеличения

Примеры AWS показывают перспективный способ ограничить агентов на управляемом gateway, если через него проходят все существенные вызовы. Они не доказывают, что любое действие любого агента теперь безопасно или что prompt injection решён. GrantTap решает более узкую повседневную задачу: показывает поддерживаемую локальную coding-работу, помогает принимать ограниченные решения и сообщает coverage enforcement host, не приравнивая выбранную policy к подтверждённому использованию. Подходы могут сосуществовать, потому что покрывают разные маршруты. Практическая проверка — пройти за одним чувствительным действием от запроса агента до инструмента и найти процесс, способный отказать.

Локальную сторону раскрывают [Project Mesh](/project-mesh), [руководство по Governance](/blog/governance-that-reaches-the-computer) и [usage evidence](/blog/what-agent-usage-metrics-can-prove). Для AWS внедрения читайте текущую документацию сервиса и повторите пример gateway на безвредных инструментах до работы с секретами. Для GrantTap повторите запретное локальное действие на действительном провайдере и компьютере. В обоих случаях видимый отказ на конкретной границе сильнее общего описания policy.

Есть и полезный вопрос о времени: если решение человека пришло позже, чем запрос агента, какая сторона отвечает за его срок действия? Одобрение без точного идентификатора вызова может случайно оказаться разрешением для следующей попытки. В локальном сценарии проверьте, что повторённая команда создаёт новый понятный запрос, а host не принимает старое согласие как бессрочное. В сценарии AgentCore следуйте опубликованным правилам session и trajectory. История приносит пользу только тогда, когда границы её действия так же точны, как сама проверка.`,
  },
});
