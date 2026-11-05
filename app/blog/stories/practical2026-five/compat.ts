import { composeStory } from "../compose";
import { body as EN } from "./compat-en";
import { body as RU } from "./compat-ru";

export const compatStory = composeStory({
  "slug": "granttap-agent-api-client-server-compatibility",
  "date": "2026-10-19",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/practical2026-five/compat-cover.webp",
  "inlineIllustration": "/blog/practical2026-five/compat-matrix.webp",
  "additionalIllustration": "/blog/practical2026-five/compat-rollout.webp",
  "en": {
    body: EN,
    "title": "API compatibility when clients and servers update separately",
    "summary": "Test the supported version pairs, unknown states, queued data, capabilities and rollout order instead of trusting the newest local pair.",
    "category": "Practical engineering with agents",
    "closing": "A compatibility claim should name the version pair, behavior and evidence that support it.",
    "sources": [
      {
        "label": "Google AIP-180: Backwards compatibility",
        "url": "https://google.aip.dev/180"
      },
      {
        "label": "GrantTap: updates",
        "url": "/guide/updates"
      },
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      },
      {
        "label": "GrantTap: provider boundaries",
        "url": "/guide/providers"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this practical workshop is not a report of events occurring on that earlier day.",
    "illustrationCaption": "Original AI-generated conceptual illustration. It explains the workshop, not a product screen or a measured result.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the scenario. It is not evidence that the proposed checks or actions have been performed."
  },
  "ru": {
    body: RU,
    "title": "Совместимость API, когда клиент и сервер обновляются не одновременно",
    "summary": "Матрица версий, неизвестные состояния, сохранённая очередь, capabilities и порядок выпуска вместо проверки одной новой пары.",
    "category": "Инженерная практика с агентом",
    "closing": "Утверждение о совместимости называет пару версий, поведение и подтверждающее наблюдение.",
    "sources": [
      {
        "label": "Google AIP-180: Backwards compatibility",
        "url": "https://google.aip.dev/180"
      },
      {
        "label": "GrantTap: updates",
        "url": "/guide/updates"
      },
      {
        "label": "GrantTap: device management",
        "url": "/guide/device-management"
      },
      {
        "label": "GrantTap: provider boundaries",
        "url": "/guide/providers"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата архива — редакционный слот; практикум не является сообщением о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не экран продукта и не измеренный результат.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Она не является свидетельством выполнения предложенных действий и проверок."
  }
});
