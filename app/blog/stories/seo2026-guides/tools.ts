import { composeStory } from "../compose";
import EN from "./tools-en.md?raw";
import RU from "./tools-ru.md?raw";

export const toolsStory = composeStory({
  "slug": "granttap-mcp-skills-hooks-practical-guide",
  "date": "2026-10-08",
  "reviewedOn": "2026-11-05",
  "publishedOn": "2026-11-05",
  "cover": "/blog/seo2026-guides/tools-cover.webp",
  "inlineIllustration": "/blog/seo2026-guides/tools-workflow.webp",
  "additionalIllustration": "/blog/seo2026-guides/tools-check.webp",
  "en": {
    body: EN,
    "title": "MCP, skills and hooks: choose the right agent extension",
    "summary": "A working map of tools, reusable instructions and lifecycle events, with a small fixture that separates availability, permission and actual use.",
    "closing": "Choose the extension that owns the missing behavior, then verify it in a bounded task.",
    "category": "Practical agent workflows",
    "sources": [
      {
        "label": "Claude Code: MCP",
        "url": "https://code.claude.com/docs/en/mcp"
      },
      {
        "label": "Claude Code: skills",
        "url": "https://code.claude.com/docs/en/skills"
      },
      {
        "label": "Claude Code: hooks",
        "url": "https://code.claude.com/docs/en/hooks"
      },
      {
        "label": "OpenAI: skills",
        "url": "https://developers.openai.com/plugins/concepts/skills"
      },
      {
        "label": "GrantTap: capability catalog",
        "url": "/guide/capability-catalog"
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
          "title": "State the missing behavior",
          "detail": "Name the operation, reusable guidance or event you need. Do not install all three mechanisms by default.",
          "code": "Goal: inspect one fixture file\nAllowed scope: the dedicated test folder\nExpected evidence: operation result and correlation\nNegative case: outside that scope remains denied"
        },
        {
          "title": "Test a single fixture",
          "detail": "Use a harmless dedicated task and record both the allowed result and the expected refusal. A catalog entry alone is not proof of use."
        },
        {
          "title": "Check the boundary",
          "detail": "Keep provider permissions, GrantTap policy and confirmed execution separate in the result."
        }
      ]
    }
  },
  "ru": {
    body: RU,
    "title": "MCP, skills и hooks: какое расширение агента вам действительно нужно",
    "summary": "Практическая карта инструментов, повторяемых инструкций и событий: проверяем доступность, разрешение и настоящее использование на небольшом примере.",
    "closing": "Выберите механизм, которому принадлежит нужное поведение, и проверьте его на ограниченной задаче.",
    "category": "Работа агента на практике",
    "sources": [
      {
        "label": "Claude Code: MCP",
        "url": "https://code.claude.com/docs/en/mcp"
      },
      {
        "label": "Claude Code: skills",
        "url": "https://code.claude.com/docs/en/skills"
      },
      {
        "label": "Claude Code: hooks",
        "url": "https://code.claude.com/docs/en/hooks"
      },
      {
        "label": "OpenAI: skills",
        "url": "https://developers.openai.com/plugins/concepts/skills"
      },
      {
        "label": "GrantTap: capability catalog",
        "url": "/guide/capability-catalog"
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
          "title": "Определите недостающее поведение",
          "detail": "Назовите нужную операцию, повторяемую инструкцию или событие. Не устанавливайте все три механизма по умолчанию.",
          "code": "Goal: inspect one fixture file\nAllowed scope: the dedicated test folder\nExpected evidence: operation result and correlation\nNegative case: outside that scope remains denied"
        },
        {
          "title": "Проверьте один fixture",
          "detail": "Используйте отдельную безопасную задачу. Запишите разрешённый результат и ожидаемый отказ. Запись каталога ещё не доказывает использование."
        },
        {
          "title": "Проверьте границу",
          "detail": "Отдельно укажите разрешения провайдера, политику GrantTap и подтверждённое выполнение."
        }
      ]
    }
  }
});
