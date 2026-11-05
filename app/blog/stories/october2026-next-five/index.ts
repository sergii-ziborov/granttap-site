import { composeStory } from "../compose";
import { body as graphEN } from "./graph-en";
import { body as graphRU } from "./graph-ru";
import { body as mcpEN } from "./mcp-en";
import { body as mcpRU } from "./mcp-ru";
import { body as upgradeEN } from "./upgrade-en";
import { body as upgradeRU } from "./upgrade-ru";
import { body as accessibleEN } from "./accessible-en";
import { body as accessibleRU } from "./accessible-ru";
import { body as incidentEN } from "./incident-en";
import { body as incidentRU } from "./incident-ru";

export const octoberNextFiveStories = [
composeStory({
  "slug": "granttap-graph-health-investigate-code-boundaries",
  "date": "2026-10-20",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-next-five/graph-cover.webp",
  "inlineIllustration": "/blog/october2026-next-five/graph-scenario.webp",
  "additionalIllustration": "/blog/october2026-next-five/graph-evidence.webp",
  "screenshot": "/guide/screens/graph.png",
  "en": {
    body: graphEN,
    "title": "Use Graph and Health to investigate a code boundary",
    "summary": "A practical investigation method: report identity, structural hypotheses, source inspection and a controlled integration check.",
    "category": "GrantTap field guide",
    "closing": "Use the map to choose a check, and let the check determine the conclusion.",
    "sources": [
      {
        "label": "GrantTap: Graph and Health",
        "url": "/guide/graph-health"
      },
      {
        "label": "GrantTap: Runtime and evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "GrantTap: workspaces",
        "url": "/guide/workspaces"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "An original AI-generated conceptual illustration of this workshop. It is not a product screenshot, test result or measurement.",
    "additionalIllustrationCaption": "A separate ImageGen illustration explaining the scenario. No pictured object represents a completed action or independently verified outcome.",
    "screenshotCaption": "Existing GrantTap capture, build 250, iOS Simulator, 2026-11-04. Isolated synthetic fixture data; not the result of the workshop in this article. The screen illustrates the interface, not a completed check of your project."
  },
  "ru": {
    body: graphRU,
    "title": "Как исследовать границы кода через Graph и Health",
    "summary": "Практический маршрут: происхождение отчёта, структурные гипотезы, чтение исходников и контролируемая проверка интеграции.",
    "category": "Практика GrantTap",
    "closing": "Карта помогает выбрать проверку, а вывод определяет её наблюдаемый результат.",
    "sources": [
      {
        "label": "GrantTap: Graph and Health",
        "url": "/guide/graph-health"
      },
      {
        "label": "GrantTap: Runtime and evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "GrantTap: workspaces",
        "url": "/guide/workspaces"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не скриншот продукта, результат проверки или измерение.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Изображённые предметы не являются свидетельствами выполненного действия или подтверждённого результата.",
    "screenshotCaption": "Ранее снятый настоящий интерфейс GrantTap, сборка 250, iOS Simulator, 2026-11-04. Синтетический архитектурный отчёт с собственной областью и ревизией. Сборка 250, iOS Simulator, изолированные учебные данные. Это учебные данные; снимок не является результатом описанного в статье упражнения."
  }
}),
composeStory({
  "slug": "granttap-design-mcp-tool-contracts",
  "date": "2026-10-21",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-next-five/mcp-cover.webp",
  "inlineIllustration": "/blog/october2026-next-five/mcp-scenario.webp",
  "additionalIllustration": "/blog/october2026-next-five/mcp-evidence.webp",
  "screenshot": "/guide/screens/mcp-details.png",
  "en": {
    body: mcpEN,
    "title": "Design MCP tools that remain understandable after a failed call",
    "summary": "A tool-contract workshop covering explicit targets, structured results, failures, repeated requests, cancellation and authorization.",
    "category": "GrantTap field guide",
    "closing": "A useful tool explains its target, its effects and the next step when the outcome is uncertain.",
    "sources": [
      {
        "label": "MCP: Tools, specification 2025-06-18",
        "url": "https://modelcontextprotocol.io/specification/2025-06-18/server/tools"
      },
      {
        "label": "GrantTap: request decisions",
        "url": "/guide/questions-approvals"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "GrantTap: provider sign-in",
        "url": "/guide/provider-sign-in"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "An original AI-generated conceptual illustration of this workshop. It is not a product screenshot, test result or measurement.",
    "additionalIllustrationCaption": "A separate ImageGen illustration explaining the scenario. No pictured object represents a completed action or independently verified outcome.",
    "screenshotCaption": "Existing GrantTap capture, build 230, iOS Simulator, 2026-10-27. Isolated synthetic fixture data; not the result of the workshop in this article. The MCP card uses fixture calls and resource values, not live customer measurements."
  },
  "ru": {
    body: mcpRU,
    "title": "Как проектировать понятные контракты MCP-инструментов",
    "summary": "Практикум по целям, структурированным ответам, ошибкам, повторам, отмене и правам доступа на примере собственного сервиса.",
    "category": "Практика GrantTap",
    "closing": "Полезный инструмент объясняет цель, эффект и следующий шаг при неизвестном исходе.",
    "sources": [
      {
        "label": "MCP: Tools, specification 2025-06-18",
        "url": "https://modelcontextprotocol.io/specification/2025-06-18/server/tools"
      },
      {
        "label": "GrantTap: request decisions",
        "url": "/guide/questions-approvals"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "GrantTap: provider sign-in",
        "url": "/guide/provider-sign-in"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не скриншот продукта, результат проверки или измерение.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Изображённые предметы не являются свидетельствами выполненного действия или подтверждённого результата.",
    "screenshotCaption": "Ранее снятый настоящий интерфейс GrantTap, сборка 230, iOS Simulator, 2026-10-27. Учебная карточка GitHub MCP в режиме Демо. Calls, duration, CPU и memory заданы тестовыми данными; это не измерение реального клиента. Это учебные данные; снимок не является результатом описанного в статье упражнения."
  }
}),
composeStory({
  "slug": "granttap-agent-dependency-upgrade-lockfile",
  "date": "2026-10-22",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-next-five/upgrade-cover.webp",
  "inlineIllustration": "/blog/october2026-next-five/upgrade-scenario.webp",
  "additionalIllustration": "/blog/october2026-next-five/upgrade-evidence.webp",
  "screenshot": "/guide/screens/modified-files.png",
  "en": {
    body: upgradeEN,
    "title": "Upgrade a dependency with an agent and keep the project reproducible",
    "summary": "From the reason for an update through lockfile review, clean installation, application checks and a verified rollback baseline.",
    "category": "GrantTap field guide",
    "closing": "Review the complete reproducible change, not only the version number.",
    "sources": [
      {
        "label": "npm: npm ci, CLI v11",
        "url": "https://docs.npmjs.com/cli/v11/commands/npm-ci/"
      },
      {
        "label": "GrantTap: Files and voice",
        "url": "/guide/files-voice"
      },
      {
        "label": "GrantTap: workspaces",
        "url": "/guide/workspaces"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "An original AI-generated conceptual illustration of this workshop. It is not a product screenshot, test result or measurement.",
    "additionalIllustrationCaption": "A separate ImageGen illustration explaining the scenario. No pictured object represents a completed action or independently verified outcome.",
    "screenshotCaption": "Existing GrantTap capture, build 250, iOS Simulator, 2026-11-04. Isolated synthetic fixture data; not the result of the workshop in this article. The screen illustrates the interface, not a completed check of your project."
  },
  "ru": {
    body: upgradeRU,
    "title": "Обновление зависимостей с агентом без потери воспроизводимости",
    "summary": "От причины обновления до ревью lockfile, чистой установки, проверки поведения приложения и понятного возврата.",
    "category": "Практика GrantTap",
    "closing": "Проверяйте целое воспроизводимое изменение, а не только новый номер версии.",
    "sources": [
      {
        "label": "npm: npm ci, CLI v11",
        "url": "https://docs.npmjs.com/cli/v11/commands/npm-ci/"
      },
      {
        "label": "GrantTap: Files and voice",
        "url": "/guide/files-voice"
      },
      {
        "label": "GrantTap: workspaces",
        "url": "/guide/workspaces"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не скриншот продукта, результат проверки или измерение.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Изображённые предметы не являются свидетельствами выполненного действия или подтверждённого результата.",
    "screenshotCaption": "Ранее снятый настоящий интерфейс GrantTap, сборка 250, iOS Simulator, 2026-11-04. Четыре изменённых учебных файла; это записанные фикстурой изменения, не результат live-запуска. Сборка 250, iOS Simulator, изолированные учебные данные. Это учебные данные; снимок не является результатом описанного в статье упражнения."
  }
}),
composeStory({
  "slug": "granttap-accessible-mobile-agent-control",
  "date": "2026-10-23",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-next-five/accessible-cover.webp",
  "inlineIllustration": "/blog/october2026-next-five/accessible-scenario.webp",
  "additionalIllustration": "/blog/october2026-next-five/accessible-evidence.webp",
  "screenshot": "/guide/screens/approval-details.png",
  "en": {
    body: accessibleEN,
    "title": "Make mobile agent control readable and recoverable",
    "summary": "A practical accessibility workshop for meaningful statuses, stable scrolling, large text, voice drafts, notifications and deliberate actions.",
    "category": "GrantTap field guide",
    "closing": "Assess the whole decision journey with the settings and device the person actually uses.",
    "sources": [
      {
        "label": "W3C: Understanding WCAG 2.2 status messages",
        "url": "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
      },
      {
        "label": "GrantTap: requests and approvals",
        "url": "/guide/questions-approvals"
      },
      {
        "label": "GrantTap: request recovery",
        "url": "/guide/request-recovery"
      },
      {
        "label": "GrantTap: notifications",
        "url": "/guide/notifications"
      },
      {
        "label": "GrantTap: Devices and Watch",
        "url": "/guide/devices-watch"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "An original AI-generated conceptual illustration of this workshop. It is not a product screenshot, test result or measurement.",
    "additionalIllustrationCaption": "A separate ImageGen illustration explaining the scenario. No pictured object represents a completed action or independently verified outcome.",
    "screenshotCaption": "Existing GrantTap capture, build 250, iOS Simulator, 2026-11-04. Isolated synthetic fixture data; not the result of the workshop in this article. The screen illustrates the interface, not a completed check of your project."
  },
  "ru": {
    body: accessibleRU,
    "title": "Понятное и доступное управление агентом с телефона",
    "summary": "Практические проверки статусов, прокрутки, увеличенного текста, голосовых черновиков, уведомлений и восстановления после перерыва.",
    "category": "Практика GrantTap",
    "closing": "Проверяйте весь путь решения на настоящем устройстве и с нужными человеку настройками.",
    "sources": [
      {
        "label": "W3C: Understanding WCAG 2.2 status messages",
        "url": "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
      },
      {
        "label": "GrantTap: requests and approvals",
        "url": "/guide/questions-approvals"
      },
      {
        "label": "GrantTap: request recovery",
        "url": "/guide/request-recovery"
      },
      {
        "label": "GrantTap: notifications",
        "url": "/guide/notifications"
      },
      {
        "label": "GrantTap: Devices and Watch",
        "url": "/guide/devices-watch"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не скриншот продукта, результат проверки или измерение.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Изображённые предметы не являются свидетельствами выполненного действия или подтверждённого результата.",
    "screenshotCaption": "Ранее снятый настоящий интерфейс GrantTap, сборка 250, iOS Simulator, 2026-11-04. Текущий запрос и настройка последующих разрешений показаны отдельно. Сборка 250, iOS Simulator, изолированные учебные данные. Это учебные данные; снимок не является результатом описанного в статье упражнения."
  }
}),
composeStory({
  "slug": "granttap-agent-incident-timeline-reproduction",
  "date": "2026-10-24",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-next-five/incident-cover.webp",
  "inlineIllustration": "/blog/october2026-next-five/incident-scenario.webp",
  "additionalIllustration": "/blog/october2026-next-five/incident-evidence.webp",
  "en": {
    body: incidentEN,
    "title": "Reconstruct an agent-assisted incident from evidence",
    "summary": "A practical method for recovery, timelines, source and artifact identity, minimal reproductions and useful follow-up work.",
    "category": "GrantTap field guide",
    "closing": "Keep the symptom, the evidence and the remaining uncertainty connected to the same incident.",
    "sources": [
      {
        "label": "Git: git bisect",
        "url": "https://git-scm.com/docs/git-bisect"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: activity sources",
        "url": "/guide/transcript-sources"
      },
      {
        "label": "GrantTap: Runtime and evidence",
        "url": "/guide/audit-evidence"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "An original AI-generated conceptual illustration of this workshop. It is not a product screenshot, test result or measurement.",
    "additionalIllustrationCaption": "A separate ImageGen illustration explaining the scenario. No pictured object represents a completed action or independently verified outcome."
  },
  "ru": {
    body: incidentRU,
    "title": "Как разобрать сбой после работы агента по свидетельствам",
    "summary": "Практический метод: восстановление, timeline, идентичность source и artifact, минимальное воспроизведение и проверяемое улучшение.",
    "category": "Практика GrantTap",
    "closing": "Связывайте симптом, свидетельства и оставшиеся вопросы с одним конкретным инцидентом.",
    "sources": [
      {
        "label": "Git: git bisect",
        "url": "https://git-scm.com/docs/git-bisect"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: activity sources",
        "url": "/guide/transcript-sources"
      },
      {
        "label": "GrantTap: Runtime and evidence",
        "url": "/guide/audit-evidence"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не скриншот продукта, результат проверки или измерение.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Изображённые предметы не являются свидетельствами выполненного действия или подтверждённого результата."
  }
}),
];
