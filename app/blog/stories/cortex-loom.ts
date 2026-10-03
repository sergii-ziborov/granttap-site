import type { BlogArticle } from "../articleTypes";

export const cortexLoom: BlogArticle = {
  slug: "cortex-loom-evidence-per-token",
  date: "2026-10-31",
  minutes: 7,
  cover: "/blog/cortex-evidence.webp",
  generatedCover: true,
  screenshot: "/product/iphone-weavatrix-graph.png",
  en: {
    title: "Cortex Loom: fewer context tokens, with the gaps visible",
    summary: "A task-aware evidence packet can be much smaller than a folder dump. The benchmark also shows why token savings alone are not the goal.",
    category: "Engineering",
    intro: [
      "Coding agents often need repository context, but copying entire directories into a prompt spends tokens on material unrelated to the current task. Cortex Loom, a separate local-first project, prepares a bounded evidence packet from Weavatrix repository facts and reports which declared requirements are covered, missing, contradictory, or stale.",
      "The important word is evidence. A short packet that omits the caller responsible for a bug is cheap and unhelpful. Cortex tries to keep provenance and visible gaps alongside the selected facts, so an agent can request a specific expansion instead of trusting a compressed summary blindly.",
    ],
    sections: [
      { heading: "What the measured reduction means", paragraphs: [
        "In the project's published ten-task probe, the naive arm selected 403,238 estimated context tokens to cover 40 declared facts. Cortex with verified source windows selected 19,035 for the same 40/40 facts: 95.3% fewer selected tokens. The delivered MCP envelope was 22,936 tokens. This is a task-specific repository benchmark using a four-characters-per-token estimate, not a universal model-billing number.",
        "For a separate live-server question, the detailed benchmark table reports 79,040 session tokens for reading candidate files versus 9,801 for one Cortex context-profile call, with all four declared facts found in both cases. That Cortex total includes 454 schema and 9,347 payload tokens. The README's shorter 4,167 figure differs from this detailed table, so we use the table's explicit accounting rather than mix the two. These are task-specific measurements, not a guarantee for every codebase.",
      ] },
      { heading: "Why lower spend can still lose", paragraphs: [
        "The coding-agent matrix has a sobering example: one Grok task used 809,468 tokens without Cortex and 40,403 with a models-off Cortex packet, yet the close class did not improve because the packet mostly contained module maps. A small answer that lacks the right implementation detail may save money while leaving the bug unfixed.",
        "The same README explicitly separates context-compiler benchmarks from coding-agent quality. Missing or rate-limited cells are not scores. Comparisons also mix different accounting methods for Claude Code and Cursor, so they cannot be pooled into a single cost claim.",
      ] },
      { heading: "How this informs GrantTap", paragraphs: [
        "A future GrantTap integration could use repository evidence to select code context for an execution change while keeping revision and unknowns visible. The current handoff capsule carries bounded task and git facts; it is not a claim that Cortex packets are already delivered across every provider.",
        "Cortex is useful when a task needs unfamiliar callers, contracts, or cross-file relationships. For a tiny edit in a known file, its own documentation says to skip it. A reliable system spends context where it changes the next decision, and measures both completeness and the result of the coding work.",
      ] },
    ],
    screenshotCaption: "Weavatrix architecture graph in GrantTap, using a deterministic demo revision. It does not show the Cortex token benchmark or a live repository scan.",
    closing: "The useful metric is verified evidence per token for the task at hand, followed by whether the agent actually closed that task.",
    sources: [
      { label: "Cortex Loom README and measured work", url: "https://github.com/sergii-ziborov/cortex-loom" },
      { label: "Benchmark method and limitations", url: "https://github.com/sergii-ziborov/cortex-loom/blob/main/docs/benchmark.md" },
      { label: "GrantTap architecture evidence guide", url: "/blog/architecture-graph-with-evidence" },
    ],
    graphic: { title: "Selected context for the ten-task probe", caption: "Same 40/40 declared facts. Estimated tokens, not model billing; source: Cortex Loom benchmark.", rows: [
      { label: "Naive folders", detail: "403,238 selected tokens", value: 100 },
      { label: "Cortex + source", detail: "19,035 selected tokens", value: 4.7 },
    ] },
  },
  ru: {
    title: "Cortex Loom: меньше токенов контекста, видимые пробелы",
    summary: "Пакет evidence под задачу может быть гораздо меньше копии папок. Бенчмарк также показывает, почему экономия токенов сама по себе не цель.",
    category: "Инженерия",
    intro: [
      "Coding-агенту часто нужен контекст репозитория, но копирование целых папок в prompt расходует токены на сведения вне текущей задачи. Cortex Loom — отдельный local-first проект — собирает ограниченный пакет evidence из фактов Weavatrix и показывает, какие заявленные требования покрыты, отсутствуют, противоречат друг другу или устарели.",
      "Ключевое слово — evidence. Короткий пакет, пропустивший вызывающую функцию, от которой зависит баг, дёшев, но бесполезен. Cortex сохраняет происхождение фактов и видимые пробелы, чтобы агент мог запросить точечное расширение, а не слепо доверять сжатому резюме.",
    ],
    sections: [
      { heading: "Что измеряет сокращение", paragraphs: [
        "В опубликованном probe из десяти задач наивный способ отобрал 403 238 оценочных токенов контекста для 40 заданных фактов. Cortex с проверенными окнами исходников отобрал 19 035 для тех же 40/40 фактов: на 95,3% меньше. По MCP было доставлено 22 936 токенов. Это бенчмарк конкретных задач и репозитория с оценкой четыре символа на токен, а не универсальная сумма в счёте модели.",
        "Для отдельного вопроса к живому серверу подробная таблица бенчмарка указывает 79 040 токенов сессии при чтении файлов и 9 801 за один вызов Cortex context-profile; оба пути нашли четыре заданных факта. В сумму Cortex входят 454 токена схемы и 9 347 токенов ответа. Краткий README приводит другое число — 4 167, поэтому мы опираемся на явный учёт подробной таблицы и не смешиваем показатели. Это измерение конкретной задачи, а не гарантия для любого кода.",
      ] },
      { heading: "Почему дешёвый контекст может не помочь", paragraphs: [
        "Матрица coding-агентов даёт отрезвляющий пример: в одной задаче Grok использовал 809 468 токенов без Cortex и 40 403 с пакетом models-off Cortex, но класс завершения не улучшился — пакет в основном состоял из карт модулей. Короткий ответ без нужной детали реализации экономит расход, но может не исправить ошибку.",
        "README проекта явно отделяет бенчмарк компилятора контекста от качества coding-агента. Ячейки, не выполненные из-за лимита сессии или 429, не оцениваются. Учёт затрат Claude Code и Cursor тоже устроен по-разному, поэтому их нельзя складывать в одно обещание экономии.",
      ] },
      { heading: "Связь с GrantTap", paragraphs: [
        "Будущая интеграция GrantTap могла бы отбирать контекст кода при смене execution, сохраняя revision и неизвестные факты видимыми. Текущий handoff capsule переносит ограниченные факты Task и git; это не утверждение, что пакеты Cortex уже доставляются между всеми провайдерами.",
        "Cortex полезен при изучении незнакомых вызовов, контрактов и связей между файлами. Для крошечной правки в известном файле его собственная документация советует пропустить этот шаг. Надёжная система тратит контекст там, где он меняет следующее решение, и измеряет как полноту evidence, так и результат работы агента.",
      ] },
    ],
    screenshotCaption: "Архитектурный граф Weavatrix в GrantTap на тестовой ревизии. Он не показывает бенчмарк токенов Cortex или сканирование живого репозитория.",
    closing: "Полезная метрика — проверенные факты на токен для конкретной задачи, а затем реальное завершение самой задачи.",
    sources: [
      { label: "Cortex Loom и результаты измерений", url: "https://github.com/sergii-ziborov/cortex-loom" },
      { label: "Методика и ограничения бенчмарка", url: "https://github.com/sergii-ziborov/cortex-loom/blob/main/docs/benchmark.md" },
      { label: "Архитектурные сведения в GrantTap", url: "/blog/architecture-graph-with-evidence" },
    ],
    graphic: { title: "Контекст в probe из десяти задач", caption: "Те же 40/40 фактов. Оценочные токены, не счёт модели; источник: бенчмарк Cortex Loom.", rows: [
      { label: "Папки целиком", detail: "403 238 отобранных токенов", value: 100 },
      { label: "Cortex + исходники", detail: "19 035 отобранных токенов", value: 4.7 },
    ] },
  },
};
