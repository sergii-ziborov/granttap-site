import { composeStory } from "../compose";
import { body as EN } from "./config-en";
import { body as RU } from "./config-ru";

export const configStory = composeStory({
  "slug": "granttap-agent-environment-config-secrets",
  "date": "2026-10-17",
  "reviewedOn": "2026-11-05",
  "cover": "/blog/practical2026-five/config-cover.webp",
  "inlineIllustration": "/blog/practical2026-five/config-validation.webp",
  "additionalIllustration": "/blog/practical2026-five/config-rotation.webp",
  "en": {
    body: EN,
    "title": "Configure an agent project without putting secrets in the chat",
    "summary": "A reproducible environment contract: required fields, validation, precedence, process lifecycle and separate authentication layers.",
    "category": "Practical engineering with agents",
    "closing": "Find the missing condition at the right layer and verify the process that actually consumes it.",
    "sources": [
      {
        "label": "Node.js: Environment variables",
        "url": "https://nodejs.org/api/environment_variables.html"
      },
      {
        "label": "Git: gitignore",
        "url": "https://git-scm.com/docs/gitignore"
      },
      {
        "label": "GrantTap: provider sign-in",
        "url": "/guide/provider-sign-in"
      },
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this practical workshop is not a report of events occurring on that earlier day.",
    "illustrationCaption": "Original AI-generated conceptual illustration. It explains the workshop, not a product screen or a measured result.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the scenario. It is not evidence that the proposed checks or actions have been performed."
  },
  "ru": {
    body: RU,
    "title": "Окружение агента без секретов в чате: от настройки до работающего процесса",
    "summary": "Воспроизводимый контракт конфигурации: обязательные поля, валидация, порядок источников, lifecycle процесса и уровни авторизации.",
    "category": "Инженерная практика с агентом",
    "closing": "Найдите недостающее условие на правильном слое и проверьте настоящий процесс-потребитель.",
    "sources": [
      {
        "label": "Node.js: Environment variables",
        "url": "https://nodejs.org/api/environment_variables.html"
      },
      {
        "label": "Git: gitignore",
        "url": "https://git-scm.com/docs/gitignore"
      },
      {
        "label": "GrantTap: provider sign-in",
        "url": "/guide/provider-sign-in"
      },
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата архива — редакционный слот; практикум не является сообщением о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не экран продукта и не измеренный результат.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Она не является свидетельством выполнения предложенных действий и проверок."
  }
});
