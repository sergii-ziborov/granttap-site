import { composeStory } from "../compose";
import { body as EN } from "./migration-en";
import { body as RU } from "./migration-ru";

export const migrationStory = composeStory({
  "slug": "granttap-agent-database-migration-rehearsal",
  "date": "2026-10-18",
  "reviewedOn": "2026-11-05", "publishedOn": "2026-11-05",
  "cover": "/blog/practical2026-five/migration-cover.webp",
  "inlineIllustration": "/blog/practical2026-five/migration-backfill.webp",
  "additionalIllustration": "/blog/practical2026-five/migration-restore.webp",
  "en": {
    body: EN,
    "title": "Database migrations with an agent: rehearse the transition and recovery",
    "summary": "Preserved values, concurrent writers, resumable backfills, integrity checks and a demonstrated restore before a live change.",
    "category": "Practical engineering with agents",
    "closing": "Review the data invariant, supported consumers and recovery evidence together.",
    "sources": [
      {
        "label": "PostgreSQL 18: ALTER TABLE",
        "url": "https://www.postgresql.org/docs/18/sql-altertable.html"
      },
      {
        "label": "Prisma: Expand-and-contract migrations",
        "url": "https://www.prisma.io/docs/guides/database/data-migration"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "GrantTap: handoff",
        "url": "/guide/handoff"
      }
    ],
    "editorialNote": "Prepared and checked on November 5, 2026. The archive date is an editorial slot; this practical workshop is not a report of events occurring on that earlier day.",
    "illustrationCaption": "Original AI-generated conceptual illustration. It explains the workshop, not a product screen or a measured result.",
    "additionalIllustrationCaption": "A separate ImageGen illustration of the scenario. It is not evidence that the proposed checks or actions have been performed."
  },
  "ru": {
    body: RU,
    "title": "Миграция базы с агентом: сохранность данных и репетиция восстановления",
    "summary": "Инварианты, конкурентная запись, продолжаемый перенос, проверка целостности и подтверждённое восстановление до live-изменений.",
    "category": "Инженерная практика с агентом",
    "closing": "Оценивайте инвариант данных, поддерживаемых потребителей и свидетельства восстановления вместе.",
    "sources": [
      {
        "label": "PostgreSQL 18: ALTER TABLE",
        "url": "https://www.postgresql.org/docs/18/sql-altertable.html"
      },
      {
        "label": "Prisma: Expand-and-contract migrations",
        "url": "https://www.prisma.io/docs/guides/database/data-migration"
      },
      {
        "label": "GrantTap: evidence",
        "url": "/guide/audit-evidence"
      },
      {
        "label": "GrantTap: handoff",
        "url": "/guide/handoff"
      }
    ],
    "editorialNote": "Материал подготовлен и проверен 5 ноября 2026 года. Дата архива — редакционный слот; практикум не является сообщением о событиях того дня.",
    "illustrationCaption": "Оригинальная сгенерированная иллюстрация практикума. Это не экран продукта и не измеренный результат.",
    "additionalIllustrationCaption": "Отдельная ImageGen-иллюстрация сценария. Она не является свидетельством выполнения предложенных действий и проверок."
  }
});
