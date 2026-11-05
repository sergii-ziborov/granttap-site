import { composeStory } from "../compose";
import { body as EN } from "./calendar-en";
import { body as RU } from "./calendar-ru";

export const calendarStory = composeStory({
  "slug": "granttap-agent-time-zones-calendar-tests",
  "date": "2026-10-14",
  "reviewedOn": "2026-11-05",
  "cover": "/blog/practical2026-five/calendar-cover.webp",
  "inlineIllustration": "/blog/practical2026-five/calendar-boundary.webp",
  "additionalIllustration": "/blog/practical2026-five/calendar-evidence.webp",
  "en": {
    body: EN,
    "title": "Time zones and calendar rules: give an agent the right temporal contract",
    "summary": "A practical workshop on publication dates, expiry, recurrence, fixed clocks and boundary tests across devices and locales.",
    "category": "Practical engineering with agents",
    "closing": "Keep the temporal meaning explicit, then test the boundary that determines the user outcome.",
    "sources": [
      {
        "label": "IANA: Time Zone Database",
        "url": "https://www.iana.org/time-zones"
      },
      {
        "label": "Unicode: Date and time formatting",
        "url": "https://www.unicode.org/reports/tr35/tr35-dates.html"
      },
      {
        "label": "GrantTap: automations",
        "url": "/guide/automations"
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
    "title": "Даты и часовые пояса: какие правила нужно объяснить агенту",
    "summary": "Практикум о дне публикации, сроке ссылки, повторении, управляемых часах и проверке границ между устройствами и языками.",
    "category": "Инженерная практика с агентом",
    "closing": "Сначала определите смысл времени, затем проверьте границу пользовательского результата.",
    "sources": [
      {
        "label": "IANA: Time Zone Database",
        "url": "https://www.iana.org/time-zones"
      },
      {
        "label": "Unicode: Date and time formatting",
        "url": "https://www.unicode.org/reports/tr35/tr35-dates.html"
      },
      {
        "label": "GrantTap: automations",
        "url": "/guide/automations"
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
