import type { BlogArticle } from "../articleTypes";

export const agentLandscape: BlogArticle = {
  slug: "coding-agents-on-your-phone-2026",
  date: "2026-10-10",
  minutes: 7,
  cover: "/blog/agent-landscape.webp",
  generatedCover: true,
  en: {
    title: "Coding agents on your phone: what each approach controls",
    summary: "Claude Code, Codex, and Cursor already offer mobile paths. The useful comparison is where the agent runs and what you can verify.",
    category: "Landscape",
    intro: [
      "Mobile control of coding agents is no longer a blank market. Claude Code has Remote Control, OpenAI brings Codex into ChatGPT mobile, and Cursor offers a native iOS app with cloud agents and Remote Control. GrantTap has to earn its place through a different coordination boundary, not by pretending those tools lack a phone experience.",
      "The details below reflect official product documentation checked on October 3, 2026. Availability and plan terms can change; follow each provider's current documentation before choosing a workflow.",
    ],
    sections: [
      { heading: "The provider-native paths", paragraphs: [
        "Claude Code Remote Control connects the Claude app or claude.ai/code to a session associated with your computer. OpenAI's Codex mobile experience loads live state from connected machines and handles threads, approvals, and project context. Cursor for iOS starts and reviews cloud agents and can direct a local computer through Remote Control; its docs say the agent loop moves to Cursor's cloud while tools execute on the computer.",
        "These are substantial products. For work centered on one provider, its native surface may be the shortest route. Cursor's mobile app also covers pull request review, voice, and notifications. It would be inaccurate to describe any of the three as simply a remote terminal.",
      ] },
      { heading: "What GrantTap coordinates", paragraphs: [
        "GrantTap's design follows a Task across supported provider executions and computers. It puts decisions, delivery state, capability policy, and observed usage around that Task. Claude Code and Codex are the primary integrations; Cursor is Beta. Provider support is uneven, and a provider's own mobile client may expose features GrantTap does not.",
        "This is a complementary choice for people who use more than one coding provider and want a consistent local control view. It does not replace the providers' models, subscriptions, or native review tools. GrantTap's relay carries encrypted envelopes between authorized devices; that is a different data path from each provider's own service.",
      ] },
      { heading: "Compare the right questions", paragraphs: [
        "Ask where the agent loop runs, where file tools execute, what must be online, which service receives model context, and whether an approval is enforced by the host or only displayed in a UI. Then ask if you can move a piece of work between providers without losing the human-visible objective.",
        "The best choice depends on your workflow. A single-provider session may be simplest in its native app. A cross-provider local workflow benefits from stable Task identity and explicit handoff, provided every integration reports its actual limits honestly.",
      ] },
    ],
    closing: "Mobile access is now expected. The differentiator is a truthful account of execution, authority, and continuity.",
    sources: [
      { label: "Claude Code Remote Control documentation", url: "https://code.claude.com/docs/en/remote-control" },
      { label: "OpenAI: Work with Codex from anywhere", url: "https://openai.com/index/work-with-codex-from-anywhere/" },
      { label: "Cursor for iOS documentation", url: "https://cursor.com/docs/cloud-agent/mobile" },
      { label: "GrantTap provider guides", url: "/agents/codex" },
    ],
    graphic: { title: "Questions to ask any mobile agent client", caption: "A comparison framework, not a feature score or vendor ranking.", rows: [
      { label: "Execution", detail: "Where do the agent loop and file tools run?" },
      { label: "Authority", detail: "Who enforces an approval or deny decision?" },
      { label: "Continuity", detail: "What survives a session or provider change?" },
    ] },
  },
  ru: {
    title: "Coding-агенты на телефоне: что контролирует каждый подход",
    summary: "У Claude Code, Codex и Cursor уже есть мобильные сценарии. Сравнивать полезнее место исполнения и проверяемость результата.",
    category: "Рынок",
    intro: [
      "Мобильное управление coding-агентами уже не пустая ниша. У Claude Code есть Remote Control, OpenAI выводит Codex в мобильный ChatGPT, а Cursor предлагает нативное iOS-приложение с cloud agents и Remote Control. GrantTap должен отличаться границей координации, а не утверждением, что у других нет телефона.",
      "Ниже — официальная документация, проверенная 3 октября 2026 года. Доступность и условия тарифов меняются; перед выбором сценария стоит открыть свежую документацию провайдера.",
    ],
    sections: [
      { heading: "Нативные решения провайдеров", paragraphs: [
        "Claude Code Remote Control связывает приложение Claude или claude.ai/code с сессией на вашем компьютере. Мобильный Codex от OpenAI загружает живое состояние подключённых машин и работает с задачами, подтверждениями и контекстом проекта. Cursor для iOS запускает и проверяет cloud agents, а через Remote Control позволяет направлять локальный компьютер; согласно документации Cursor, цикл агента при этом переходит в облако, а инструменты выполняются на компьютере.",
        "Это серьёзные решения. Если работа сосредоточена у одного провайдера, его приложение может быть самым коротким путём. Мобильный Cursor также умеет проверять pull requests, принимать голосовой ввод и уведомлять о ходе работы. Называть все эти решения просто удалённым терминалом было бы неверно.",
      ] },
      { heading: "Что связывает GrantTap", paragraphs: [
        "GrantTap ведёт Task через поддерживаемые executions разных провайдеров и компьютеров. Вокруг неё собраны решения человека, состояние доставки, правила возможностей и наблюдаемое использование. Основные интеграции — Claude Code и Codex; Cursor находится в Beta. Поддержка разных провайдеров неравномерна, а их собственные мобильные клиенты могут иметь функции, которых нет в GrantTap.",
        "Это дополняющий вариант для тех, кто использует больше одного coding-провайдера и хочет общий локальный вид управления. Он не заменяет модели, подписки и native review tools провайдеров. Relay GrantTap переносит зашифрованные сообщения между разрешёнными устройствами; путь данных отличается от сервисов самих провайдеров.",
      ] },
      { heading: "Какие вопросы сравнивать", paragraphs: [
        "Уточните, где выполняется цикл агента, где запускаются файловые инструменты, что должно оставаться online, какой сервис получает модельный контекст и действительно ли хост применяет решение allow/deny. Затем спросите, сохранится ли человеческая цель работы при смене сессии или провайдера.",
        "Выбор зависит от процесса. Для одной сессии у одного провайдера его native app часто проще. Для локальной работы с несколькими провайдерами полезны стабильная Task и явный handoff — при условии, что ограничения каждой интеграции названы честно.",
      ] },
    ],
    closing: "Мобильный доступ стал нормой. Важнее ясность об исполнении, полномочиях и непрерывности работы.",
    sources: [
      { label: "Документация Claude Code Remote Control", url: "https://code.claude.com/docs/en/remote-control" },
      { label: "OpenAI: Work with Codex from anywhere", url: "https://openai.com/index/work-with-codex-from-anywhere/" },
      { label: "Документация Cursor для iOS", url: "https://cursor.com/docs/cloud-agent/mobile" },
      { label: "Интеграция GrantTap с Codex", url: "/agents/codex" },
    ],
    graphic: { title: "Что спросить о мобильном клиенте", caption: "Рамка сравнения, а не оценка или рейтинг продуктов.", rows: [
      { label: "Исполнение", detail: "Где работают цикл агента и файловые инструменты?" },
      { label: "Полномочия", detail: "Кто применяет разрешение или запрет?" },
      { label: "Преемственность", detail: "Что переживает смену сессии и провайдера?" },
    ] },
  },
};
