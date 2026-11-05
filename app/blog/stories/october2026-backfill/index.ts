import { composeStory } from "../compose";
import { body as evaluationEN } from "./evaluation-en";
import { body as evaluationRU } from "./evaluation-ru";
import { body as injectionEN } from "./injection-en";
import { body as injectionRU } from "./injection-ru";
import { body as reviewEN } from "./review-en";
import { body as reviewRU } from "./review-ru";
import { body as resourcesEN } from "./resources-en";
import { body as resourcesRU } from "./resources-ru";
import { body as teamEN } from "./team-en";
import { body as teamRU } from "./team-ru";

export const octoberBackfillStories = [
composeStory({
  "slug": "granttap-evaluate-coding-agent-own-task",
  "date": "2026-10-25",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-backfill/evaluation-cover.webp",
  "inlineIllustration": "/blog/october2026-backfill/evaluation-scenario.webp",
  "additionalIllustration": "/blog/october2026-backfill/evaluation-evidence.webp",
  "en": {
      body: evaluationEN,
    "title": "Evaluate a coding agent on work you can actually verify",
    "summary": "A practical evaluation method for your own repository: comparable starting conditions, meaningful acceptance, human intervention, observable evidence and a specific routing decision.",
    "category": "GrantTap field guide",
    "closing": "Keep the task bounded, preserve its conditions, and choose the next route from observed results.",
    "sources": [
      {
        "label": "GrantTap: sources of activity",
        "url": "/guide/transcript-sources"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: provider readiness",
        "url": "/guide/providers"
      },
      {
        "label": "Anthropic: Building effective agents (2024)",
        "url": "https://www.anthropic.com/research/building-effective-agents"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "AI-generated conceptual illustration of the working scope and method. It is not a product screen, measured result or completed test.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the practical scenario. Its objects explain the idea; they do not represent actual measurements, permissions or completed actions."
  },
  "ru": {
      body: evaluationRU,
    "title": "Как оценить coding-агента на собственной задаче",
    "summary": "Практическая оценка в своём репозитории: одинаковые условия, содержательная приёмка, помощь человека, наблюдаемые свидетельства и конкретный выбор следующего маршрута.",
    "category": "Практика GrantTap",
    "closing": "Ограничьте задачу, сохраните условия и выбирайте следующий маршрут по наблюдаемому результату.",
    "sources": [
      {
        "label": "GrantTap: sources of activity",
        "url": "/guide/transcript-sources"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: provider readiness",
        "url": "/guide/providers"
      },
      {
        "label": "Anthropic: Building effective agents (2024)",
        "url": "https://www.anthropic.com/research/building-effective-agents"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Сгенерированная концептуальная иллюстрация: область и метод работы. Это не экран приложения, результат измерений или выполненная проверка.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация практического сценария. Предметы объясняют идею и не изображают реальные показатели, права или завершённые действия."
  }
}),
composeStory({
  "slug": "granttap-untrusted-content-agent-tool-boundaries",
  "date": "2026-10-26",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-backfill/injection-cover.webp",
  "inlineIllustration": "/blog/october2026-backfill/injection-boundary.webp",
  "additionalIllustration": "/blog/october2026-backfill/injection-response.webp",
  "screenshot": "/guide/screens/approval-details.png",
  "en": {
      body: injectionEN,
    "title": "When a document tries to instruct your coding agent",
    "summary": "Separate authorized instructions from retrieved material. Inspect tool inputs, preserve provenance, limit credentials and verify the execution boundary without claiming a universal prompt-injection shield.",
    "category": "GrantTap field guide",
    "closing": "Keep instructions tied to their authority and actions tied to a supported execution boundary.",
    "sources": [
      {
        "label": "GrantTap: Governance",
        "url": "/guide/governance"
      },
      {
        "label": "GrantTap: evidence and audit",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "MCP specification 2025-06-18: tools",
        "url": "https://modelcontextprotocol.io/specification/2025-06-18/server/tools"
      },
      {
        "label": "MCP security best practices",
        "url": "https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "AI-generated conceptual illustration of the working scope and method. It is not a product screen, measured result or completed test.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the practical scenario. Its objects explain the idea; they do not represent actual measurements, permissions or completed actions.",
    "screenshotCaption": "Actual GrantTap interface, build 250, captured 2026-11-04, sample data. It shows the controls, not a completed live operation."
  },
  "ru": {
      body: injectionRU,
    "title": "Когда документ пытается командовать coding-агентом",
    "summary": "Разделяйте указания владельца и извлечённые данные. Проверяйте вызов инструмента, происхождение текста, доступ к секретам и реальную границу исполнения.",
    "category": "Практика GrantTap",
    "closing": "Связывайте инструкцию с полномочиями, а действие — с поддержанной границей исполнения.",
    "sources": [
      {
        "label": "GrantTap: Governance",
        "url": "/guide/governance"
      },
      {
        "label": "GrantTap: evidence and audit",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "MCP specification 2025-06-18: tools",
        "url": "https://modelcontextprotocol.io/specification/2025-06-18/server/tools"
      },
      {
        "label": "MCP security best practices",
        "url": "https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Сгенерированная концептуальная иллюстрация: область и метод работы. Это не экран приложения, результат измерений или выполненная проверка.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация практического сценария. Предметы объясняют идею и не изображают реальные показатели, права или завершённые действия.",
    "screenshotCaption": "Настоящий интерфейс GrantTap, сборка 250, снимок 2026-11-04, учебные данные. Снимок показывает элементы управления, не подтверждая live-операцию."
  }
}),
composeStory({
  "slug": "granttap-review-agent-diffs-from-phone",
  "date": "2026-10-27",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-backfill/review-cover.webp",
  "inlineIllustration": "/blog/october2026-backfill/review-scope.webp",
  "additionalIllustration": "/blog/october2026-backfill/review-acceptance.webp",
  "screenshot": "/guide/screens/modified-files.png",
  "en": {
      body: reviewEN,
    "title": "Review an agent patch from your phone without losing the evidence",
    "summary": "A focused mobile review: identify the Task and Execution, choose the right request, read Modified and All files, inspect tests and distinguish accepted code from a published release.",
    "category": "GrantTap field guide",
    "closing": "Connect the request, the exact change, the meaningful check and the outcome you accept.",
    "sources": [
      {
        "label": "GrantTap: Files and activity",
        "url": "/guide/transcript-sources"
      },
      {
        "label": "GrantTap: task identity",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: audit evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "Git: diff documentation",
        "url": "https://git-scm.com/docs/git-diff"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "AI-generated conceptual illustration of the working scope and method. It is not a product screen, measured result or completed test.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the practical scenario. Its objects explain the idea; they do not represent actual measurements, permissions or completed actions.",
    "screenshotCaption": "Actual GrantTap interface, build 250, captured 2026-11-04, sample data. It shows the controls, not a completed live operation."
  },
  "ru": {
      body: reviewRU,
    "title": "Ревью правок агента с телефона: от Files до приёмки",
    "summary": "Пошаговое мобильное ревью: Task и Execution, область запроса, Modified и All files, тесты, дочерние разговоры и отличие принятой правки от опубликованного релиза.",
    "category": "Практика GrantTap",
    "closing": "Свяжите запрос, конкретную правку, содержательную проверку и принимаемый результат.",
    "sources": [
      {
        "label": "GrantTap: Files and activity",
        "url": "/guide/transcript-sources"
      },
      {
        "label": "GrantTap: task identity",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: audit evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "Git: diff documentation",
        "url": "https://git-scm.com/docs/git-diff"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Сгенерированная концептуальная иллюстрация: область и метод работы. Это не экран приложения, результат измерений или выполненная проверка.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация практического сценария. Предметы объясняют идею и не изображают реальные показатели, права или завершённые действия.",
    "screenshotCaption": "Настоящий интерфейс GrantTap, сборка 250, снимок 2026-11-04, учебные данные. Снимок показывает элементы управления, не подтверждая live-операцию."
  }
}),
composeStory({
  "slug": "granttap-agent-processes-cpu-memory-disk",
  "date": "2026-10-28",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-backfill/resources-cover.webp",
  "inlineIllustration": "/blog/october2026-backfill/resources-ownership.webp",
  "additionalIllustration": "/blog/october2026-backfill/resources-recovery.webp",
  "screenshot": "/guide/screens/computer-controls.png",
  "en": {
      body: resourcesEN,
    "title": "Why is the agent computer busy? Read processes, CPU, memory and disk",
    "summary": "Investigate local load by ownership, interval and useful work. Understand process groups, measured versus attributed use, safe cache cleanup, runtime versions and targeted restarts.",
    "category": "GrantTap field guide",
    "closing": "Keep projects intact, stop only understood work and verify that the intended agent route still responds.",
    "sources": [
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      },
      {
        "label": "GrantTap: cache and storage",
        "url": "/guide/cache-storage"
      },
      {
        "label": "GrantTap: resource attribution",
        "url": "/guide/transcript-sources#resources"
      },
      {
        "label": "Apple: CPU activity in Activity Monitor",
        "url": "https://support.apple.com/guide/activity-monitor/view-cpu-activity-actmntr43452/mac"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "AI-generated conceptual illustration of the working scope and method. It is not a product screen, measured result or completed test.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the practical scenario. Its objects explain the idea; they do not represent actual measurements, permissions or completed actions.",
    "screenshotCaption": "Actual GrantTap interface, build 250, captured 2026-11-04, sample data. It shows the controls, not a completed live operation."
  },
  "ru": {
      body: resourcesRU,
    "title": "Почему компьютер агента загружен: процессы, CPU, память и диск",
    "summary": "Исследуйте нагрузку по владельцу и времени. Разберите группы процессов, прямые замеры и attributed, очистку кэша, версии runtime и перезапуск в правильной области.",
    "category": "Практика GrantTap",
    "closing": "Сохраняйте проекты, останавливайте понятную работу и проверяйте ответ нужного маршрута агента.",
    "sources": [
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      },
      {
        "label": "GrantTap: cache and storage",
        "url": "/guide/cache-storage"
      },
      {
        "label": "GrantTap: resource attribution",
        "url": "/guide/transcript-sources#resources"
      },
      {
        "label": "Apple: CPU activity in Activity Monitor",
        "url": "https://support.apple.com/guide/activity-monitor/view-cpu-activity-actmntr43452/mac"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Сгенерированная концептуальная иллюстрация: область и метод работы. Это не экран приложения, результат измерений или выполненная проверка.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация практического сценария. Предметы объясняют идею и не изображают реальные показатели, права или завершённые действия.",
    "screenshotCaption": "Настоящий интерфейс GrantTap, сборка 250, снимок 2026-11-04, учебные данные. Снимок показывает элементы управления, не подтверждая live-операцию."
  }
}),
composeStory({
  "slug": "granttap-share-agent-project-colleague-access",
  "date": "2026-10-29",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/october2026-backfill/team-cover.webp",
  "inlineIllustration": "/blog/october2026-backfill/team-scope.webp",
  "additionalIllustration": "/blog/october2026-backfill/team-offboarding.webp",
  "screenshot": "/guide/screens/mesh.png",
  "en": {
      body: teamEN,
    "title": "Bring a colleague into an agent project with clear access",
    "summary": "A collaboration lifecycle across person, device, project and computer: scoped roles, repository grants, useful context, secrets, verified handoff and honest offboarding.",
    "category": "GrantTap field guide",
    "closing": "Make the allowed work understandable, preserve its evidence and remove future access at the right boundary.",
    "sources": [
      {
        "label": "GrantTap: members and roles",
        "url": "/guide/members"
      },
      {
        "label": "GrantTap: project configuration",
        "url": "/guide/project-configuration"
      },
      {
        "label": "GrantTap: handoff",
        "url": "/guide/handoff"
      },
      {
        "label": "GrantTap: account recovery",
        "url": "/guide/account-recovery"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this is a practical guide, not a report of events occurring on that earlier day.",
    "illustrationCaption": "AI-generated conceptual illustration of the working scope and method. It is not a product screen, measured result or completed test.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the practical scenario. Its objects explain the idea; they do not represent actual measurements, permissions or completed actions.",
    "screenshotCaption": "Actual GrantTap interface, build 230, captured 2026-10-27, sample data. It shows the controls, not a completed live operation. Earlier capture; current layout may differ."
  },
  "ru": {
      body: teamRU,
    "title": "Как подключить коллегу к AI-проекту и сохранить границы доступа",
    "summary": "Жизненный цикл сотрудничества: человек, устройство, проект, компьютер, роли, grants репозиториев, контекст, секреты, проверяемый handoff и точечный отзыв.",
    "category": "Практика GrantTap",
    "closing": "Сделайте разрешённую работу понятной, сохраните свидетельства и снимайте будущий доступ в правильной области.",
    "sources": [
      {
        "label": "GrantTap: members and roles",
        "url": "/guide/members"
      },
      {
        "label": "GrantTap: project configuration",
        "url": "/guide/project-configuration"
      },
      {
        "label": "GrantTap: handoff",
        "url": "/guide/handoff"
      },
      {
        "label": "GrantTap: account recovery",
        "url": "/guide/account-recovery"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата в архиве — редакционный слот; это практическое руководство, а не сообщение о событиях того дня.",
    "illustrationCaption": "Сгенерированная концептуальная иллюстрация: область и метод работы. Это не экран приложения, результат измерений или выполненная проверка.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация практического сценария. Предметы объясняют идею и не изображают реальные показатели, права или завершённые действия.",
    "screenshotCaption": "Настоящий интерфейс GrantTap, сборка 230, снимок 2026-10-27, учебные данные. Снимок показывает элементы управления, не подтверждая live-операцию. Более ранний экран; положение элементов текущей версии может отличаться."
  }
})
];
