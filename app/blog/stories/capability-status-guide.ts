import type { BlogArticle } from "../articleTypes";

export const capabilityStatusGuide: BlogArticle = {
  slug: "mcp-skills-and-governance-status",
  date: "2026-09-24",
  minutes: 6,
  cover: "/blog/capability-states.webp",
  generatedCover: true,
  screenshot: "/product/iphone-mcp-usage.png",
  inlineIllustration: "/blog/capability-evidence-v2.webp",
  en: {
    title: "Configured, available, used: three different facts",
    summary: "A practical way to read MCP and skill status without confusing a catalog entry with working execution.",
    category: "Governance",
    intro: [
      "A tool can appear in a catalog and still be unusable on the computer selected for a Task. It may be requested, approved, installed with a different configuration, missing a credential, or simply not initialized. A trustworthy control screen names these states separately.",
      "GrantTap tracks capability identities, observed host state, and Mesh decisions. It does not yet transfer complete MCP or skill bundles to every host. A requested or approved entry therefore cannot by itself establish readiness on a target computer.",
    ],
    sections: [
      { heading: "Follow the capability through its lifecycle", paragraphs: [
        "The full lifecycle starts with discovery: a host reports a native MCP configuration or skill bundle. A request brings an exact version or digest into review. Approval covers that identity under policy. Each target host would then need to apply it and report initialized state; complete cross-host bundle delivery is still work in progress. Only invocation evidence can show that a Task actually used it.",
        "The same human-friendly MCP name can hide two different server configurations. For a skill, scripts and references matter as much as SKILL.md. An edit to the bundle changes the digest and requires a new readiness decision rather than inheriting an old approval by name.",
      ] },
      { heading: "Policy and environment are separate", paragraphs: [
        "Governance answers whether a capability may be used. Environment controls which approved process receives a value or reference. A masked field in Settings prevents casual viewing; it does not stop an agent with shell access to the same process from reading its environment. Use-only credentials require a trusted broker that performs a narrow operation without exposing the key to the model.",
        "Likewise, observing token use is not a spending cap. A strict budget needs an atomic reservation before a controlled external action, accounting for work already in flight and unknown outcomes. These budget and use-only flows are still being built and should not be treated as active protection.",
      ] },
      { heading: "What to check today", paragraphs: [
        "Check the exact capability identity, the target computer, its observed configured and initialized states, the chat's allow/ask/deny decision, and the result of a small real invocation. If any state is unknown, keep it unknown. A green catalog card must not stand in for successful use.",
        "For a local MCP connection, also verify the machine helper, transport, provider plugin, and app hooks independently. A relay connection does not prove that an stdio server launched in Cursor or that a Codex session loaded newly trusted hooks.",
      ] },
    ],
    screenshotCaption: "GrantTap Usage with deterministic sample MCP counts. A listed tool or aggregate count does not prove invocation by this Task.",
    illustrationCaption: "AI-generated conceptual progression from configuration to invocation; these are not measured capability states.",
    closing: "Good governance makes the gap between intended policy and applied reality visible before a Task depends on that capability.",
    sources: [
      { label: "GrantTap capability catalog and current limits", url: "https://github.com/sergii-ziborov/granttap-mcp#project-mesh-and-task-handoff" },
      { label: "GrantTap Project Governance", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
    ],
  },
  ru: {
    title: "Настроено, доступно, использовано: три разных факта",
    summary: "Как читать статусы MCP и skills, не путая запись каталога с работающим исполнением.",
    category: "Governance",
    intro: [
      "Инструмент может быть в каталоге и при этом не работать на компьютере, выбранном для Task. Его могли запросить, одобрить, установить с другой конфигурацией, оставить без credential или не инициализировать. Надёжный экран контроля называет эти состояния по отдельности.",
      "GrantTap отслеживает identity возможностей, наблюдаемое состояние хостов и решения Mesh. Полный перенос MCP и skill bundles на каждый host пока не реализован. Поэтому запись или одобрение сами по себе не доказывают готовность на целевом компьютере.",
    ],
    sections: [
      { heading: "Проследите весь жизненный цикл", paragraphs: [
        "Полный путь начинается с обнаружения: хост сообщает native MCP configuration или skill bundle. На проверку поступает точная версия или digest, и правило одобряет эту identity. Затем каждый целевой host должен применить её и сообщить initialized state; полный перенос bundles между хостами ещё в работе. Только evidence вызова показывает, что Task действительно использовала инструмент.",
        "За одним удобным именем MCP могут скрываться разные конфигурации сервера. У skill важны scripts и references, а не один SKILL.md. После изменения bundle меняется digest; старое одобрение по имени не подтверждает новую готовность.",
      ] },
      { heading: "Policy и Environment решают разные задачи", paragraphs: [
        "Governance отвечает, можно ли использовать capability. Environment определяет, какой разрешённый процесс получает значение или reference. Скрытое поле Settings защищает от случайного взгляда, но агент с shell в том же процессе всё ещё может читать env. Use-only credential требует доверенного broker, который выполняет узкую операцию и не показывает ключ модели.",
        "Точно так же наблюдение токенов не ограничивает расходы. Строгий бюджет требует атомарного резерва перед управляемым внешним действием с учётом уже идущей работы и неизвестных исходов. Эти budget и use-only сценарии пока разрабатываются и не должны считаться действующей защитой.",
      ] },
      { heading: "Что проверять сейчас", paragraphs: [
        "Смотрите точную identity возможности, целевой компьютер, наблюдаемые configured и initialized состояния, решение allow/ask/deny в chat и результат небольшого реального вызова. Если что-то неизвестно, оставляйте статус неизвестным. Зелёная карточка каталога не равна успешному использованию.",
        "Для локального MCP отдельно проверяйте machine helper, transport, provider plugin и hooks приложения. Связь с relay не доказывает, что stdio server запустился в Cursor или что сессия Codex подхватила новые доверенные hooks.",
      ] },
    ],
    screenshotCaption: "Экран Usage в GrantTap с тестовыми счётчиками MCP. Инструмент в списке или общая сумма не доказывают его вызов этой Task.",
    illustrationCaption: "Сгенерированная схема перехода от настройки к вызову; она не показывает измеренные состояния возможностей.",
    closing: "Хороший governance показывает разницу между желаемым правилом и фактически применённым состоянием до того, как Task начнёт зависеть от инструмента.",
    sources: [
      { label: "Каталог возможностей и текущие границы GrantTap", url: "https://github.com/sergii-ziborov/granttap-mcp#project-mesh-and-task-handoff" },
      { label: "Project Governance в GrantTap", url: "https://github.com/sergii-ziborov/granttap-mcp#project-governance" },
    ],
  },
};
