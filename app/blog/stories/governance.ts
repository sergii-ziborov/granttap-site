import type { BlogArticle } from "../articleTypes";

export const governance: BlogArticle = {
  slug: "governance-that-reaches-the-computer",
  date: "2026-10-17",
  minutes: 7,
  cover: "/blog/governance-boundary.webp",
  generatedCover: true,
  screenshot: "/product/iphone-governance.png",
  en: {
    title: "Agent governance must reach the computer",
    summary: "An allow/ask/deny switch is only the beginning. Effective policy, host enforcement, and observed use need separate evidence.",
    category: "Governance",
    intro: [
      "When an agent can call a shell command, an MCP tool, or a skill, a policy screen is only useful if a real execution boundary honors it. A saved preference is not the same as a rule applied on a computer, and an approved capability is not evidence that it was invoked.",
      "This is why GrantTap separates desired policy, effective policy, host state, and confirmed use. A global deny wins over a Project allow. Unknown coverage stays unknown until the target computer can report what it enforced.",
    ],
    sections: [
      { heading: "From decision to action", paragraphs: [
        "A capability has an exact identity: the MCP server configuration or skill bundle matters, not only the name shown to a person. A request and an approval belong to that identity. Each target host must report what it actually applied and initialized. Complete cross-host bundle transfer is still unfinished, so approval alone cannot promise readiness on another computer.",
        "Auto-accept belongs after the effective policy check. A broad provider setting is not a substitute for computer enforcement. Even with a correct policy engine, an action outside its observed path cannot be described as protected by it.",
      ] },
      { heading: "Usage is a separate fact", paragraphs: [
        "A selected tool, an accepted proposal, and a configured server are three different states. Confirmed usage requires evidence from a real invocation. The same distinction applies to spending: reporting token use is useful, but it is not a hard budget. A strict cap requires reservation before a controlled billable action and careful handling of in-flight or unknown results.",
        "AWS describes a related principle in Amazon Bedrock AgentCore: gateway policy can evaluate routed tool calls before execution, and temporal policies can consider a sequence of actions. That does not automatically govern a local coding agent's shell or every provider-native route. The enforcement boundary must match the actual path of the call.",
      ] },
      { heading: "What the person should see", paragraphs: [
        "A useful governance view names who requested a change, its scope, the exact capability, the effective rule, the target computer, and the computer's reported outcome. A refusal should explain which rule stopped the action. A stale acknowledgement should not overwrite a newer decision.",
        "GrantTap's current product pages describe the available controls and their limits. There is no strict spending cap or use-only credential broker in the current release. The interface must continue to distinguish unfinished paths from controls already enforced.",
      ] },
    ],
    screenshotCaption: "GrantTap Governance on iPhone with deterministic sample data; shown states are not a live host audit.",
    closing: "The governing question is not ‘was a rule chosen?’ but ‘which computer applied which rule to which action?’",
    sources: [
      { label: "GrantTap capability status guide", url: "/blog/mcp-skills-and-governance-status" },
      { label: "GrantTap Project Governance and coverage", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
      { label: "AWS AgentCore Policy documentation", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
      { label: "AWS on temporal policies", url: "https://aws.amazon.com/blogs/machine-learning/securing-ai-agents-with-temporal-policies-in-amazon-bedrock-agentcore/" },
    ],
    graphic: { title: "Four proofs, one capability", caption: "The rows represent separate evidence. Later steps cannot be inferred from earlier ones.", rows: [
      { label: "Policy", detail: "What is permitted at this scope" },
      { label: "Applied", detail: "What the target computer accepted" },
      { label: "Available", detail: "What initialized and can run" },
      { label: "Used", detail: "What an invocation actually did" },
    ] },
  },
  ru: {
    title: "Governance для агентов должен доходить до компьютера",
    summary: "Переключатель allow/ask/deny — лишь начало. Действующее правило, применение на хосте и реальное использование требуют разных подтверждений.",
    category: "Governance",
    intro: [
      "Когда агент может вызвать shell, MCP или skill, экран правил полезен лишь тогда, когда граница исполнения действительно им подчиняется. Сохранённая настройка не равна правилу на компьютере, а одобрение возможности не доказывает её вызов.",
      "Поэтому GrantTap разделяет желаемое правило, действующее правило, состояние хоста и подтверждённое использование. Глобальный deny сильнее разрешения Project. Неизвестное покрытие остаётся неизвестным, пока целевой компьютер не сообщит, что он применил.",
    ],
    sections: [
      { heading: "От решения до действия", paragraphs: [
        "У возможности есть точная identity: важна конфигурация MCP-сервера или весь bundle skill, а не только имя на экране. Запрос и подтверждение относятся к этой identity. Каждый целевой хост должен сообщить, что он действительно применил и инициализировал. Полный перенос bundles между хостами ещё не завершён, поэтому одобрение не обещает готовности на другом компьютере.",
        "Auto-accept допустим после проверки действующего правила. Широкая настройка провайдера не заменяет computer enforcement. Даже верный policy engine не защищает действия, которые обходят наблюдаемый им путь.",
      ] },
      { heading: "Использование — отдельный факт", paragraphs: [
        "Выбранный инструмент, принятое предложение и настроенный сервер — три разных состояния. Подтверждённое использование требует свидетельства реального вызова. С расходами та же логика: наблюдение за токенами полезно, но не является жёстким бюджетом. Для строгого лимита нужен резерв перед управляемым платным действием и учёт незавершённых либо неизвестных результатов.",
        "AWS описывает родственный принцип в Amazon Bedrock AgentCore: политика gateway может проверить проходящий через него вызов до исполнения, а temporal policies учитывают последовательность действий. Это не означает автоматический контроль локального shell coding-агента или каждого native пути провайдера. Граница принуждения должна совпасть с реальным маршрутом вызова.",
      ] },
      { heading: "Что должен видеть человек", paragraphs: [
        "Полезный экран показывает автора запроса, scope, точную возможность, действующее правило, целевой компьютер и ответ этого компьютера. Отказ объясняет, какое правило остановило действие. Старое подтверждение не должно затирать новое решение.",
        "Страницы GrantTap описывают доступные механизмы и их пределы. В текущем релизе нет строгого лимита расходов или use-only broker для credentials. Интерфейс должен отличать незавершённые пути от уже действующей защиты.",
      ] },
    ],
    screenshotCaption: "GrantTap Governance на iPhone с детерминированными тестовыми данными; снимок не является аудитом живого хоста.",
    closing: "Важный вопрос не «правило выбрано?», а «какой компьютер применил какое правило к какому действию?»",
    sources: [
      { label: "Статусы возможностей в GrantTap", url: "/blog/mcp-skills-and-governance-status" },
      { label: "Project Governance и покрытие хостов", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
      { label: "Документация AWS AgentCore Policy", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html" },
      { label: "AWS о temporal policies", url: "https://aws.amazon.com/blogs/machine-learning/securing-ai-agents-with-temporal-policies-in-amazon-bedrock-agentcore/" },
    ],
    graphic: { title: "Четыре подтверждения одной возможности", caption: "Каждая строка требует отдельного свидетельства; следующий шаг не следует из предыдущего.", rows: [
      { label: "Policy", detail: "Что разрешено в данном scope" },
      { label: "Applied", detail: "Что принял целевой компьютер" },
      { label: "Available", detail: "Что инициализировано и может работать" },
      { label: "Used", detail: "Что произошло при реальном вызове" },
    ] },
  },
};
