import { composeStory } from "../compose";
import EN from "./checkout-en.md?raw";
import RU from "./checkout-ru.md?raw";

export const checkoutStory = composeStory({
  "slug": "granttap-agent-wrong-checkout-worktree",
  "date": "2026-10-12",
  "reviewedOn": "2026-11-05",
  "publishedOn": "2026-11-05",
  "cover": "/blog/seo2026-guides/checkout-cover.webp",
  "inlineIllustration": "/blog/seo2026-guides/checkout-identity.webp",
  "additionalIllustration": "/blog/seo2026-guides/checkout-handoff.webp",
  "en": {
    body: EN,
    "title": "The agent changed the file. Why is the app still old?",
    "summary": "Trace the real workspace, Git revision, local edits, build inputs and deployed artifact before repeating a correct change in the wrong checkout.",
    "closing": "Keep the Task stable and make the source-to-artifact relationship explicit.",
    "category": "Practical agent workflows",
    "sources": [
      {
        "label": "Git: worktree",
        "url": "https://git-scm.com/docs/git-worktree"
      },
      {
        "label": "Git: status",
        "url": "https://git-scm.com/docs/git-status"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: handoff",
        "url": "/guide/handoff"
      }
    ],
    "editorialNote": "Prepared and reviewed on November 5, 2026. The earlier date is an archive slot, not the original publication date or a news report from that day. Diagnostic scenarios are proposed checks, not claims about tests performed on your device.",
    "illustrationCaption": "Original AI-generated illustration of the article’s idea, not an application screen or a measured result.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the scenario. Actual observations and captures are identified separately.",
    "practice": {
      "title": "Try a focused check",
      "intro": "Use a dedicated test Task and the intended authorized working directory.",
      "steps": [
        {
          "title": "Identify the actual source root",
          "detail": "Run pwd first. Use the Git commands only when the folder is a repository; a non-Git workspace is valid.",
          "code": "pwd -P\ngit rev-parse --show-toplevel\ngit rev-parse HEAD\ngit status --short --branch\ngit worktree list --porcelain"
        },
        {
          "title": "Connect the build",
          "detail": "Record which directory the actual build or serving process reads, including relevant generated inputs."
        },
        {
          "title": "Verify the destination",
          "detail": "After transfer, ask the destination execution to identify the folder, revision and expected file before editing."
        }
      ]
    }
  },
  "ru": {
    body: RU,
    "title": "Агент изменил файл, а приложение старое: проверьте checkout",
    "summary": "Рабочая папка, Git-ревизия, локальные правки, входы сборки и развёрнутый артефакт: найдите расхождение до повторного редактирования.",
    "closing": "Сохраните цель Task и явно установите связь между исходниками и наблюдаемым артефактом.",
    "category": "Работа агента на практике",
    "sources": [
      {
        "label": "Git: worktree",
        "url": "https://git-scm.com/docs/git-worktree"
      },
      {
        "label": "Git: status",
        "url": "https://git-scm.com/docs/git-status"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: handoff",
        "url": "/guide/handoff"
      }
    ],
    "editorialNote": "Подготовлено и проверено 5 ноября 2026 года. Более ранняя дата — слот архива, а не дата первоначальной публикации или новость того дня. Сценарии диагностики — предлагаемые проверки, а не утверждение об их выполнении на вашем устройстве.",
    "illustrationCaption": "Оригинальная AI-иллюстрация идеи статьи. Это не экран приложения и не результат измерения.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Настоящие наблюдения и скриншоты обозначаются отдельно.",
    "practice": {
      "title": "Короткая проверка",
      "intro": "Используйте отдельную тестовую Task и только разрешённую рабочую папку.",
      "steps": [
        {
          "title": "Определите настоящий корень",
          "detail": "Сначала выполните pwd. Git-команды нужны только для репозитория; папка без Git тоже является рабочей областью.",
          "code": "pwd -P\ngit rev-parse --show-toplevel\ngit rev-parse HEAD\ngit status --short --branch\ngit worktree list --porcelain"
        },
        {
          "title": "Свяжите сборку с исходниками",
          "detail": "Запишите папку, которую действительно читает сборка или сервер, включая важные generated-входы."
        },
        {
          "title": "Проверьте назначение",
          "detail": "После transfer попросите destination-execution определить папку, ревизию и нужный файл до редактирования."
        }
      ]
    }
  }
});
