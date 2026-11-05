import { composeStory } from "../compose";
import { body as EN } from "./build-en";
import { body as RU } from "./build-ru";

export const buildStory = composeStory({
  "slug": "granttap-agent-long-builds-process-results",
  "date": "2026-10-15",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/practical2026-five/build-cover.webp",
  "inlineIllustration": "/blog/practical2026-five/build-pipeline.webp",
  "additionalIllustration": "/blog/practical2026-five/build-recovery.webp",
  "en": {
    body: EN,
    "title": "Long builds without guesswork: processes, pipelines and artifacts",
    "summary": "Keep the original run identifiable, catch intermediate failures, recover after interruption and verify the actual artifact.",
    "category": "Practical engineering with agents",
    "closing": "Inspect the original run and its artifact before deciding to create another build.",
    "sources": [
      {
        "label": "Node.js: Child process",
        "url": "https://nodejs.org/api/child_process.html"
      },
      {
        "label": "GNU Bash: Pipelines",
        "url": "https://www.gnu.org/software/bash/manual/html_node/Pipelines.html"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this practical workshop is not a report of events occurring on that earlier day.",
    "illustrationCaption": "Original AI-generated conceptual illustration. It explains the workshop, not a product screen or a measured result.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the scenario. It is not evidence that the proposed checks or actions have been performed."
  },
  "ru": {
    body: RU,
    "title": "Долгая сборка без догадок: процесс, pipeline и настоящий результат",
    "summary": "Как сохранить исходный запуск, заметить промежуточный отказ, вернуться после обрыва и проверить собранный артефакт.",
    "category": "Инженерная практика с агентом",
    "closing": "Перед повторной сборкой проверьте исходный запуск и относящийся к нему артефакт.",
    "sources": [
      {
        "label": "Node.js: Child process",
        "url": "https://nodejs.org/api/child_process.html"
      },
      {
        "label": "GNU Bash: Pipelines",
        "url": "https://www.gnu.org/software/bash/manual/html_node/Pipelines.html"
      },
      {
        "label": "GrantTap: Task and Execution",
        "url": "/guide/task-execution"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата архива — редакционный слот; практикум не является сообщением о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не экран продукта и не измеренный результат.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Она не является свидетельством выполнения предложенных действий и проверок."
  }
});
