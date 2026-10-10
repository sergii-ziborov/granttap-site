import { composeStory } from "../compose";
import { body as cortexEn } from "./cortex-en";
import { body as cortexRu } from "./cortex-ru";
import { body as meshEn } from "./mesh-en";
import { body as meshRu } from "./mesh-ru";
import { body as governanceEn } from "./governance-en";
import { body as governanceRu } from "./governance-ru";

const runtime = { label: "GrantTap runtime, Project Mesh and enforcement", url: "https://github.com/sergii-ziborov/granttap-mcp" };
const cortex = { label: "Cortex Loom architecture and context compiler", url: "https://github.com/sergii-ziborov/cortex-loom" };
const sequences = { label: "Cortex typed sequences", url: "https://github.com/sergii-ziborov/cortex-loom/blob/main/docs/architecture.md" };
const prefix = "/blog/granttap-research-";

export const cortexResearch = composeStory({
  slug: "cortex-loom-inside-granttap-token-economy", date: "2026-10-10",
  cover: `${prefix}cortex-cover.webp`, inlineIllustration: `${prefix}cortex-infographic.webp`,
  additionalIllustration: `${prefix}cortex-flow.webp`, screenshot: "/product/iphone-weavatrix-graph-details.png",
  en: {
    title: "Cortex Loom inside GrantTap: where token savings come from",
    summary: "A real Engine experiment reduced repeated source evidence by 56.2%, with zero omitted items. How citations, budgets and scoped delivery make the result useful.",
    category: "Engineering", body: cortexEn,
    illustrationCaption: "Infographic from the October 10 controlled Engine experiment: three repeated readings, 12,567 candidate and 5,506 delivered estimated tokens. All nine evidence items retained. This is a mechanism test, not provider billing.",
    additionalIllustrationCaption: "Algorithmic context delivery: scoped evidence enters Cortex; only a smaller complete representation replaces compact facts. Expansion remains available.",
    screenshotCaption: "The updated Weavatrix component information sheet shows directed relations, evidence counts and the report revision, with a return to the graph. Native Simulator capture with deterministic sample data; the token benchmark was measured separately through the actual Engine.",
    closing: "Reuse evidence before asking a model to read it again. Count the complete exchange and keep the path back to source.",
    sources: [runtime, cortex, sequences],
  },
  ru: {
    title: "Cortex Loom внутри GrantTap: откуда берётся экономия токенов",
    summary: "Настоящий Engine сократил повторяющийся контекст на 56,2%, сохранив все источники. Как ссылки, бюджеты и права доступа делают эту экономию полезной.",
    category: "Инженерия", body: cortexRu,
    illustrationCaption: "Инфографика контролируемого эксперимента Engine от 10 октября: три повторных чтения, 12 567 токенов кандидатов и 5 506 доставленных оценочных токенов. Все девять элементов сохранены. Это проверка механизма, не счёт провайдера.",
    additionalIllustrationCaption: "Алгоритмическая доставка контекста: scoped evidence поступает в Cortex; только меньшая полная выдача заменяет компактные факты. Раскрытие остаётся доступно.",
    screenshotCaption: "Новое окно информации Weavatrix: направления связей, число наблюдений и ревизия отчёта, с переходом к компоненту на графе. Снимок приложения в Simulator на тестовых данных; бенчмарк токенов выполнен отдельно через настоящий Engine.",
    closing: "Используйте evidence повторно до нового чтения моделью. Считайте весь обмен и сохраняйте путь к исходнику.",
    sources: [runtime, cortex, sequences],
  },
});

export const meshResearch = composeStory({
  slug: "project-mesh-memory-handoff-less-duplicate-work", date: "2026-10-10",
  cover: `${prefix}mesh-cover.webp`, inlineIllustration: `${prefix}mesh-infographic.webp`,
  additionalIllustration: `${prefix}mesh-flow.webp`, screenshot: "/product/iphone-handoff.png",
  en: {
    title: "Project Mesh: preserve work instead of doing it twice",
    summary: "Observed claims, scoped memory and a stable Task help agents coordinate and continue across models and computers. We verified failed-attempt persistence through an Engine restart.",
    category: "Continuity", body: meshEn,
    illustrationCaption: "Infographic of Mesh reuse: observed work produces scoped claims and attributed memory; compact context and a handoff capsule carry relevant facts to the next Execution. It depicts the implemented flow, not a universal saving percentage.",
    additionalIllustrationCaption: "One Task, multiple Executions: provider sessions change while repository evidence, ownership and the remaining work preserve continuity.",
    screenshotCaption: "GrantTap handoff interface with deterministic sample data. A capsule prepares continuation; destination readiness and the actual checkout remain necessary.",
    closing: "The durable unit is the Task. Its evidence, visibility and local route make continuity useful when a conversation changes.",
    sources: [runtime, { label: "GrantTap handoff guide", url: "/blog/task-continuity-beyond-an-agent-session" }, cortex],
  },
  ru: {
    title: "Project Mesh: сохранять работу, чтобы не делать её дважды",
    summary: "Занятость ресурсов, память с правами доступа и постоянная Task помогают координации между моделями и компьютерами. Неудачная попытка сохранилась после перезапуска Engine.",
    category: "Продолжение работы", body: meshRu,
    illustrationCaption: "Инфографика повторного использования Mesh: наблюдаемая работа формирует scoped claims и память с источником; компактный контекст и handoff capsule передают факты следующему Execution. Это реализованный путь, не универсальный процент экономии.",
    additionalIllustrationCaption: "Одна Task и несколько Execution: сессии провайдеров меняются, а evidence репозитория, ответственность и оставшаяся работа поддерживают продолжение.",
    screenshotCaption: "Интерфейс handoff GrantTap на детерминированных тестовых данных. Capsule готовит продолжение; готовность получателя и настоящее состояние checkout остаются необходимыми.",
    closing: "Устойчивая единица — Task. Её evidence, видимость и локальный маршрут позволяют полезно продолжать работу после смены разговора.",
    sources: [runtime, { label: "Передача Task в GrantTap", url: "/blog/task-continuity-beyond-an-agent-session" }, cortex],
  },
});

export const governanceResearch = composeStory({
  slug: "granttap-governance-native-enforcement-research", date: "2026-10-10",
  cover: `${prefix}governance-cover.webp`, inlineIllustration: `${prefix}governance-infographic.webp`,
  additionalIllustration: `${prefix}governance-flow.webp`, screenshot: "/product/iphone-governance.png",
  en: {
    title: "GrantTap governance: a decision that reaches the tool",
    summary: "Policy precedence, exact approvals and visible enforcement coverage. Real Engine and native hook checks show how the computer enforces the user's boundaries.",
    category: "Governance", body: governanceEn,
    illustrationCaption: "Infographic of the action boundary: account deny retains priority; local policy evaluates the identified invocation and a supported native hook enforces allow, ask or deny before execution.",
    additionalIllustrationCaption: "Three separate facts: a capability can be available, governed and observed in use. None of these states proves the other two.",
    screenshotCaption: "GrantTap governance interface captured with deterministic sample data. The enforcement research used isolated runtime state and actual Claude and Codex hook entry points.",
    closing: "Context guides the next step. The computer's supported enforcement path decides whether that step is permitted.",
    sources: [runtime, { label: "Capability status in GrantTap", url: "/blog/mcp-skills-and-governance-status" }, { label: "GrantTap security boundaries", url: "/security" }],
  },
  ru: {
    title: "Governance GrantTap: решение, которое доходит до инструмента",
    summary: "Приоритет политики, точные approvals и видимое покрытие enforcement. Проверки настоящего Engine и native hooks показывают применение границ пользователя на компьютере.",
    category: "Governance", body: governanceRu,
    illustrationCaption: "Инфографика границы действия: account deny сохраняет приоритет; локальная политика оценивает идентифицированный вызов, а поддерживаемый native hook применяет allow, ask или deny до выполнения.",
    additionalIllustrationCaption: "Три разных факта: capability доступна, управляется политикой и наблюдается в работе. Ни одно состояние не доказывает два остальных.",
    screenshotCaption: "Интерфейс governance GrantTap на детерминированных тестовых данных. Исследование enforcement использовало изолированное состояние и настоящие точки входа hooks Claude и Codex.",
    closing: "Контекст направляет следующий шаг. Поддерживаемый enforcement компьютера определяет, разрешён ли этот шаг.",
    sources: [runtime, { label: "Состояния capability GrantTap", url: "/blog/mcp-skills-and-governance-status" }, { label: "Границы безопасности GrantTap", url: "/security" }],
  },
});
